import { Avatar } from '@nextui-org/react';

export default function UserAvatar(): JSX.Element {
	return (
		<Avatar className="cursor-pointer h-9 w-9 hidden sm:block" name='Jane' showFallback src="https://github.com/shadcn.png" />
	);
}