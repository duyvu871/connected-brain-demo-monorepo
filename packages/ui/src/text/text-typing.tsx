import { motion } from 'framer-motion';
import React from 'react';

interface TextTypingProps {
	planText: string[];
	delay?: number;
};

function TextTyping({ planText, delay = 2 }: TextTypingProps) {
	const text = planText.join(' ').split('');

	return (
		<div
			className={' tracking-[-1px] leading-[1.2] text-center mx-0'}>
			{text.map((el, i) => (
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.1,
						delay: (i / 20) + delay,
					}}
					key={i}
				>
					{el}{''}
				</motion.span>
			))}
		</div>
	);
}

export default TextTyping;