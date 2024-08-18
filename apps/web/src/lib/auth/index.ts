import { nextauthOptions } from '@/lib/nextauthOptions';
import NextAuth from 'next-auth';

export const handler = NextAuth(nextauthOptions);

