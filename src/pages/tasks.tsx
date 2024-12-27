import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Task = {
  id: number;
  name: string;
  description: string;
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  useEffect(() => {
    // Load tasks from cookies
    const storedTasks = Cookies.get('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasksToCookies = (tasks: Task[]) => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
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
        : task
    );

    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);

    setTaskName('');
    setTaskDescription('');
    setEditTaskId(null);
  };

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Management</h1>
      <form onSubmit={editTaskId ? handleUpdateTask : handleAddTask}>
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
