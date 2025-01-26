import React, { useState } from 'react';
import { AuthResponse, register } from '../api/auth';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { validateRegisterForm } from '../utils/validationUtils';
import ApiError from '../types/ApiError';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: string; email: string; password: string }>({
    name: '',
    email: '',
    password: '',
  });

  const { login: performLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void (async () => {
      setLoading(true);

      const validationErrors = validateRegisterForm({ name, email, password });
      if (Object.values(validationErrors).some((error) => error)) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      setErrors({ name: '', email: '', password: '' });

      try {
        const data: AuthResponse = await register(name, email, password);
        performLogin(data.token);
        toast.success('Registration successful!');
      } catch (err) {
        const errorMessage =
          (err as ApiError)?.response?.data?.error || 'Registration failed. Please try again.';
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
            <h2
              className="text-center text-secondary mb-4"
              style={{ fontSize: '2rem', fontWeight: '700' }}
            >
              Create an account
            </h2>
            <form onSubmit={(e) => handleSubmit(e)} noValidate>
              <div className="form-floating mb-3">
                <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="John Doe"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />
                <label htmlFor="name">Name</label>
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <label htmlFor="email">Email</label>
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-floating mb-3 position-relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <label htmlFor="password">Password</label>
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                  {loading ? 'Processing...' : 'Sign up'}
                </button>
              </div>

              <p className="m-0 text-secondary text-center">
                Already have an account?{' '}
                <Link to="/login" className="link-primary text-decoration-none">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
