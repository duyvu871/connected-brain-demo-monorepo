import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { cn } from '@repo/utils';
import { Button } from '@ui/shadcn-ui/ui/button';

interface PricingCardProps {
    title: string;
    price?: number;
    desc?: string;
    featureList?: string[];
    tag?: string;
};

function PricingCard({ title, price = 0, featureList = [], desc = '', tag }: PricingCardProps): React.ReactNode{
    return (
        <div
            className="max-w-sm h-full bg-purple-500 dark:bg-n-8 border-[1px] border-zinc-300 dark:border-zinc-800 rounded-[2.1rem] lg:w-auto [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
            {
                tag
                  ? <div className="flex justify-center items-start bg-purple-500 w-full px-6 py-3 rounded-t-[2rem]">
                        <p className="text-xs text-zinc-50">
                            {tag}
                        </p>
                    </div> : null
            }
            <div className="p-6 rounded-t-[2rem] rounded-b-[2rem] dark:bg-zinc-900 bg-white">
                <h4 className="text-3xl font-semibold text-purple-500 mb-4">{title}</h4>

                <p className="body-2 min-h-[4rem] mb-3 text-zinc-700 dark:text-zinc-500">
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
                  className={cn('w-full font-bold mb-6 bg-[inherit] text-zinc-700 dark:text-zinc-50 border-zinc-300 dark:border-zinc-800 transition-all hover:text-purple-500')}
                  variant={price ? 'default' : 'outline'}
                >
                    {price ? 'Get started' : 'Contact us'}
                </Button>

                <div className="flex flex-col justify-center items-start">
                    {featureList.map((feature, index) => (
                      <div
                        className="flex items-start py-5 border-t border-zinc-800"
                        key={`pricing-item-1-${index}`}
                      >
                          <div className="w-8 h-8 flex justify-center items-center"><FaCheckCircle
                            className="text-green-400 text-xl" /></div>
                          <p className="text-md ml-4 text-zinc-700 dark:text-white">{feature}</p>
                      </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PricingCard;