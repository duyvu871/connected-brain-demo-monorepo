import { Button } from '@ui/shadcn-ui/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@repo/utils';

interface SidebarToggleProps {
	isOpen: boolean | undefined;
	setIsOpen?: (state: boolean) => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
	return (
		<div className="invisible lg:visible absolute top-[18px] -right-[16px] z-20">
			<Button
				className="rounded-md w-8 h-8 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 border-zinc-200 dark:border-zinc-700"
				onClick={() => setIsOpen && setIsOpen(!isOpen)}
				size="icon"
				variant="outline"
			>
				<ChevronLeft
					className={cn(
						"h-4 w-4 transition-transform ease-in-out duration-700",
						isOpen === false ? "rotate-180" : "rotate-0"
					)}
				/>
			</Button>
		</div>
	);
}