import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'About Connected Brain'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default function Image(): ImageResponse {

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                About Connected Brain
            </div>
        ),
        {
            ...size,
        })
}