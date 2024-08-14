import { motion } from 'framer-motion';
import React from 'react';

interface UnderlineHoverProps {
	children: React.ReactNode;
	isMouseEnter: boolean;
};

function UnderlineHover({ children, isMouseEnter }: UnderlineHoverProps): JSX.Element {
	// console.log(isMouseEnter);
	return (
		<div>
			<div className="relative">
				{children}
			</div>
			<motion.div animate={{
				scaleX: isMouseEnter ? 1 : 0,
			}} className="relative -bottom-[1px] left-0 right-0 h-[1px] bg-white w-full" initial={{
				scaleX: 0,
			}} style={{
				backgroundColor: '#fff',
			}} transition={{
				duration: 0.3,
			}} />
		</div>
	);
}

export default UnderlineHover;
