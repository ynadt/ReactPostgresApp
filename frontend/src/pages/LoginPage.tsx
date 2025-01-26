import React, { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import ApiError from '../types/ApiError';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login: performLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void (async () => {
      setLoading(true);
      try {
        const data = await login(email, password);
        performLogin(data.token);
        toast.success('Successfully logged in!');
      } catch (err) {
        const errorMessage =
          (err as ApiError)?.response?.data?.error || 'Login failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
        <div className="card border border-light-subtle rounded-3 shadow-sm">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <h2 className="text-center text-secondary mb-4" style={{ fontSize: '2rem', fontWeight: '700' }}>
              Sign in to your account
            </h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              {/* Email Input */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="form-floating mb-3 position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <label htmlFor="password">Password</label>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="d-grid my-3">
                <button
                  type="submit"
                  className="btn btn-dark btn-lg d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
              <p className="m-0 text-secondary text-center">
                Don&#39;t have an account?{' '}
                <Link to="/register" className="link-primary text-decoration-none">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
