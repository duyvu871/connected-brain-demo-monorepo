import type { FC } from 'react';
import React from 'react';
import { cn , colorsTheme } from '@repo/utils';
import { SiIbm, SiNetflix, SiTencentqq, SiTesla } from 'react-icons/si';
import { GrGoogle } from 'react-icons/gr';
import { FaAmazon, FaFacebook } from 'react-icons/fa';
import { TfiMicrosoftAlt } from 'react-icons/tfi';
import { FaMeta } from 'react-icons/fa6';
import { BsNvidia } from 'react-icons/bs';
import ShowCard from '@ui/resource-ui/show-card';
import Background from '@ui/resource-ui/background/background';
import MacbookContentGraphic from '@ui/resource-ui/macbook-content-graphic';
import BodyContentWrapper from '@ui/resource-ui/body-content-wrapper';

const sponsorsList = [{
    title: 'Netflix',
    icon: <SiNetflix />,
}, {
    title: 'Google',
    icon: <GrGoogle />,
}, {
    title: 'Facebook',
    icon: <FaFacebook />,
}, {
    title: 'Amazon',
    icon: <FaAmazon />,
}, {
    title: 'Tesla',
    icon: <SiTesla />,
}, {
    title: 'Tencent',
    icon: <SiTencentqq />,
}, {
    title: 'Microsoft',
    icon: <TfiMicrosoftAlt />,
}, {
    title: 'Meta',
    icon: <FaMeta />,
}, {
    title: 'IBM',
    icon: <SiIbm />,
}, {
    title: 'Nvidia',
    icon: <BsNvidia />,
}];

const SupporterList: FC = () => {
    return (
        <div className="relative w-full overflow-hidden px-10 md:p-0">
            <div className="absolute right-0 bg-gradient-to-l from-[#16181b] hidden md:block w-32 h-8" />
            <div className="flex md:justify-between md:flex-nowrap justify-around flex-wrap gap-10">
                {sponsorsList.map((item, index) => (
                    <div className="flex justify-center items-center gap-1" key={`sponsor-${  index}`}>
                        {item.icon}
                        <span>{item.title}</span>
                    </div>
                ))}
            </div>
            <div className="absolute left-0 top-0 bg-gradient-to-r from-[#16181b] hidden md:block w-32 h-8" />
        </div>
    );
};

function BodyContent(): JSX.Element {
    return (
        <div className="flex flex-col relative">
            <BodyContentWrapper>
                <div className="block-pattern bg-cover md:bg-contain">
                    <div className="relative">
                        <Background />
                        <MacbookContentGraphic />
                    </div>
                    <div className="w-full h-10 pb-40 bg-gradient-to-t from-[#101114]" />
                </div>
            </BodyContentWrapper>
            <BodyContentWrapper>
                <div className={cn('w-full flex flex-col justify-center pt-10', `bg-[${colorsTheme.colors.grayContent}]`)}>
                    <span className="text-center text-md tagline mx-auto mb-6 md:mb-20">project sponsors</span>
                    <SupporterList />
                </div>
                <div
                    className={cn('w-full flex justify-center items-center py-14 pt-32', `bg-[${colorsTheme.colors.grayContent}]`, ' w-full md:text-center')}>
					<span
                        className="text-2xl md:text-4xl text-white font-normal max-w-xl tracking-wide mx-auto px-10 text-center">
					NLP & Audio Processing: Powering Next-Gen AI
					</span>
                </div>
                <ShowCard />
            </BodyContentWrapper>
        </div>
    );
}

export default BodyContent;