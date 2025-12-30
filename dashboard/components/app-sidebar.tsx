"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Menu,
    Box,
    FileCode,
    Settings,
    Zap,
    Github,
    LayoutDashboard,
    ShieldAlert
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 bg-card border-r w-64 hidden md:block h-screen fixed left-0 top-0", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary flex items-center gap-2">
                        <Box className="w-5 h-5" />
                        ChainSpec
                    </h2>
                    <div className="space-y-1">
                        <Link href="/dashboard">
                            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Projects
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Development
                    </h2>
                    <div className="space-y-1">
                        <Link href="/project/new">
                            <Button variant="ghost" className="w-full justify-start">
                                <FileCode className="mr-2 h-4 w-4" />
                                New Spec
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 w-full px-6">
                <Separator className="my-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-xs text-primary">C</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">ChainSpec</span>
                        <span className="text-xs">HackXios 2K25</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-card">
                <div className="space-y-4 py-4 h-full">
                    {/* Replicated content for mobile */}
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary flex items-center gap-2">
                            <Box className="w-5 h-5" />
                            ChainSpec
                        </h2>
                        <div className="space-y-1">
                            <Button variant="secondary" className="w-full justify-start">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Projects
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
