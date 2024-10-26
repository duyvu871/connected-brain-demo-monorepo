import React, { Suspense } from 'react';
import Translate from "@/containers/Apps/Translate/Translate";
import AppLayout from '@/providers/app-provider.tsx';
import { LanguageProvider, TextProvider } from "@/providers";
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import HeaderNavigateItem from '@/components/Chatbot/HeaderNavigateItem.tsx';

async function Page() {
  const session = await getServerAuthSession();
  const header = headers();
  const pathname = header.get('x-pathname');
  if (!session?.user) {
    return redirect('/auth/method?type=login');
  }
  return (
    <Suspense fallback={<></>}>
      <AppLayout>
          <MainSidebarLayout customHeader={<><HeaderNavigateItem /></>}>
            <LanguageProvider>
              <TextProvider>
                  <Translate />
              </TextProvider>
            </LanguageProvider>
          </MainSidebarLayout>
      </AppLayout>
    </Suspense>

  );
}

export default Page;
