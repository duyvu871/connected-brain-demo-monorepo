import type {NextRequest} from "next/server";
import { NextResponse} from "next/server";
import { routeList } from '@/global/contants/route';

export function middleware(request: NextRequest): NextResponse {
    if (request.url === "/auth") return NextResponse.redirect(routeList.login);
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);
    requestHeaders.set("x-origin", origin);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}