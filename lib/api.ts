// AquaFlow Backend API Client
// Matches actual backend at https://aquaflow-service-production-9f01.up.railway.app
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aquaflow-service-production-9f01.up.railway.app';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  console.log(`[API] ${options?.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('[API] Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server returned non-JSON response (status ${res.status})`);
    }

    if (!res.ok) {
      console.error('[API] Error response:', data);
      throw new Error(data.message || `API error: ${res.status}`);
    }

    return data;
  } catch (err: any) {
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Cannot reach the server. Please check your connection.');
    }
    throw err;
  }
}

// ---- Types matching backend DTOs ----
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Meter {
  id: number;
  meterNumber: string;
  tenantName: string;
  unitNumber: string;
  phone: string;
  email: string;
  address: string;
  previousReading: number;
  currentReading: number;
  lastReadDate: string;
  status: string;
}

export interface TierBreakdown {
  tier: string;
  units: number;
  rate: number;
  subtotal: number;
}

export interface BillCalculation {
  meterNumber: string;
  tenantName: string;
  previousReading: number;
  currentReading: number;
  usageLitres: number;
  unitsConsumed: number;
  totalAmount: number;
  breakdown: TierBreakdown[];
}

export interface WaterBill {
  id: number;
  meterId: number;
  meterNumber: string;
  billingPeriod: string;
  previousReading: number;
  currentReading: number;
  usageLitres: number;
  unitsConsumed: number;
  amount: number;
  status: string;
  paidAt: string | null;
  mpesaReceipt: string | null;
  createdAt: string;
}

export interface StkPushResponse {
  id: number;
  checkoutRequestId: string;
  merchantRequestId: string;
  meterNumber: string;
  phone: string;
  amount: number;
  status: string;
  mpesaReceiptNumber: string | null;
  createdAt: string;
}

export interface C2BTransaction {
  id: number;
  transactionType: string;
  transId: string;
  transAmount: number;
  billRefNumber: string;
  msisdn: string;
  customerName: string;
  status: string;
  b2bDisbursed: boolean;
  createdAt: string;
}

// ---- API Functions ----

// Backend: StkPushController @RequestMapping("/api/v1")
export const stkApi = {
  initiate: (meterNumber: string, phone: string, amount: number, description?: string) =>
    request<ApiResponse<StkPushResponse>>('/api/v1/push', {
      method: 'POST',
      body: JSON.stringify({ meterNumber, phone, amount, description }),
    }),

  getStatus: (checkoutRequestId: string) =>
    request<ApiResponse<StkPushResponse>>(`/api/v1/status/${checkoutRequestId}`),

  getByMeter: (meterNumber: string) =>
    request<ApiResponse<StkPushResponse[]>>(`/api/v1/meter/${meterNumber}`),

  pollStatus: async (checkoutRequestId: string, maxAttempts = 30, intervalMs = 3000): Promise<StkPushResponse> => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, intervalMs));
      try {
        const resp = await stkApi.getStatus(checkoutRequestId);
        const status = resp.data.status;
        console.log(`[STK Poll] Attempt ${i + 1}: status=${status}`);
        if (status === 'SUCCESS' || status === 'FAILED' || status === 'CANCELLED') {
          return resp.data;
        }
      } catch (err) {
        console.warn(`[STK Poll] Attempt ${i + 1} failed:`, err);
      }
    }
    throw new Error('Payment status check timed out. The payment may still be processing.');
  },
};

// Backend: MeterController @RequestMapping("/api/v1/meters")
export const metersApi = {
  getAll: () => request<ApiResponse<Meter[]>>('/api/v1/meters'),
  getByNumber: (meterNumber: string) => request<ApiResponse<Meter>>(`/api/v1/meters/${meterNumber}`),
  recordReading: (meterNumber: string, currentReading: number) =>
    request<ApiResponse<Meter>>('/api/v1/meters/reading', {
      method: 'POST', body: JSON.stringify({ meterNumber, currentReading }),
    }),
  calculateBill: (meterNumber: string, currentReading: number) =>
    request<ApiResponse<BillCalculation>>('/api/v1/meters/calculate-bill', {
      method: 'POST', body: JSON.stringify({ meterNumber, currentReading }),
    }),
  generateBill: (meterNumber: string) =>
    request<ApiResponse<WaterBill>>(`/api/v1/meters/${meterNumber}/generate-bill`, { method: 'POST' }),
  getBills: (meterNumber: string) =>
    request<ApiResponse<WaterBill[]>>(`/api/v1/meters/${meterNumber}/bills`),
  getUnpaidBills: () =>
    request<ApiResponse<WaterBill[]>>('/api/v1/meters/bills/unpaid'),
};

// Backend: TransactionQueryController @RequestMapping("/api/v1/transactions")
export const transactionsApi = {
  getByTransId: (transId: string) =>
    request<ApiResponse<C2BTransaction>>(`/api/v1/transactions/${transId}`),
  getByAccount: (accountNumber: string) =>
    request<ApiResponse<C2BTransaction[]>>(`/api/v1/transactions/account/${accountNumber}`),
  getByPhone: (msisdn: string) =>
    request<ApiResponse<C2BTransaction[]>>(`/api/v1/transactions/phone/${msisdn}`),
};

// Backend: OnboardController @RequestMapping("/api/v1/onboard")
export const onboardApi = {
  submit: (data: {
    firstName: string; lastName: string; email: string;
    phone: string; nationalId: string; propertyName: string; unitNumber: string;
  }) => request<ApiResponse<string>>('/api/v1/onboard', { method: 'POST', body: JSON.stringify(data) }),
};

export const healthApi = {
  check: () => request<{ status: string; service: string }>('/health'),
};
