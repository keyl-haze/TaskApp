import { Badge } from "@/components/ui/badge"
import { CircleDashed, Loader, CircleCheckBig, Archive } from "lucide-react"

type StatusType = "to_do" | "in_progress" | "done" | "archived"

const statusConfig: Record<StatusType, {
  icon: React.ElementType
  color: string
  label: string
  iconColor: string
}> = {
  to_do: {
    icon: CircleDashed,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    label: "To Do",
    iconColor: "text-slate-600"
  },
  in_progress: {
    icon: Loader,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "In Progress",
    iconColor: "text-blue-600"
  },
  done: {
    icon: CircleCheckBig,
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Done",
    iconColor: "text-green-600"
  },
  archived: {
    icon: Archive,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    label: "Archived",
    iconColor: "text-gray-600"
  }
}

export function StatusBadge({ status }: { status: StatusType | string }) {
  const config =
    statusConfig[status as StatusType] || statusConfig["to_do"]
  const Icon = config.icon
  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1 w-fit`}
    >
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      {config.label}
    </Badge>
  )
}