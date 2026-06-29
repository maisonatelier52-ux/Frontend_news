interface StatCardProps {
  label: string
  value: string | number
  change?: string
  positive?: boolean
  icon: React.ReactNode
}

export default function StatCard({ label, value, change, positive, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-transform hover:-translate-y-[1px]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#64748b] font-semibold">{label}</span>
        <span className="w-[34px] h-[34px] bg-[#eff6ff] rounded-lg flex items-center justify-center text-[#1e1b4b] shadow-[0_2px_8px_rgba(30,27,75,0.08)]">
          {icon}
        </span>
      </div>
      <div>
        <div className="text-[26px] font-bold text-[#1e1b4b] leading-none tracking-tight">{value}</div>
        {change && (
          <div className={`mt-2 text-[12px] ${positive ? 'text-[#16a34a] font-bold' : 'text-[#dc2626] font-medium'} flex items-center gap-[3px]`}>
            <span>{positive ? '↑' : '↓'}</span>
            <span>{change} from last week</span>
          </div>
        )}
      </div>
    </div>
  )
}
