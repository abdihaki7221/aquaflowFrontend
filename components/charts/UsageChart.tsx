'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts'

interface ChartData {
  name: string
  value: number
  value2?: number
}

interface UsageChartProps {
  title: string
  subtitle?: string
  data: ChartData[]
  type?: 'area' | 'bar' | 'line'
  color?: string
  secondaryColor?: string
  showGrid?: boolean
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/20">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.dataKey === 'value' ? 'Usage' : 'Revenue'}: {entry.value.toLocaleString()}
            {entry.dataKey === 'value' ? ' L' : ' $'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function UsageChart({ title, subtitle, data, type = 'area', color = '#00a9ff', secondaryColor = '#4dc8ff', showGrid = true, height = 300 }: UsageChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            {data[0]?.value2 !== undefined && <Bar dataKey="value2" fill={secondaryColor} radius={[4, 4, 0, 0]} />}
          </BarChart>
        )
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ fill: color, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: color }} />
            {data[0]?.value2 !== undefined && <Line type="monotone" dataKey="value2" stroke={secondaryColor} strokeWidth={3} dot={{ fill: secondaryColor, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: secondaryColor }} />}
          </LineChart>
        )
      default:
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            {data[0]?.value2 !== undefined && <Area type="monotone" dataKey="value2" stroke={secondaryColor} strokeWidth={2} fillOpacity={1} fill="url(#colorValue2)" />}
          </AreaChart>
        )
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  )
}