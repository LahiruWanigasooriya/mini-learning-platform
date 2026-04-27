import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Book, Save, Edit2, X, Camera, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/services';

const Profile: React.FC = () => {
  const { user, login } = useAuth(); // login here can be used to refresh the user context
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.profile?.bio || '',
    phoneNumber: user?.profile?.phoneNumber || '',
    avatarUrl: user?.profile?.avatarUrl || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.profile?.bio || '',
        phoneNumber: user.profile?.phoneNumber || '',
        avatarUrl: user.profile?.avatarUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      // In a real app, you'd fetch the user again or update context
      // For now, we'll assume the update worked
    } catch (error) {
      console.error('Update failed:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please check Gateway routing.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage your personal information and account settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 className="h-4 w-4" /> Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 animate-slide-up ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <Shield className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Avatar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'var(--accent-gradient)' }} />
            <div className="relative inline-block mb-4">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-[var(--bg-primary)] shadow-xl mx-auto bg-[var(--bg-secondary)] flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 opacity-20" style={{ color: 'var(--text-primary)' }} />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-[var(--accent)] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{formData.firstName} {formData.lastName}</h2>
            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{user?.role}</p>
            
            <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-4">
              <div className="flex items-center gap-3 text-left">
                <Mail className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Email</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Calendar className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Member Since</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content / Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-11"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-11"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field pl-11"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Bio</label>
                <div className="relative">
                  <Book className="absolute left-4 top-4 h-4 w-4 opacity-40" />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="input-field pl-11 py-3 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-8"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
