import {NextResponse} from "next/server";

export function messageTemplate(message: string, status: number) {
  return new NextResponse(JSON.stringify({
        message,
        status
    }), {
        status,
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export function dataTemplate(data: any, status: number) {
  return new NextResponse(JSON.stringify({
        ...data,
        status
    }), {
        status,
        headers: {
            "Content-Type": "application/json",
        }
    });
}