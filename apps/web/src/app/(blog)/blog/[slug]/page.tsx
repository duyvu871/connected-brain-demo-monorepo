import React from 'react';
import {redirect} from "next/navigation";

function Page({params}: {params: {slug: string|undefined}}): JSX.Element {
    if (!params.slug) {
        redirect('/');
    }
    return (
        <div>
            <h1>Blog Page: {params.slug}</h1>
        </div>
    );
}

export default Page;