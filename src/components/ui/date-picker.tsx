
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: Date | string;
  onSelect?: (date: Date | undefined) => void;
  date?: Date | null; // For backward compatibility
  setDate?: (date: Date | null) => void; // For backward compatibility
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onSelect,
  date, // Support the older API
  setDate, // Support the older API
  className,
  placeholder = "Pick a date",
}: DatePickerProps) {
  // Determine which value to use based on which prop is provided
  const actualValue = value !== undefined ? value : date;
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    actualValue ? (typeof actualValue === 'string' ? new Date(actualValue) : actualValue) : undefined
  )

  // Update internal state when value or date prop changes
  React.useEffect(() => {
    if (actualValue) {
      setSelectedDate(typeof actualValue === 'string' ? new Date(actualValue) : actualValue)
    } else {
      setSelectedDate(undefined)
    }
  }, [actualValue])

  // Handle date selection
  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    
    // Support both old and new APIs
    if (onSelect) {
      onSelect(newDate)
    }
    if (setDate) {
      setDate(newDate || null)
    }
  }

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
