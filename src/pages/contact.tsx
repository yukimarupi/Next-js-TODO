import { useState } from 'react';

const ContactPage = () => {
  //Reactの状態管理フックuseStateを使用
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  //フォーム送信のハンドリング
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus('Please fill out all fields.');
      return;
    }

    try {
      //APIリクエスト
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, message }),
      });

      //リクエスト成功・失敗時の処理
      if (response.ok) {
        setStatus('Your message has been sent!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send your message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // 状態を更新
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          ></textarea>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Send
        </button>
      </form>
      {status && <p style={{ marginTop: '10px', color: 'green' }}>{status}</p>}
    </div>
  );
};

export default ContactPage;
