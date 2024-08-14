import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { cn } from '@repo/utils';
import { Button } from '@ui/shadcn-ui/ui/button';

interface PricingCardProps {
    title: string;
    price?: number;
    desc?: string;
    featureList?: string[];
};

function PricingCard({ title, price = 0, featureList = [], desc = '' }: PricingCardProps): React.ReactNode{
    return (
        <div
            className="max-w-sm h-full px-6 bg-n-8 border-[1px] border-gray-800 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
            <h4 className="text-2xl font-semibold text-purple-500 mb-4">{title}</h4>

            <p className="body-2 min-h-[4rem] mb-3 text-gray-600">
                {desc}
            </p>

            <div className="flex items-center h-[5.5rem] mb-6">
                {price > 0 && (
                    <>
                        <div className="h3">$</div>
                        <div className="text-[5.5rem] leading-none font-bold">
                            {price}
                        </div>
                    </>
                )}
            </div>

            <Button
                className={cn('w-full mb-6 border-gray-800 transition-all hover:text-purple-500')}
                variant={price ? 'default' : 'outline'}
            >
                {price ? 'Get started' : 'Contact us'}
            </Button>

            <div className="flex flex-col justify-center items-start">
                {featureList.map((feature, index) => (
                    <div
                        className="flex items-start py-5 border-t border-gray-800"
                        key={index}
                    >
                        <div className="w-8 h-8 flex justify-center items-center"><FaCheckCircle
                            className="text-green-400 text-xl" /></div>
                        <p className="text-md ml-4 text-white">{feature}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PricingCard;