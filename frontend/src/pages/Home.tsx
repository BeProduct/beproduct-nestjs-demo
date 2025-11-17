import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>BeProduct OAuth Demo</h1>
      <p>Welcome to the OAuth authentication demo application.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">
          <button style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Get Started - Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
