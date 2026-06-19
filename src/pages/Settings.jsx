import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Paintbrush, Smartphone, Check, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [isSaved, setIsSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [digest, setDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  const handleThemeChange = (theme) => {
    setThemePreference(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.removeItem('theme');
    }
    window.dispatchEvent(new Event('themeChange'));
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`${
        enabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );

  const handleSave = () => {
    updateProfile(name);
    localStorage.setItem('bio', bio);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    document.getElementById('avatar-upload').click();
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("File size exceeds 800KB. Please choose a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Paintbrush size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-brandText tracking-tight mb-1">Settings</h1>
        <p className="text-slate-500 dark:text-brandMuted text-sm">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-panel rounded-2xl p-2 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                  activeTab === tab.id
                    ? 'bg-primary text-white dark:text-brandBg shadow-lg'
                    : 'text-slate-600 dark:text-brandMuted hover:bg-slate-100 dark:hover:bg-brandSidebar'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 max-w-3xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-brandText mb-4">Profile Information</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-3xl font-bold text-slate-900 shadow-xl overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <input type="file" id="avatar-upload" onChange={handleAvatarUpload} className="hidden" accept="image/png, image/jpeg, image/gif" />
                      <button onClick={handleAvatarClick} className="btn-secondary text-sm mb-2">Upload new avatar</button>
                      <p className="text-xs text-slate-500 dark:text-brandMuted">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-brandText">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="premium-input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-brandText">Email Address</label>
                    <input type="email" defaultValue={user?.email} disabled className="premium-input opacity-70 cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-brandText">Bio</label>
                  <textarea 
                    rows="3" 
                    placeholder="Write a few sentences about yourself" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="premium-input p-4 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end items-center gap-4">
                  {isSaved && <span className="text-success text-sm font-medium">Changes saved!</span>}
                  <button onClick={handleSave} className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-brandText mb-4">Theme Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleThemeChange('light')}
                    className={`border-2 rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all ${themePreference === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-brandSidebar hover:border-primary-500/50'}`}
                  >
                    {themePreference === 'light' && <div className="absolute top-4 right-4 text-primary-500"><Check size={20} /></div>}
                    <div className="flex items-center gap-3 mb-2">
                      <Sun className="text-slate-700 dark:text-brandText" />
                      <span className="font-bold text-slate-900 dark:text-brandText">Light Mode</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-brandMuted">Clean and bright</p>
                  </div>
                  
                  <div 
                    onClick={() => handleThemeChange('dark')}
                    className={`border-2 rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all ${themePreference === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-brandSidebar hover:border-primary-500/50'}`}
                  >
                    {themePreference === 'dark' && <div className="absolute top-4 right-4 text-primary-500"><Check size={20} /></div>}
                    <div className="flex items-center gap-3 mb-2">
                      <Moon className="text-slate-700 dark:text-brandText" />
                      <span className="font-bold text-slate-900 dark:text-brandText">Dark Mode</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-brandMuted">Easy on the eyes</p>
                  </div>

                  <div 
                    onClick={() => handleThemeChange('system')}
                    className={`border-2 rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all ${themePreference === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-brandSidebar hover:border-primary-500/50'}`}
                  >
                    {themePreference === 'system' && <div className="absolute top-4 right-4 text-primary-500"><Check size={20} /></div>}
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="text-slate-700 dark:text-brandText" />
                      <span className="font-bold text-slate-900 dark:text-brandText">System</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-brandMuted">Matches your OS</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-brandText mb-1">Notification Preferences</h3>
                  <p className="text-slate-500 dark:text-brandMuted text-sm mb-6">Choose what updates you want to receive and how you want to receive them.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-brandSidebar rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-brandText">Email Notifications</h4>
                      <p className="text-sm text-slate-500 dark:text-brandMuted">Receive updates and alerts via email.</p>
                    </div>
                    <Toggle enabled={emailNotif} onChange={setEmailNotif} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-brandSidebar rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-brandText">Push Notifications</h4>
                      <p className="text-sm text-slate-500 dark:text-brandMuted">Receive instant push notifications in your browser.</p>
                    </div>
                    <Toggle enabled={pushNotif} onChange={setPushNotif} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-brandSidebar rounded-xl border border-slate-100 dark:border-white/5">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-brandText">Weekly Digest</h4>
                      <p className="text-sm text-slate-500 dark:text-brandMuted">Get a weekly summary of your completed tasks.</p>
                    </div>
                    <Toggle enabled={digest} onChange={setDigest} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-brandText mb-1">Security Settings</h3>
                  <p className="text-slate-500 dark:text-brandMuted text-sm mb-6">Manage your password and secure your account.</p>
                </div>

                <div className="space-y-4 border-b border-slate-200 dark:border-white/5 pb-8">
                  <h4 className="font-semibold text-slate-900 dark:text-brandText">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="password" placeholder="Current password" className="premium-input" />
                    <input type="password" placeholder="New password" className="premium-input" />
                  </div>
                  <button className="btn-secondary mt-2">Update Password</button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-brandText">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 dark:text-brandMuted">Add an extra layer of security to your account.</p>
                  </div>
                  <Toggle enabled={twoFactor} onChange={setTwoFactor} />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
