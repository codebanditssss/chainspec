"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Fake resizable layout using flex
 * Hackathon-safe, zero dependency risk
 */

function ResizablePanelGroup({
  className,
  direction = "horizontal",
  children,
}: {
  className?: string
  direction?: "horizontal" | "vertical"
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="resizable-panel-group"
      data-panel-group-direction={direction}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className
      )}
    >
      {children}
    </div>
  )
}

function ResizablePanel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="resizable-panel"
      className={cn("flex-1 overflow-hidden", className)}
    >
      {children}
    </div>
  )
}

function ResizableHandle({
  withHandle,
  className,
}: {
  withHandle?: boolean
  className?: string
}) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        "bg-border relative flex w-px items-center justify-center",
        className
      )}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </div>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
