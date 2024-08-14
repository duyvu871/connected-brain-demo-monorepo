import { forwardRef } from 'react';
import type { MantineLoaderComponent } from '@mantine/core';

const RingLoader: MantineLoaderComponent = forwardRef(({ style, ...others }, ref) => (
    <svg
        {...others}
        ref={ref}
        stroke="#fff"
        style={{
            width: 'var(--loader-size)',
            height: 'var(--loader-size)',
            stroke: 'var(--loader-color)',
            ...style,
        }}
        viewBox="0 0 45 45"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill="none" fillRule="evenodd" strokeWidth="2" transform="translate(0.5 0.5)">
            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                <animate
                    attributeName="r"
                    begin="1.5s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="6;22"
                />
                <animate
                    attributeName="stroke-opacity"
                    begin="1.5s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="1;0"
                />
                <animate
                    attributeName="stroke-width"
                    begin="1.5s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="2;0"
                />
            </circle>
            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                <animate
                    attributeName="r"
                    begin="3s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="6;22"
                />
                <animate
                    attributeName="stroke-opacity"
                    begin="3s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="1;0"
                />
                <animate
                    attributeName="stroke-width"
                    begin="3s"
                    calcMode="linear"
                    dur="3s"
                    repeatCount="indefinite"
                    values="2;0"
                />
            </circle>
            <circle cx="22" cy="22" r="8">
                <animate
                    attributeName="r"
                    begin="0s"
                    calcMode="linear"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="6;1;2;3;4;5;6"
                />
            </circle>
        </g>
    </svg>
));
RingLoader.displayName = 'RingLoader';

export default RingLoader;