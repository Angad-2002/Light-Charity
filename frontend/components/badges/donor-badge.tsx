import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type BadgeLevel = "bronze" | "silver" | "gold" | "lifesaver"

interface DonorBadgeProps {
  level: BadgeLevel
  count: number
  size?: "sm" | "md" | "lg"
}

export function DonorBadge({ level, count, size = "md" }: DonorBadgeProps) {
  const getBadgeColor = () => {
    switch (level) {
      case "bronze":
        return "bg-amber-700"
      case "silver":
        return "bg-gray-400"
      case "gold":
        return "bg-yellow-400"
      case "lifesaver":
        return "bg-red-600"
      default:
        return "bg-gray-300"
    }
  }

  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4 text-[8px]"
      case "md":
        return "h-6 w-6 text-xs"
      case "lg":
        return "h-8 w-8 text-sm"
      default:
        return "h-6 w-6 text-xs"
    }
  }

  const getBadgeTitle = () => {
    const titles = {
      bronze: "Bronze Donor",
      silver: "Silver Donor",
      gold: "Gold Donor",
      lifesaver: "Lifesaver Donor",
    }

    return `${titles[level]}: ${count} Donations`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`${getBadgeColor()} ${getBadgeSize()} rounded-full flex items-center justify-center text-white font-bold`}
            aria-label={getBadgeTitle()}
          >
            {size === "lg" ? count : ""}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getBadgeTitle()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
