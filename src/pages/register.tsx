//モジュールのインポート
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; // Google認証のため追加

const RegisterPage = () => {
  //状態管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  //登録処理
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // ユーザーがすでに存在するかどうかを確認する
    const existingUser = Cookies.get('user');
    if (existingUser) {
      setError('User already exists. Please login.');
      return;
    }

    // ユーザーデータをCookieに保存する
    const user = { username, password };
    Cookies.set('user', JSON.stringify(user), { expires: 7 });

    // ログインページにリダイレクト
    router.push('/login');
  };

  // Google認証を使用した登録
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

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '10px' }}>
          Register
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
        Register with Google
      </button>
      <p>
        Already have an account? <Link href="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegisterPage;
