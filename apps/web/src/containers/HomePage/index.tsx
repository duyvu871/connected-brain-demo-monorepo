'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import Footer from '@repo/ui/footer';
import BodyContent from '@repo/ui/body-content';
import FeatureLine from '@repo/ui/feature-line';
import { NavigationMenuDemo as NavigationMenuComponent } from '@repo/ui/navbar/navbar-component.tsx';
import PricingList from '@repo/ui/pricing-list';

function HomePage() : React.ReactElement {
    return (
        <main className="mx-auto relative w-full h-full dark">
            <motion.div
                animate={{
                    transform: 'translateY(0%)',
                }}
                className="fixed w-full z-50"
                initial={{
                    position: 'fixed',
                    top: 0,
                    transform: 'translateY(-100%)',
                }}
            >
                <NavigationMenuComponent />
            </motion.div>
            <div className="mt-16 " />
            <BodyContent />
            <div className="w-full h-0 border-b-[1px] border-gray-600" />
            <FeatureLine />
            <div className="w-full h-0 border-b-[1px] border-gray-600" />
            {/*<DonutShape classNames={{*/}
            {/*	wrapper: 'absolute top-0 left-0 w-full h-[100vh] z-[12] flex justify-center items-center',*/}
            {/*}} />*/}
            <PricingList />
            <div className="w-full h-0 border-b-[1px] border-gray-600" />
            <Footer />
        </main>
    );
}

export default HomePage;