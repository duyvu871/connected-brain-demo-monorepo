import React from "react";
import AppLayout from '@/providers/app-provider.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import Playground from '@/containers/Apps/SpeechToText/playground.tsx';

export default function Page({ params }: { params: { recordId: string } }): React.ReactNode {
    return (
      <AppLayout>
          <MainSidebarLayout customHeader={<></>}>
              <Playground id={params.recordId}/>
          </MainSidebarLayout>
      </AppLayout>
    )
}