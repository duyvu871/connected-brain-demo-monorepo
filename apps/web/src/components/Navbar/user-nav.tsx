"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@ui/shadcn-ui/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/shadcn-ui/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider
} from "@ui/shadcn-ui/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@ui/shadcn-ui/ui/dropdown-menu";
import { signOut, useSession } from 'next-auth/react';

export function UserNav() {

	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								className="relative h-8 w-8 rounded-full border-zinc-700 bg-zinc-900"
								variant="outline"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage alt="Avatar" src="#" />
									<AvatarFallback className="bg-transparent">CB</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent className="bg-zinc-900" side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent align="end" className="w-56 bg-zinc-900 shadow border-zinc-700" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">John Doe</p>
						<p className="text-xs leading-none text-muted-foreground">
							johndoe@example.com
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild className="hover:cursor-pointer">
						<Link className="flex items-center" href="/dashboard">
							<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="hover:cursor-pointer">
						<Link className="flex items-center" href="/account">
							<User className="w-4 h-4 mr-3 text-muted-foreground" />
							Account
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="hover:cursor-pointer" onClick={() => {
					void signOut();
				}}>
					<LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
