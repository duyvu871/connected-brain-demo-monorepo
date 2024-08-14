import React from "react";

export default function Page({ params }: { params: { slug: string } }): React.ReactNode {
    return <div>My Post: {params.slug}</div>
}