import { UserNav } from "@/components/Navbar/user-nav";
import { SheetMenu } from "@/components/Navbar/sheet-menu";

interface NavbarFeatureProps {
	title: string;
	children?: React.ReactNode;
}

export function NavbarFeature({ title, children }: NavbarFeatureProps) {
	return (
		<header className="sticky top-0 z-[100] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-zinc-700">
			<div className="mx-4 sm:mx-8 flex h-14 items-center">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<SheetMenu />
					<h1 className="font-bold">{title}</h1>
				</div>
				<div className="flex flex-1 items-center space-x-2 justify-end">
					{children}
				</div>
			</div>
		</header>
	);
}