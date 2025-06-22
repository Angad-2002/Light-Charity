"use client"
import { Button } from "@/components/ui/button"
import { DonorBadge } from "./donor-badge"

interface BadgeFilterProps {
  onFilterChange: (level: string | null) => void
  activeFilter: string | null
}

export function BadgeFilter({ onFilterChange, activeFilter }: BadgeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium mr-2">Filter by badge:</span>
      <Button
        variant={activeFilter === null ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange(null)}
        className="h-8"
      >
        All
      </Button>
      <Button
        variant={activeFilter === "bronze" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("bronze")}
        className="h-8 flex items-center gap-1"
      >
        <DonorBadge level="bronze" count={1} size="sm" />
        Bronze
      </Button>
      <Button
        variant={activeFilter === "silver" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("silver")}
        className="h-8 flex items-center gap-1"
      >
        <DonorBadge level="silver" count={4} size="sm" />
        Silver
      </Button>
      <Button
        variant={activeFilter === "gold" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("gold")}
        className="h-8 flex items-center gap-1"
      >
        <DonorBadge level="gold" count={7} size="sm" />
        Gold
      </Button>
      <Button
        variant={activeFilter === "lifesaver" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("lifesaver")}
        className="h-8 flex items-center gap-1"
      >
        <DonorBadge level="lifesaver" count={10} size="sm" />
        Lifesaver
      </Button>
    </div>
  )
}
