import Link from 'next/link';

export default function Footer(): JSX.Element {
	return (
		<footer
			className="fixed bottom-0 right-1/2 translate-x-1/2 z-50 hidden items-center justify-between px-4 pt-1 text-zinc-100 mix-blend-difference sm:inline-flex pb-2 backdrop-blur rounded-t-lg">
			<nav className="flex items-center gap-2.5 rounded-full text-sm font-medium">
				<Link href="#">FAQ</Link>
				<Link href="#">Terms</Link>
				<Link href="#">Privacy</Link>
				<Link href="#">Contact</Link>
				<Link href="#">Policy</Link>
			</nav>
		</footer>
	);
}