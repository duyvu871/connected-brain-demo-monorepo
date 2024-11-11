import React from 'react';
import Playground from '@/containers/Apps/SpeechToText/playground.tsx';
import AppLayout from '@/providers/app-provider.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
// import Starter from '@/containers/Apps_v1/SpeechToText/starter.tsx';

async function Page() {
  const session = await getServerAuthSession();
  const header = headers();
  const pathname = header.get('x-pathname');
  if (!session?.user) {
    return redirect('/auth/method?type=login');
  }
    return (
      <AppLayout>
        <MainSidebarLayout customHeader={<></>}>
          <Playground />
        </MainSidebarLayout>
      </AppLayout>
    );
}

export default Page;