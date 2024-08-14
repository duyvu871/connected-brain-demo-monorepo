import React from 'react';

interface BlurryGradientProps {
	children: React.ReactNode;
	props?: HTMLDivElement;
}

function BlurryGradient({ children, ...props }: BlurryGradientProps): React.ReactNode {
	return (
		<div className="relative">
			<div {...props}>
				{children}
			</div>
			<div className="absolute w-full h-full">
				<svg height="700" opacity="0.45" version="1.1" viewBox="0 0 700 700" width="700"
						 xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient gradientTransform="rotate(300, 0.5, 0.5)" id="ffflux-gradient" x1="50%" x2="50%" y1="0%"
														y2="100%">
							<stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="1" />
							<stop offset="100%" stopColor="hsl(227, 60%, 30%)" stopOpacity="1" />
						</linearGradient>
						<filter colorInterpolationFilters="sRGB" filterUnits="objectBoundingBox" height="140%" id="ffflux-filter" primitiveUnits="userSpaceOnUse" width="140%"
										x="-20%" y="-20%">
							<feTurbulence baseFrequency="0.003 0.006" height="100%" numOctaves="2" result="turbulence" seed="2"
														stitchTiles="stitch" type="fractalNoise" width="100%" x="0%" y="0%" />
							<feGaussianBlur edgeMode="duplicate" height="100%" in="turbulence" result="blur" stdDeviation="100 100" width="100%"
															x="0%" y="0%" />
							<feBlend height="100%" in="SourceGraphic" in2="blur" mode="color-dodge" result="blend" width="100%" x="0%"
											 y="0%" />

						</filter>
					</defs>
					<rect fill="url(#ffflux-gradient)" filter="url(#ffflux-filter)" height="700" width="700" />
				</svg>
			</div>
		</div>
	);
}

export default BlurryGradient;