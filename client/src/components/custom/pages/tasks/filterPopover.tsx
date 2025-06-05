'use client'

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export type FilterValue = {
  type?: string[]
  priority?: string[]
  status?: string[]
}

type FilterPopoverProps = {
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (filters: FilterValue) => void
  activeFilters: FilterValue
}

const typeOptions = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'task', label: 'Task' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const statusOptions = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived' }
]

export default function FilterPopover({
  onFilterChange,
  activeFilters
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValue>(activeFilters)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [lastAppliedFilters, setLastAppliedFilters] =
    useState<FilterValue>(activeFilters)

  useEffect(() => {
    setFilters(activeFilters)
    const count =
      (activeFilters.type?.length || 0) + 
      (activeFilters.priority?.length || 0) + 
      (activeFilters.status?.length || 0)
    setActiveFilterCount(count)
  }, [activeFilters])

  const handleCheckboxChange = (key: keyof FilterValue, value: string) => {
    const arr = filters[key] || []
    setFilters({
      ...filters,
      [key]: arr.includes(value)
        ? arr.filter((v: string) => v !== value)
        : [...arr, value]
    })
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setLastAppliedFilters(filters)
    setOpen(false)
  }

  const resetFilters = () => {
    const emptyFilters: FilterValue = { type: [], priority: [], status: [] }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="relative">
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (isOpen) {
            setFilters(lastAppliedFilters)
          }
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-primary relative">
                  <Filter className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter Tasks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Tasks</h4>
              {(filters.type?.length || 0) > 0 ||
              (filters.priority?.length || 0) > 0 ||
              (filters.status?.length || 0) > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2 text font-normal"
                >
                  Reset all
                </Button>
              ) : null}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.type?.includes(opt.value) || false}
                      onCheckedChange={() =>
                        handleCheckboxChange('type', opt.value)
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.priority?.includes(opt.value) || false}
                      onCheckedChange={() =>
                        handleCheckboxChange('priority', opt.value)
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.status?.includes(opt.value) || false}
                      onCheckedChange={() =>
                        handleCheckboxChange('status', opt.value)
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false)
                  // If no filters were applied before, reset all
                  if (
                    (!lastAppliedFilters.type ||
                      lastAppliedFilters.type.length === 0) &&
                    (!lastAppliedFilters.priority ||
                      lastAppliedFilters.priority.length === 0) &&
                    (!lastAppliedFilters.status ||
                      lastAppliedFilters.status.length === 0)
                  ) {
                    const emptyFilters: FilterValue = { type: [], priority: [], status: [] }
                    setFilters(emptyFilters)
                    onFilterChange(emptyFilters)
                  } else {
                    setFilters(lastAppliedFilters)
                    onFilterChange(lastAppliedFilters)
                  }
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}