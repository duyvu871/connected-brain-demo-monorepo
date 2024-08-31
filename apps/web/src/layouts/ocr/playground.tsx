
interface PlaygroundProps {
	children: React.ReactNode;
}

export default function Playground({children}: PlaygroundProps) {
	return (
		<div className="w-full min-h-[calc(100vh_-_57px)] lg:h-[calc(100vh_-_57px)] relative flex" />
	)
}