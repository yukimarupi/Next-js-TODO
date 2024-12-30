import '../styles/globals.css'; //グローバルCSSファイルをインポート
import type { AppProps } from 'next/app'; //TypeScript の型定義をインポート
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  //アプリ全体のルートコンポーネントを定義
  return <Component {...pageProps} />; //現在のページを描画
}

export default MyApp; //コンポーネントをエクスポート
