import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Workflow } from 'lucide-react';
import { toast } from 'sonner';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials. Try: admin@perceive.now');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <Workflow size={40} />
          </div>
          <h1 className="login-title">Perceive Now</h1>
          <p className="login-subtitle">Building the Eyes and Hands of Automation</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@perceive.now"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo Accounts:</p>
          <ul className="demo-list">
            <li><strong>Admin:</strong> admin@perceive.now</li>
            <li><strong>Analyst:</strong> analyst@perceive.now</li>
            <li><strong>Viewer:</strong> viewer@perceive.now</li>
          </ul>
          <p className="demo-note">Use any password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
