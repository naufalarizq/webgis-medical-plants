import type { PlantCategory } from '@/types'
import { CATEGORY_CONFIG } from '@/utils/categoryConfig'

interface CategoryBadgeProps {
  category: PlantCategory
  className?: string
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category]

  if (!config) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
        Tidak Diketahui
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.badgeClass} ${className}`}
    >
      {config.label}
    </span>
  )
}