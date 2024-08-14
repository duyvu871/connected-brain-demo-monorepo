import { Timeline } from '@mantine/core';
import React from 'react';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';


const featureList1 = [{
    title: 'Fast Responding',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: '',
}, {
    title: 'Smart Answer',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: '',
}, {
    title: 'Seamless Integration',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: '',
}];

const featureList2 = [{
    title: 'Realtime translate',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: 'Convert between different languages globally.',
}, {
    title: 'Create subtitles',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: 'Subtitles are an effective way to help viewers easily understand your content.',
}, {
    title: 'Virtual assistant',
    icon: <FaCheckCircle className="text-green-400 text-xl" />,
    desc: 'Virtual assistants are used to answer customer questions, schedule appointments, and provide general information.',
}];


function Feature1({ list = [], image = '', title, desc }: {
    list: typeof featureList1;
    image: string;
    title: string;
    desc: string
}) {

    return (
        <div
            className="bg-black overflow-hidden relative max-w-5xl flex flex-col md:flex-row justify-center items-start mb-2 ml-5 rounded-xl border-[2px] border-gray-100">
            {/*<div className={'absolute w-'}></div>*/}
            <div className="overflow-hidden max-w-3xl aspect-video">
                <Image alt="graphic" className="object-cover" height={1000} src={image} width={1000} />
            </div>
            <div className="flex flex-col justify-start w-full gap-6 px-5 pt-2 md:pt-5">
                <div className="flex flex-col justify-start">
                    <span className="text-2xl font-normal text-white">{title}</span>
                    <span className="text-sm font-normal text-gray-400">{desc}</span>
                </div>
                <div className="flex flex-col">
                    {list.map((feat, index) => (
                        <div className="border-t-[1px] border-gray-800 py-3" key={`feature-1-item-${  index}`}>
                            <div className="flex justify-start items-center gap-4">
                                {feat.icon}
                                <span className="font-thin md:text-xl leading-3">{feat.title}</span>
                            </div>
                            <span className="text-xs text-gray-500">{feat.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Feature2({ list = [], image = '', title, desc }: {
    list: typeof featureList1;
    image: string;
    title: string;
    desc: string
}) {
    return (
        <div
            className="bg-black overflow-hidden relative max-w-5xl flex flex-col md:flex-row justify-center items-start mb-2 ml-5 rounded-xl border-[1px] border-gray-600">
            <div className="overflow-hidden max-w-3xl h-full">
                <Image alt="graphic" className="object-cover" height={1000} src={image} width={1000} />
            </div>
            <div className="flex flex-col justify-start w-full gap-6 px-5 pt-2 md:pt-5">
                <div className="flex flex-col justify-start">
                    <span className="text-xl font-normal text-white">{title}</span>
                    <span className="text-sm font-normal text-gray-400">{desc}</span>
                </div>
                <div className="flex flex-col text-start">
                    {list.map((feat, index) => (
                        <div className="border-t-[1px] border-gray-800 py-3" key={`feature-1-item-${  index}`}>
                            <div className="flex justify-start items-center gap-4">
                                {feat.icon}
                                <span className="font-thin md:text-xl leading-3">{feat.title}</span>
                            </div>
                            <span className="text-xs text-gray-500">{feat.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeatureLine(): JSX.Element {
    return (
        <div className="mx-auto p-5 py-14 md:p-14 flex flex-col justify-center items-start gap-5 bg-black bg-opacity-0">
            <span className="text-2xl w-full text-center text-white ">Generative AI made for content creators</span>
            <span className="text-xs w-full text-center text-gray-600 pb-5">ConnectedBrain unlocks the potential of AI-powered applications</span>
            <Timeline
                active={1}
                bulletSize={32}
                className="w-full "
                classNames={{
                    itemTitle: 'max-w-xs',
                    itemBullet: 'p-1 hover:scale-125 transition-all after:h-72 after:absolute after:border-[1px] after:border-gray-800 after:z-10 after:top-4 md:after:top-0 after:left-3.5',
                    itemBody: 'ps-[0_!important]',
                    itemContent: 'relative z-20 ',
                }}
                lineWidth={2}
            >
                <Timeline.Item
                    bullet={
                        <div
                            className="relative z-20 w-8 h-8 md:w-16 md:h-16 flex justify-center items-center after:w-16 after:absolute after:border-[1px] after:border-gray-800 after:z-10 after:top-4 md:after:top-8 after:left-4">
                            <Image alt="feature-1" className="relative z-20" height={60} src="/timeline-images/assistant.png"
                                   width={60} />
                        </div>}
                    // title={`Unlocking language potential with NLP AI: Automation, Understanding, and Connection.`}
                    color="rgba(56,56,56,0.68)">
                    <Feature1 desc="ConnectedBrain unlocks the potential of AI-powered applications" image="/graphics/feature_1.png" list={featureList1}
                              title="Smart AI" />
                </Timeline.Item>
            </Timeline>
            <Timeline
                active={1}
                align="right"
                bulletSize={32}
                className="w-full "
                classNames={{
                    itemTitle: 'max-w-xs',
                    itemBullet: 'p-1 hover:scale-125 transition-all after:h-72 after:absolute after:border-[1px] after:border-gray-800 after:z-10 after:top-4 md:after:top-0 after:left-3.5',
                    itemBody: 'ps-[0_!important]',
                    itemContent: 'relative z-20 flex justify-end',
                }}
                lineWidth={2}
            >
                <Timeline.Item
                    bullet={
                        <div
                            className="relative z-20 w-8 h-8 md:w-16 md:h-16 flex justify-center items-center after:w-16 after:absolute after:border-[1px] after:border-gray-800 after:z-10 after:top-4 md:after:top-8 after:right-6">
                            <Image alt="feature-1" className="relative z-20" height={60} src="/timeline-images/assistant.png"
                                   width={60} />
                        </div>}
                    // title={`Unlocking language potential with NLP AI: Automation, Understanding, and Connection.`}
                    color="rgba(56,56,56,0.68)">
                    <Feature2 desc="" image="/graphics/feature_2.png"
                              list={featureList2}
                              title="Voice record, Subtitle, Translate in one feature"
                    />
                </Timeline.Item>
            </Timeline>
        </div>
    );
}

export default FeatureLine;


