// AquaFlow Backend API Client
// Configure the base URL to point to your backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  return res.json();
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

// Meters
export const metersApi = {
  getAll: () => request<ApiResponse<Meter[]>>('/api/v1/meters'),
  getByNumber: (meterNumber: string) => request<ApiResponse<Meter>>(`/api/v1/meters/${meterNumber}`),
  recordReading: (meterNumber: string, currentReading: number) =>
    request<ApiResponse<Meter>>('/api/v1/meters/reading', {
      method: 'POST',
      body: JSON.stringify({ meterNumber, currentReading }),
    }),
  calculateBill: (meterNumber: string, currentReading: number) =>
    request<ApiResponse<BillCalculation>>('/api/v1/meters/calculate-bill', {
      method: 'POST',
      body: JSON.stringify({ meterNumber, currentReading }),
    }),
  generateBill: (meterNumber: string) =>
    request<ApiResponse<WaterBill>>(`/api/v1/meters/${meterNumber}/generate-bill`, { method: 'POST' }),
  getBills: (meterNumber: string) =>
    request<ApiResponse<WaterBill[]>>(`/api/v1/meters/${meterNumber}/bills`),
  getUnpaidBills: () =>
    request<ApiResponse<WaterBill[]>>('/api/v1/meters/bills/unpaid'),
};

// STK Push
export const stkApi = {
  initiate: (meterNumber: string, phone: string, amount: number, description?: string) =>
    request<ApiResponse<StkPushResponse>>('/api/v1/mpesa/stk/push', {
      method: 'POST',
      body: JSON.stringify({ meterNumber, phone, amount, description }),
    }),
  getStatus: (checkoutRequestId: string) =>
    request<ApiResponse<StkPushResponse>>(`/api/v1/mpesa/stk/status/${checkoutRequestId}`),
  getByMeter: (meterNumber: string) =>
    request<ApiResponse<StkPushResponse[]>>(`/api/v1/mpesa/stk/meter/${meterNumber}`),
};

// Transactions
export const transactionsApi = {
  getByTransId: (transId: string) =>
    request<ApiResponse<C2BTransaction>>(`/api/v1/transactions/${transId}`),
  getByAccount: (accountNumber: string) =>
    request<ApiResponse<C2BTransaction[]>>(`/api/v1/transactions/account/${accountNumber}`),
  getByPhone: (msisdn: string) =>
    request<ApiResponse<C2BTransaction[]>>(`/api/v1/transactions/phone/${msisdn}`),
};

// Onboarding
export const onboardApi = {
  submit: (data: {
    firstName: string; lastName: string; email: string;
    phone: string; nationalId: string; propertyName: string; unitNumber: string;
  }) => request<ApiResponse<string>>('/api/v1/onboard', { method: 'POST', body: JSON.stringify(data) }),
};

// Health
export const healthApi = {
  check: () => request<{ status: string; service: string }>('/health'),
};
