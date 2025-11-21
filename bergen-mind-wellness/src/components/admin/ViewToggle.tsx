'use client'

import { Button } from '@/components/ui/button'
import { List, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'list' | 'grid'

interface ViewToggleProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

/**
 * Toggle button to switch between List and Grid views
 *
 * Uses segmented control pattern with visual active state
 */
export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-1"
      role="tablist"
      aria-label="View mode"
    >
      {/* List View Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2 transition-all",
          view === 'list' && "bg-neutral-100 text-neutral-900 shadow-sm"
        )}
        onClick={() => onViewChange('list')}
        role="tab"
        aria-selected={view === 'list'}
        aria-controls="availability-content"
        data-testid="view-toggle-list"
      >
        <List className="h-4 w-4" />
        List
      </Button>

      {/* Grid View Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2 transition-all",
          view === 'grid' && "bg-neutral-100 text-neutral-900 shadow-sm"
        )}
        onClick={() => onViewChange('grid')}
        role="tab"
        aria-selected={view === 'grid'}
        aria-controls="availability-content"
        data-testid="view-toggle-grid"
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </Button>
    </div>
  )
}
