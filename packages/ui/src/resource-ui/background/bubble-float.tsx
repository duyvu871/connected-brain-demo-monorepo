import React from 'react';

function BubbleFloat(): JSX.Element {
	return (
		<div className="absolute max-w-3xl" id="bg-wrap">
			<svg className="w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
				<defs>
					<radialGradient cx="50%" cy="50%" fx="0.441602%" fy="50%" id="Gradient1" r=".5"><animate attributeName="fx" dur="34s" repeatCount="indefinite" values="0%;3%;0%" /><stop offset="0%" stopColor="rgba(255, 0, 255, 1)" /><stop offset="100%" stopColor="rgba(255, 0, 255, 0)" /></radialGradient>
					<radialGradient cx="50%" cy="50%" fx="2.68147%" fy="50%" id="Gradient2" r=".5"><animate attributeName="fx" dur="23.5s" repeatCount="indefinite" values="0%;3%;0%" /><stop offset="0%" stopColor="rgba(255, 255, 0, 1)" /><stop offset="100%" stopColor="rgba(255, 255, 0, 0)" /></radialGradient>
					<radialGradient cx="50%" cy="50%" fx="0.836536%" fy="50%" id="Gradient3" r=".5"><animate attributeName="fx" dur="21.5s" repeatCount="indefinite" values="0%;3%;0%" /><stop offset="0%" stopColor="rgba(0, 255, 255, 1)" /><stop offset="100%" stopColor="rgba(0, 255, 255, 0)" /></radialGradient>
					<radialGradient cx="50%" cy="50%" fx="4.56417%" fy="50%" id="Gradient4" r=".5"><animate attributeName="fx" dur="23s" repeatCount="indefinite" values="0%;5%;0%" /><stop offset="0%" stopColor="rgba(0, 255, 0, 1)" /><stop offset="100%" stopColor="rgba(0, 255, 0, 0)" /></radialGradient>
					<radialGradient cx="50%" cy="50%" fx="2.65405%" fy="50%" id="Gradient5" r=".5"><animate attributeName="fx" dur="24.5s" repeatCount="indefinite" values="0%;5%;0%" /><stop offset="0%" stopColor="rgba(0,0,255, 1)" /><stop offset="100%" stopColor="rgba(0,0,255, 0)" /></radialGradient>
					<radialGradient cx="50%" cy="50%" fx="0.981338%" fy="50%" id="Gradient6" r=".5"><animate attributeName="fx" dur="25.5s" repeatCount="indefinite" values="0%;5%;0%" /><stop offset="0%" stopColor="rgba(255,0,0, 1)" /><stop offset="100%" stopColor="rgba(255,0,0, 0)" /></radialGradient>
				</defs>
				{/*<rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient4)">*/}
				{/*<animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />*/}
				{/*<animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />*/}
				{/*<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="17s" repeatCount="indefinite"/>*/}
				{/*</rect>*/}
				{/*<rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient5)">*/}
				{/*<animate attributeName="x" dur="23s" values="0%;-25%;0%" repeatCount="indefinite" />*/}
				{/*<animate attributeName="y" dur="24s" values="25%;-25%;25%" repeatCount="indefinite" />*/}
				{/*<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>*/}
				{/*</rect>*/}
				{/*<rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient6)">*/}
				{/*<animate attributeName="x" dur="25s" values="-25%;0%;-25%" repeatCount="indefinite" />*/}
				{/*<animate attributeName="y" dur="26s" values="0%;-25%;0%" repeatCount="indefinite" />*/}
				{/*<animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="19s" repeatCount="indefinite"/>*/}
				{/*</rect>*/}
				<rect fill="url(#Gradient1)" height="100%" transform="rotate(334.41 50 50)" width="100%" x="13.744%" y="1.18473%"><animate attributeName="x" dur="20s" repeatCount="indefinite" values="25%;0%;25%" /><animate attributeName="y" dur="21s" repeatCount="indefinite" values="0%;25%;0%" /><animateTransform attributeName="transform" dur="7s" from="0 50 50" repeatCount="indefinite" to="360 50 50" type="rotate" /></rect>
				<rect fill="url(#Gradient2)" height="100%" transform="rotate(255.072 50 50)" width="100%" x="-2.17916%" y="35.4267%"><animate attributeName="x" dur="23s" repeatCount="indefinite" values="-25%;0%;-25%" /><animate attributeName="y" dur="24s" repeatCount="indefinite" values="0%;50%;0%" /><animateTransform attributeName="transform" dur="12s" from="0 50 50" repeatCount="indefinite" to="360 50 50" type="rotate" />
				</rect>
				<rect fill="url(#Gradient3)" height="100%" transform="rotate(139.903 50 50)" width="100%" x="9.00483%" y="14.5733%"><animate attributeName="x" dur="25s" repeatCount="indefinite" values="0%;25%;0%" /><animate attributeName="y" dur="12s" repeatCount="indefinite" values="0%;25%;0%" /><animateTransform attributeName="transform" dur="9s" from="360 50 50" repeatCount="indefinite" to="0 50 50" type="rotate" />
				</rect>
			</svg>
		</div>
	);
}

export default BubbleFloat;