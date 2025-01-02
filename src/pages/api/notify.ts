import { NextApiRequest, NextApiResponse } from 'next';
import webPush from 'web-push';

// VAPIDキーを設定
webPush.setVapidDetails(
  `mailto:${process.env.NEXT_PUBLIC_VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!
);

// サブスクリプションを一時的に保存するリスト
const subscriptions: Array<{ endpoint: string; keys: { p256dh: string; auth: string } }> = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { subscription, title, body, icon } = req.body;

    if (!subscription) {
      return res.status(400).json({ error: 'Subscription is required.' });
    }

    // サブスクリプションを保存（デモ用：実際はDBに保存することを推奨）
    subscriptions.push(subscription);

    // プッシュ通知のペイロード
    const payload = JSON.stringify({
      title: title || 'Default Title',
      body: body || 'Default Body',
      icon: icon || '/default-profile.png',
    });

    try {
      await webPush.sendNotification(subscription, payload);
      return res.status(200).json({ message: 'Push notification sent successfully.' });
    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ error: 'Failed to send notification.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
