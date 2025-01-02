// プッシュイベントをリッスン
self.addEventListener('push', (event) => {
    console.log('Push event received:', event);

    if (!event.data) {
      console.error('Push event has no data.');
      return;
    }

    const data = event.data.json();

    // 通知を表示
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/default-profile.png',
    });
  });

  // 通知クリックイベント
  self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);

    event.notification.close();

    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          const client = clientList[0];
          client.focus();
        } else {
          clients.openWindow('/');
        }
      })
    );
  });
