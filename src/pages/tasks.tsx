import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import toastr from 'toastr';

type Task = {
  id: number;
  name: string;
  description: string;
};

export const TasksPage = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  //状態管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  const [isGoogleUser, setIsGoogleUser] = useState(false); // Googleユーザーかどうかの判定

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login'); // 未ログインの場合はログインページへリダイレクト
    }

    const googleUser = Cookies.get('isGoogleUser') === 'true';
    setIsGoogleUser(googleUser);

    const taskKey = googleUser ? 'googleTasks' : 'manualTasks';
    const storedTasks = Cookies.get(taskKey);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    } else {
      setProfileImage('default-profile.png'); // デフォルト画像を設定
    }
  }, []);

  const saveTasksToCookies = (tasks: Task[]) => {
    const taskKey = isGoogleUser ? 'googleTasks' : 'manualTasks';
    Cookies.set(taskKey, JSON.stringify(tasks), { expires: 7 });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Task name is required.');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);

    toastr.success(`Task "${newTask.name}" has been added!`);

    setTaskName('');
    setTaskDescription('');
  };

  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Task name is required.');
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId
        ? { ...task, name: taskName, description: taskDescription }
        : task,
    );

    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);

    setTaskName('');
    setTaskDescription('');
    setEditTaskId(null);
  };

  const handleDeleteTask = (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);

    if (taskToDelete) {
      toastr.info(`Task "${taskToDelete.name}" has been completed!`);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
      } catch (error: any) {
        console.error('Service Worker registration failed:', error.message);
        console.error('Error stack:', error.stack);
      }
    } else {
      console.error('Service Worker is not supported in this browser.');
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('このブラウザは通知をサポートしていません。');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('通知が許可されました！');
    } else if (permission === 'denied') {
      console.warn('通知が拒否されました。');
    } else {
      console.log('通知の権限リクエストがスキップされました。');
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;

        // VAPID_PUBLIC_KEY を Uint8Array に変換
        const applicationServerKey = urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
        );

        // サブスクリプションを作成
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        console.log('Push Subscription:', subscription);

        // サブスクリプションをAPIに送信
        await fetch('/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });

        console.log('Push Subscription sent to server successfully.');
      } catch (error) {
        console.error('Push Subscription failed:', error);
      }
    }
  };

  useEffect(() => {
    const setupPushNotifications = async () => {
      await registerServiceWorker();
      await subscribeToPushNotifications();
    };

    setupPushNotifications();
  }, []);

  const handleSubscribe = async () => {
    try {
      await subscribeToPushNotifications();
      console.log('Push Subscription triggered manually.');
    } catch (error) {
      console.error('Error in manual subscription:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Management</h1>
      <button onClick={handleSubscribe}>通知購読を手動でテスト</button>
      <nav style={{ marginBottom: '20px' }}>
        <Link href="/edit-profile" style={{ textDecoration: 'none', color: 'blue' }}>
          Edit Profile
        </Link>
      </nav>

      <form onSubmit={editTaskId ? handleUpdateTask : handleAddTask}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={profileImage || 'default-profile.png'}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        </div>
        <div>
          <label htmlFor="taskName">Task Name:</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="taskDescription">Task Description:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          {editTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      <ul style={{ marginTop: '20px', padding: '0', listStyleType: 'none' }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleEditTask(task)} style={{ marginRight: '10px' }}>
              Edit
            </button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
