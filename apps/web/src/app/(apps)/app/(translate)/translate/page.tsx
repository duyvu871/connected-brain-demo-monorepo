import React, { Suspense } from 'react';
import Translate from "@/containers/Apps/Translate/Translate";

import { LanguageProvider, TextProvider } from "@/providers";

function Page(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <LanguageProvider>
        <TextProvider>
            <Translate />
        </TextProvider>
      </LanguageProvider>
    </Suspense>

  );
}

export default Page;
