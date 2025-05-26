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
  role?: string[]
  status?: string[]
}

type FilterPopoverProps = {
  onFilterChange: (filters: FilterValue) => void
  activeFilters: FilterValue
}

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'viewer', label: 'Viewer' }
]

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Wait', label: 'Wait' }
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
      (activeFilters.role?.length || 0) + (activeFilters.status?.length || 0)
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
    const emptyFilters: FilterValue = { role: [], status: [] }
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
                <Button
                  variant="outline"
                  className="text-primary relative"
                >
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
              <p>Filter Users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Users</h4>
              {(filters.role?.length || 0) > 0 ||
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
              <Label>Role</Label>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.role?.includes(opt.value) || false}
                      onCheckedChange={() =>
                        handleCheckboxChange('role', opt.value)
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
                    (!lastAppliedFilters.role ||
                      lastAppliedFilters.role.length === 0) &&
                    (!lastAppliedFilters.status ||
                      lastAppliedFilters.status.length === 0)
                  ) {
                    const emptyFilters: FilterValue = { role: [], status: [] }
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
