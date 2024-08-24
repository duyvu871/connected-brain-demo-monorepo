import { UserNav } from "@/components/Navbar/user-nav";
import { SheetMenu } from "@/components/Navbar/sheet-menu";
import { cn } from '@repo/utils';
import { useAtom } from 'jotai/index';
import { sidebarOpen } from '@/states/global/sidebar.ts';

interface NavbarFeatureProps {
	title: string;
	children?: React.ReactNode;
}

export function NavbarFeature({ title, children }: NavbarFeatureProps) {
	const [isOpen] = useAtom(sidebarOpen);

	return (
		<header className={cn(
			'sticky top-0 z-[100] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-zinc-700 transition-[padding-left] ease-in-out duration-300',
			!isOpen ? "lg:pl-[90px]" : "lg:pl-72",
		)}>
			<div className="mx-4 sm:mx-8 flex h-14 items-center">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<SheetMenu />
					<h1 className="font-bold capitalize">{title}</h1>
				</div>
				<div className="flex flex-1 items-center space-x-2 justify-end">
					{children}
				</div>
			</div>
		</header>
	);
}