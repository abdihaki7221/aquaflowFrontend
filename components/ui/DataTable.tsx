'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Search, Filter, Download } from 'lucide-react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  title?: string
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  onSearch?: (query: string) => void
  onExport?: () => void
}

export default function DataTable({ columns, data, title, searchable = true, filterable = true, exportable = true, onSearch, onExport }: DataTableProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          
          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 text-sm w-full sm:w-48"
                />
              </div>
            )}
            
            {filterable && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Filter className="w-4 h-4 text-white/70" />
              </motion.button>
            )}
            
            {exportable && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onExport} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4 text-white/70" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="glass-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-white/60">
          Showing <span className="font-medium text-white">1-{Math.min(10, data.length)}</span> of <span className="font-medium text-white">{data.length}</span> results
        </p>
        
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
            <ChevronLeft className="w-4 h-4 text-white/70" />
          </motion.button>
          
          {[1, 2, 3].map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === 1 ? 'bg-water-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {page}
            </motion.button>
          ))}
          
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-white/70" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}