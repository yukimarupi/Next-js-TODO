import Link from 'next/link';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the TODO App</h1>
      <p>Manage your tasks efficiently with our app!</p>
      <nav style={{ marginTop: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/register" legacyBehavior>
              <a style={{ textDecoration: 'none', color: 'blue' }}>Register</a>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/login" legacyBehavior>
              <a style={{ textDecoration: 'none', color: 'blue' }}>Login</a>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/tasks" legacyBehavior>
              <a style={{ textDecoration: 'none', color: 'blue' }}>Tasks</a>
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/contact" legacyBehavior>
              <a style={{ textDecoration: 'none', color: 'blue' }}>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
