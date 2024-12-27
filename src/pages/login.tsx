import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
      <p>
        Don&apos;t have an account? <Link href="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
