import React from 'react';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import { motion } from 'framer-motion';


interface WavyTextProps extends HTMLMotionProps<'div'> {
	text: string;
	delay?: number;
	duration?: number;
	letterProps?: HTMLMotionProps<'span'>;
}


function WavyText({
										text,
										delay = 0.3,
										duration = 0.05,
										letterProps = {
											// initial: 'hidden',
											// animate: 'visible',
										},
										...props
									}: WavyTextProps) {
	const letters = Array.from(text);
	const container: Variants = {
		hidden: {
			opacity: 1,
		},
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: duration, delayChildren: i * delay },
		}),
	};

	const child: Variants = {
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 16,
				stiffness: 200,
			},
		},
		hidden: {
			opacity: 0,
			y: -10,
			transition: {
				type: 'spring',
				damping: 16,
				stiffness: 200,
			},
		},
	};
	return (
		<motion.h1
			animate="visible"
			initial="hidden"
			style={{ display: 'flex', overflow: 'hidden' }}
			variants={container}
			{...props}
		>
			{letters.map((letter, index) => (
				<motion.span key={index} variants={child} {...props}>
					{letter === ' ' ? '\u00A0' : letter}
				</motion.span>
			))}
		</motion.h1>
	);
}

export default WavyText;