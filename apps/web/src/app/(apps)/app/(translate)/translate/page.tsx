import React, { Suspense } from 'react';
import Translate from "@/containers/Apps/Translate/Translate";
import AppLayout from '@/providers/app-provider.tsx';
import { LanguageProvider, TextProvider } from "@/providers";
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';

function Page(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <AppLayout>
          <MainSidebarLayout>
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
