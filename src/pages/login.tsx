import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  // 状態管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // メールアドレス入力用
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // クッキー認証ログイン
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

  //Auth0ログイン
  const handleAuth0Login = async () => {
    try {
      const result = await signIn('auth0', { callbackUrl: '/tasks' });
      if (result && result.ok) {
        Cookies.set('isAuth0User', 'true', { expires: 7 });
      }
    } catch (error) {
      console.error('Auth0 login error:', error);
    }
  };

  // Googleログイン
  const handleGoogleLogin = async () => {
    try {
      const result = await signIn('google', { callbackUrl: '/tasks' });
      if (result && result.ok) {
        Cookies.set('isGoogleUser', 'true', { expires: 7 });
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // メールアドレスログイン
  const handleEmailLogin = async () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const result = await signIn('email', { email, callbackUrl: '/tasks' });
      if (result && result.ok) {
        Cookies.set('isEmailUser', 'true', { expires: 7 });
      }
    } catch (error) {
      console.error('Email login error:', error);
      setError('Failed to login with email. Please try again.');
    }
  };

  // ログイン済みユーザーの処理
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

      {/* クッキー認証ログインフォーム */}
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

      {/* Auth0ログインボタン */}
      <button
        onClick={handleAuth0Login}
        style={{
          marginTop: '10px',
          backgroundColor: '#0A66C2',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login with Auth0
      </button>

      {/* Googleログインボタン */}
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

      {/* メールアドレスログインフォーム */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="email">Login with Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button
          onClick={handleEmailLogin}
          style={{
            marginLeft: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '5px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send Login Link
        </button>
      </div>

      <p>
        Don&apos;t have an account? <Link href="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
