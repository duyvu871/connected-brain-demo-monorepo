"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@ui/shadcn-ui/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/shadcn-ui/ui/dropdown-menu"

export function ModeToggle() {
	const { setTheme } = useTheme()
	const dropdownItemClass = "cursor-pointer dark:hover:bg-zinc-900 hover:bg-zinc-100 transition-all"
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="font-bold rounded-lg border-zinc-400 dark:border-zinc-800 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-200 dark:hover:text-zinc-50 hover:text-zinc-900" size="icon" variant="outline">
					<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="z-[120] dark:bg-zinc-900 dark:border-zinc-700 border-zinc-400 bg-zinc-100">
				<DropdownMenuItem className={dropdownItemClass} onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem className={dropdownItemClass} onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem className={dropdownItemClass} onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
