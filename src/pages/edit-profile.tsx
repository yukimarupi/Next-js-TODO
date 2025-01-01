import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TasksPage } from './tasks';

const EditProfilePage = () => {
  //状態管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  //ユーザー認証と初期データの読み込み
  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.username || '');
        setPassword(user.password || '');
        setProfileImage(user.profileImage || null);
      } catch (err) {
        console.error('Failed to parse user cookie:', err);
        setError('Failed to load user data. Please try again.');
      }
    }
  }, [router]);

  //プロフィール画像のアップロード
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setProfileImage(reader.result as string); // Base64形式で画像を保存
      };

      reader.readAsDataURL(file);
    }
  };

  //フォーム送信の処理
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!profileImage) {
      setError('Please upload a profile image.');
      return;
    }

    const userData = { username, password, profileImage };
    console.log('🚀 ~ handleSave ~ userData:', userData);

    try {
      // ユーザーデータをクッキーに保存（画像データは除く）
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });

      // 画像データをlocalStorageに保存
      localStorage.setItem('profileImage', profileImage);

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
        router.push('/tasks');
      }, 2000);
    } catch (err) {
      console.error('Failed to save user data:', err);
      setError('Failed to save changes. Please try again.');
    }
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
        <div>
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {profileImage && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={profileImage}
                alt="Profile Preview"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            </div>
          )}
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
