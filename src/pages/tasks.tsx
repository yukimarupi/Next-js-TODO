/* eslint-disable @next/next/no-img-element */
//モジュールのインポート
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

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

  useEffect(() => {
    // ログイン状態を確認
    const isLoggedIn = Cookies.get('isLoggedIn');
    console.log("🚀 ~ useEffect ~ isLoggedIn:", isLoggedIn)
    if (!isLoggedIn) {
      router.push('/login'); // 未ログインの場合はログインページへリダイレクト
    }

    // Cookieからユーザー情報を読み込む
    const storedUser = Cookies.get('user');
    console.log("🚀 ~ useEffect ~ storedUser:", storedUser)
    if (storedUser) {
      // localStorageからプロフィール画像を読み込む
      const storedProfileImage = localStorage.getItem('profileImage');
      if (storedProfileImage) {
        setProfileImage(storedProfileImage);
      } else {
        setProfileImage('default-profile.png'); // デフォルト画像を設定
      }
    }

    // Cookieからタスクを読み込む
    const storedTasks = Cookies.get('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // タスクをCookieに保存する
  const saveTasksToCookies = (tasks: Task[]) => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
  };

  // タスクの追加
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

    setTaskName('');
    setTaskDescription('');
  };

  //タスクの編集
  const handleEditTask = (task: Task) => {
    setEditTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description);
  };

  //タスクリストを更新し、対象のタスクのみ名前や説明を上書き
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert('Task name is required.');
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId
        ? { ...task, name: taskName, description: taskDescription }
        : task
    );

    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);

    setTaskName('');
    setTaskDescription('');
    setEditTaskId(null);
  };

  //タスクの削除
  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Management</h1>

      {/* Edit Profileへのリンクを追加 */}
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
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
          }}
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