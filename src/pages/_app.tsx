import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; //グローバルCSSファイルをインポート
import type { AppProps } from 'next/app'; //TypeScript の型定義をインポート
import React from 'react';

function App({ Component, pageProps }: AppProps): React.JSX.Element {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App; // 既定エクスポートはこれだけ
