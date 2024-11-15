import React from "react";
import AppLayout from '@/providers/app-provider.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import Playground from '@/containers/Apps/SpeechToText/playground.tsx';
import { PlayerProvider } from '@/providers/speech-to-text/player-provider.tsx';

export default function Page({ params }: { params: { recordId: string } }): React.ReactNode {
    return (
      <AppLayout>
          <MainSidebarLayout customHeader={<></>}>
            <PlayerProvider>
              <Playground id={params.recordId}/>
            </PlayerProvider>
          </MainSidebarLayout>
      </AppLayout>
    )
}