//友海追加分


import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const EditProfilePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Cookie から現在のユーザー情報を取得
    const storedUser = Cookies.get('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setPassword(user.password);
    } else {
      setError('No user found. Please log in.');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('All fields are required.');
      return;
    }

    // 新しいユーザー情報を Cookie に保存
    const updatedUser = { username, password };
    Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });

    setSuccess('Profile updated successfully!');
    setTimeout(() => {
      router.push('/'); // ホームにリダイレクト
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSave}>
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
        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
