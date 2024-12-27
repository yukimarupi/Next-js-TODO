// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name, message } = req.body;

    if (!email || !name || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 仮のレスポンスを返す（メール送信ロジックをここに追加）
    res.status(200).json({ message: 'Email sent successfully!' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
