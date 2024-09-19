import React from 'react';
import Link from 'next/link';
import PricingCard from '@ui/pricing-card';
import BodyContentWrapper from '@ui/resource-ui/body-content-wrapper.tsx';

const pricingList = [
    {
        title: 'Enterprise',
        price: 0,
        desc: 'Custom AI chatbot, advanced analytics, dedicated account',
        tag: 'Best for company need AI solutions and startups with unlimited resources',
        featureList: ['An AI chatbot that can understand your queries',
            'Personalized recommendations based on your preferences',
            'Ability to explore the app and its features without any cost',
            'Priority support to solve issues quickly'],
    },
];

function PricingList(): React.ReactNode {
    return (
      <BodyContentWrapper>
        <div className="w-full">
            <div className="w-full flex flex-col gap-5 py-14">
                <span className="text-4xl w-full text-center text-zinc-700 dark:text-white ">Pay or use with limit action</span>
                {/*<span className={'text-xs w-full text-center text-zinc-600 pb-5'}>ConnectedBrain unlocks the potential of AI-powered applications</span>*/}
            </div>
            <div className="flex justify-center gap-2 p-5">
                {pricingList.map((priceInfo, index) => (
                    <PricingCard
                      desc={priceInfo.desc}
                      featureList={priceInfo.featureList}
                      key={`price-${  index}`}
                      price={priceInfo.price}
                      tag={priceInfo.tag}
                      title={priceInfo.title}
                    />
                ))}
            </div>
            <div className="flex justify-center my-10">
                <Link
                    className="text-xs text-zinc-700 dark:text-zinc-50 font-code font-bold tracking-wider uppercase border-b hover:text-zinc-800 dark:hover:text-white transition-all"
                    href="/pricing"
                >
                    See the full details
                </Link>
            </div>
        </div>
      </BodyContentWrapper>
    );
}

export default PricingList;