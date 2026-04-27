import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/services';
import { BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(formData);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div
            className="p-3 rounded-2xl"
            style={{ background: 'var(--accent-gradient)', boxShadow: '0 8px 24px rgba(30,58,138,0.2)' }}
          >
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>First name</label>
                <input
                  id="firstName" name="firstName" type="text" required
                  value={formData.firstName} onChange={handleChange}
                  className="glass-input"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Last name</label>
                <input
                  id="lastName" name="lastName" type="text" required
                  value={formData.lastName} onChange={handleChange}
                  className="glass-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address</label>
              <input
                id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                className="glass-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                id="password" name="password" type="password" required
                value={formData.password} onChange={handleChange}
                className="glass-input"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Account Type</label>
              <select
                id="role" name="role"
                value={formData.role} onChange={handleChange}
                className="glass-select"
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
