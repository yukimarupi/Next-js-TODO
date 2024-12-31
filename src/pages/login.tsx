import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  // 状態管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // カスタムログイン処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Cookieからユーザー情報を取得
    const storedUser = Cookies.get('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      // ユーザー認証
      if (user.username === username && user.password === password) {
        // 認証成功
        Cookies.set('isLoggedIn', 'true');
        router.push('/tasks'); // タスクページへリダイレクト
      } else {
        // 認証失敗
        setError('Invalid username or password.');
      }
    } else {
      setError('No user found. Please register first.');
    }
  };

  // Googleログイン処理
  const handleGoogleLogin = async () => {
    try {
      // Google認証を実行
      const result = await signIn('google', { callbackUrl: '/tasks' });

      // Googleユーザー情報をCookieに保存（オプション）
      if (result && result.ok) {
        Cookies.set('isGoogleUser', 'true', { expires: 7 });
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };


  // ログイン済みの場合の処理
  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Email: {session.user?.email}</p>
        <button onClick={() => router.push('/tasks')}>Go to Tasks</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '10px' }}>
          Login
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        style={{
          marginTop: '10px',
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login with Google
      </button>
      <p>
        Don&apos;t have an account? <Link href="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
