import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Settings as SettingsIcon, Shield, Users, 
  Sliders, FileText, Info, Check, Monitor, Smartphone, 
  Cloud, Search, Plus, Download, RefreshCw, Key, ShieldAlert, Briefcase, Trash2
} from 'lucide-react';
import TopBar from './TopBar';
import { exportToCSV } from '../utils/exportUtils';
import { useReports } from '../context/ReportsContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile & Account');
  
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('sentinai_profile');
    if (saved) return JSON.parse(saved);
    return {
      firstName: 'Insp. Raj',
      lastName: 'Kumar',
      email: 'raj.kumar@ksp.gov.in',
      phone: '+91 98765 43210',
      department: 'Cyber Crime Cell',
      designation: 'Senior Inspector'
    };
  });

  const [profilePhoto, setProfilePhoto] = useState("https://i.pravatar.cc/150?u=a042581f4e29026704d");
  const fileInputRef = useRef(null);

  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem('sentinai_toggles');
    if (saved) return JSON.parse(saved);
    return {
      autoRefresh: true,
      showTips: true,
      compactView: false,
      darkMode: true,
      twoFactor: true
    };
  });

  const [fontSize, setFontSize] = useState('Medium');
  const [animationSpeed, setAnimationSpeed] = useState(2);

  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api?route=all_users');
        const data = await response.json();
        if (data.success) {
          const mappedUsers = data.data.map(u => ({
            id: `#KSP-${u.id}`,
            rawId: u.id,
            initials: u.name ? u.name.substring(0, 2).toUpperCase() : 'U',
            name: u.name || u.username,
            email: `${u.username}@ksp.gov.in`,
            role: u.role || 'Investigator',
            status: 'Active',
            color: (u.role || '').toLowerCase() === 'admin' ? 'blue' : 'emerald'
          }));
          setOfficers(mappedUsers);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetch(`/api?route=get_profile&id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setProfileData(prev => ({
              ...prev,
              firstName: data.user.firstName || currentUser.name?.split(' ')[0] || '',
              lastName: data.user.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '',
              phone: data.user.phone || '',
              email: data.user.email || currentUser.email || '',
              department: data.user.division || currentUser.division || '',
              designation: data.user.role || currentUser.role || ''
            }));
            if (data.user.profilePhoto) {
              setProfilePhoto(data.user.profilePhoto);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'Audit Logs') {
      const fetchLogs = async () => {
        try {
          const res = await fetch('/api?route=audit_logs');
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setAuditLogs(json.data);
            }
          }
        } catch (err) {
          console.error("Failed to fetch audit logs", err);
        }
      };
      fetchLogs();
    }
  }, [activeTab]);

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this audit log?')) return;
    try {
      const res = await fetch('/api?route=audit_logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setAuditLogs(prev => prev.filter(log => (log.id || log.ROWID) !== id));
      }
    } catch (err) {
      console.error("Failed to delete audit log", err);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear ALL audit logs? This cannot be undone.')) return;
    try {
      const res = await fetch('/api?route=clear_audit_logs', {
        method: 'DELETE'
      });
      if (res.ok) {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Failed to clear audit logs", err);
    }
  };

  const { reports: adminTasks, setReports: setAdminTasks, addReport, updateReportStatus, removeReport, refreshReports } = useReports();

  useEffect(() => {
    if (activeTab === 'Admin Controls' && refreshReports) {
      refreshReports();
    }
  }, [activeTab]);

  const logAction = async (actionText) => {
    try {
      await fetch('/api?route=audit_logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logTime: new Date().toLocaleString(),
          userName: currentUser?.name || 'System',
          action: actionText,
          ip: 'Client',
          status: 'Success'
        })
      });
      // Refresh audit logs if we are on that tab
      if (activeTab === 'Audit Logs') {
        const res = await fetch('/api?route=audit_logs');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) setAuditLogs(json.data);
        }
      }
    } catch (e) { console.error('Failed to log action', e); }
  };

  const handleAddAdminTask = async () => {
    const title = prompt("Enter task title:");
    if (!title) return;
    const category = prompt("Enter category (e.g., Compliance, HR, Database, Cyber Crime):") || 'General';
    const priority = prompt("Enter priority (High, Medium, Low):") || 'Medium';
    
    await addReport({
      title,
      category,
      priority,
      date: new Date().toISOString(),
      status: 'Pending',
      reporter: 'Admin User',
      assigned: 'Unassigned',
      location: 'N/A',
      description: 'New admin task'
    });
    logAction(`Created New Admin Task: ${title}`);
  };

  const handleUpdateAdminTaskStatus = async (id, newStatus) => {
    await updateReportStatus(id, newStatus);
    logAction(`Updated Report ${id} to ${newStatus}`);
  };

  const handleRemoveAdminTask = async (id) => {
    if (window.confirm("Remove this report/task?")) {
      await removeReport(id);
      logAction(`Deleted Report ${id}`);
    }
  };

  const handleToggle = (key) => {
    setToggles(prev => {
      const newValue = !prev[key];
      
      // Handle DOM updates for system preferences
      if (key === 'darkMode') {
        if (!newValue) {
          document.body.classList.add('light-mode');
        } else {
          document.body.classList.remove('light-mode');
        }
      }
      if (key === 'compactView') {
        if (newValue) {
          document.body.classList.add('compact-ui');
        } else {
          document.body.classList.remove('compact-ui');
        }
      }
      
      return { ...prev, [key]: newValue };
    });
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    const htmlElement = document.documentElement;
    if (size === 'Small') htmlElement.style.fontSize = '12px';
    if (size === 'Medium') htmlElement.style.fontSize = '16px';
    if (size === 'Large') htmlElement.style.fontSize = '20px';
  };

  const handleAnimationSpeed = (e) => {
    const val = parseInt(e.target.value);
    setAnimationSpeed(val);
    const speed = val === 1 ? '0.6s' : val === 2 ? '0.3s' : '0.1s';
    document.documentElement.style.setProperty('--animation-speed', speed);
    document.body.classList.add('animate-test');
    setTimeout(() => document.body.classList.remove('animate-test'), 1000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 150;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to low quality jpeg to save DB space
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setProfilePhoto(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto("https://via.placeholder.com/150?text=KSP");
  };

  const handleAddOfficer = async () => {
    const username = prompt("Enter new officer username (e.g. jdoe):");
    if (!username) return;
    const name = prompt("Enter full name:");
    const role = prompt("Enter role (Admin or Investigator):", "Investigator");
    const password = prompt("Enter temporary password for the user:");
    
    if (username && password) {
      try {
        const email = `${username.toLowerCase().replace(' ', '.')}@ksp.gov.in`;
        const response = await fetch('/api?route=register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            name: name || username,
            email: email,
            password: password,
            role: role || 'Investigator',
            division: 'General',
            forceApprove: true
          })
        });
        
        const data = await response.json();
        if (data.success) {
          // Refresh the list
          const refreshRes = await fetch('/api?route=all_users');
          const refreshData = await refreshRes.json();
          if (refreshData.success) {
            const mappedUsers = refreshData.data.map(u => ({
              id: `#KSP-${u.id}`,
              rawId: u.id,
              initials: u.name ? u.name.substring(0, 2).toUpperCase() : 'U',
              name: u.name || u.username,
              email: `${u.username}@ksp.gov.in`,
              role: u.role || 'Investigator',
              status: 'Active',
              color: (u.role || '').toLowerCase() === 'admin' ? 'blue' : 'emerald'
            }));
            setOfficers(mappedUsers);
          }
          alert("Officer created successfully!");
        } else {
          alert("Failed to create officer: " + data.error);
        }
      } catch (err) {
        console.error('Error creating user:', err);
        alert("Failed to create officer due to a network error.");
      }
    }
  };

  const handleDeleteOfficer = async (id, rawId) => {
    if (window.confirm("Are you sure you want to delete this officer account?")) {
      try {
        if (rawId) {
          await fetch(`/api?route=reject_user&id=${rawId}`, { method: 'DELETE' });
        }
        setOfficers(officers.filter(o => o.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleSaveChanges = async () => {
    localStorage.setItem('sentinai_profile', JSON.stringify(profileData));
    localStorage.setItem('sentinai_toggles', JSON.stringify(toggles));
    
    if (currentUser?.id) {
      try {
        await fetch('/api?route=update_profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentUser.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            department: profileData.department,
            designation: profileData.designation,
            profilePhoto: profilePhoto
          })
        });
      } catch (err) {
        console.error('Failed to update profile to DB', err);
      }
    }

    alert("Settings saved successfully!");
  };

  const menuItems = [
    { name: 'Profile & Account', icon: <User className="w-4 h-4" /> },
    { name: 'General Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    { name: 'Security Settings', icon: <Shield className="w-4 h-4" /> },
    { name: 'User Management', icon: <Users className="w-4 h-4" /> },
    { name: 'Other Users', icon: <Users className="w-4 h-4" /> },
    { name: 'System Preferences', icon: <Sliders className="w-4 h-4" /> },
    { name: 'Admin Controls', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { name: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    const isAdmin = (currentUser?.role || '').toLowerCase() === 'admin';
    if (['User Management', 'Admin Controls', 'Audit Logs'].includes(item.name)) {
      return isAdmin;
    }
    if (item.name === 'Other Users') {
      return !isAdmin;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col h-full page-enter">
      <TopBar title="Settings" subtitle="Manage your account, system preferences and security settings">
        <button onClick={handleSaveChanges} className="flex items-center space-x-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg">
          <Check className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </TopBar>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex flex-col min-h-0 flex-shrink-0">
          <div className="px-3 pb-3">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Settings Menu</h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 pr-2">
            {visibleMenuItems.map((item, i) => (
              <div 
                key={i} 
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  activeTab === item.name ? 'bg-[#4c1d95] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span className={`text-sm ${activeTab === item.name ? 'font-medium' : ''}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Content - Full Width now */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 pb-20 md:pb-4 settings-content">
          
          {activeTab === 'Profile & Account' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <h3 className="text-xl font-bold text-white mb-2">Profile & Account</h3>
              <p className="text-sm text-slate-400 mb-8">Manage your personal information and profile picture.</p>
              
              <div className="flex items-center space-x-6 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4c1d95]">
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#4c1d95] p-2 rounded-full text-white hover:bg-[#5b21b6] border-2 border-[#0b1120]">
                    <User className="w-4 h-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-sm text-slate-400">{profileData.designation}</p>
                  <div className="flex space-x-3 mt-3">
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">Change Photo</button>
                    <button onClick={handleRemovePhoto} className="text-xs border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg transition-colors">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-medium text-slate-400">First Name</label>
                  <input type="text" id="firstName" value={profileData.firstName} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-medium text-slate-400">Last Name</label>
                  <input type="text" id="lastName" value={profileData.lastName} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-slate-400">Email Address</label>
                  <input type="email" id="email" value={profileData.email} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-medium text-slate-400">Phone Number</label>
                  <input type="text" id="phone" value={profileData.phone} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-xs font-medium text-slate-400">Department</label>
                  <div className="relative">
                    <select id="department" value={profileData.department} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors appearance-none">
                      <option>Cyber Crime Cell</option>
                      <option>Narcotics Control</option>
                      <option>Traffic Division</option>
                      <option>Homicide</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="designation" className="text-xs font-medium text-slate-400">Designation</label>
                  <input type="text" id="designation" value={profileData.designation} onChange={handleInputChange} className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-500 focus:outline-none transition-colors cursor-not-allowed" readOnly />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'General Settings' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <h3 className="text-xl font-bold text-white mb-2">General Settings</h3>
              <p className="text-sm text-slate-400 mb-8">Manage system-wide preferences and defaults.</p>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-800 pb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Timezone</label>
                    <div className="relative">
                      <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors appearance-none">
                        <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Language</label>
                    <div className="relative">
                      <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors appearance-none">
                        <option>English (UK)</option>
                        <option>Hindi</option>
                        <option>Kannada</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Default Dashboard View</label>
                    <div className="relative">
                      <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors appearance-none">
                        <option>Command Center (Overview)</option>
                        <option>Suspect Network</option>
                        <option>Crime Map</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Time Format</label>
                    <div className="relative">
                      <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors appearance-none">
                        <option>12-hour (AM/PM)</option>
                        <option>24-hour</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Auto-refresh Dashboard Data</p>
                      <p className="text-xs text-slate-500 mt-1">Automatically refresh KPI data every 5 minutes</p>
                    </div>
                    <div onClick={() => handleToggle('autoRefresh')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggles.autoRefresh ? 'bg-[#4c1d95]' : 'bg-slate-700'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggles.autoRefresh ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Show Co-Pilot Tooltips</p>
                      <p className="text-xs text-slate-500 mt-1">Show AI suggestions in the interface</p>
                    </div>
                    <div onClick={() => handleToggle('showTips')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggles.showTips ? 'bg-[#4c1d95]' : 'bg-slate-700'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggles.showTips ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security Settings' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-emerald-500" /> Security Settings
              </h3>
              <p className="text-sm text-slate-400 mb-8">Manage passwords, authentication, and monitor your active sessions.</p>
              
              <div className="space-y-8">
                {/* 2FA Toggle */}
                <div className="bg-slate-800/30 border border-emerald-500/30 p-6 rounded-xl flex items-start justify-between">
                  <div className="flex items-start">
                    <ShieldAlert className="w-8 h-8 text-emerald-500 mr-4 mt-1" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-400 max-w-xl mb-3">Add an extra layer of security to your account. When enabled, you'll be prompted for a secure code from your mobile device during login.</p>
                      <button className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors">Configure App</button>
                    </div>
                  </div>
                  <div onClick={() => handleToggle('twoFactor')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggles.twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggles.twoFactor ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="border border-slate-800 p-6 rounded-xl">
                  <h4 className="text-white font-medium mb-4 flex items-center"><Key className="w-4 h-4 mr-2" /> Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                    </div>
                    <div className="hidden md:block"></div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4c1d95] transition-colors" />
                    </div>
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">Update Password</button>
                </div>

                {/* Active Sessions */}
                <div>
                  <h4 className="text-white font-medium mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="bg-[#0b1120] border border-[#4c1d95]/30 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-[#4c1d95]/20 p-3 rounded-lg"><Monitor className="w-6 h-6 text-[#4c1d95]" /></div>
                        <div>
                          <p className="text-white font-medium text-sm">Windows • Chrome Browser</p>
                          <p className="text-xs text-slate-400">Bengaluru, India (IP: 192.168.1.45)</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold mb-1">CURRENT SESSION</span>
                        <p className="text-xs text-slate-500">Active now</p>
                      </div>
                    </div>
                    <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-800 p-3 rounded-lg"><Smartphone className="w-6 h-6 text-slate-400" /></div>
                        <div>
                          <p className="text-white font-medium text-sm">Android • Official App</p>
                          <p className="text-xs text-slate-400">Mysuru, India (IP: 103.45.67.89)</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <button className="text-xs text-rose-500 hover:text-rose-400 underline mb-1">Revoke Access</button>
                        <p className="text-xs text-slate-500">Last active: 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'User Management' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                  <p className="text-sm text-slate-400">Manage officer accounts, assign roles, and control system access.</p>
                </div>
                <button onClick={handleAddOfficer} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <Plus className="w-4 h-4 mr-2" /> Add New Officer
                </button>
              </div>
              
              <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search officers..." className="bg-slate-800 border border-slate-700 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#4c1d95] w-64" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/30 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <th className="p-4 font-medium">Officer Name</th>
                        <th className="p-4 font-medium">Badge ID</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {officers.map((officer, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors animate-fade-in-up">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full bg-${officer.color}-500/20 text-${officer.color}-400 flex items-center justify-center font-bold mr-3`}>
                                {officer.initials}
                              </div>
                              <div>
                                <p className="text-white font-medium">{officer.name}</p>
                                <p className="text-xs text-slate-500">{officer.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">{officer.id}</td>
                          <td className="p-4">
                            <span className={`bg-slate-700 text-slate-300 border border-slate-600 px-2 py-1 rounded text-xs`}>
                              {officer.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`${officer.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'} flex items-center`}>
                              <span className={`w-2 h-2 rounded-full ${officer.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} mr-2`}></span>
                              {officer.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-slate-400 hover:text-white mr-3">Edit</button>
                            <button onClick={() => handleDeleteOfficer(officer.id, officer.rawId)} className="text-slate-400 hover:text-rose-400">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Other Users' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Team Directory</h3>
                  <p className="text-sm text-slate-400">View other officers and team members in the SentinAI platform.</p>
                </div>
              </div>
              
              <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search officers..." className="bg-slate-800 border border-slate-700 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#4c1d95] w-64" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/30 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <th className="p-4 font-medium">Officer Name</th>
                        <th className="p-4 font-medium">Badge ID</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm">
                      {officers.map((officer, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors animate-fade-in-up">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full bg-${officer.color}-500/20 text-${officer.color}-400 flex items-center justify-center font-bold mr-3`}>
                                {officer.initials}
                              </div>
                              <div>
                                <p className="text-white font-medium">{officer.name}</p>
                                <p className="text-xs text-slate-500">{officer.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300">{officer.id}</td>
                          <td className="p-4">
                            <span className={`bg-slate-700 text-slate-300 border border-slate-600 px-2 py-1 rounded text-xs`}>
                              {officer.role}
                            </span>
                          </td>
                          <td className="p-4 flex justify-end">
                            <span className={`${officer.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'} flex items-center`}>
                              <span className={`w-2 h-2 rounded-full ${officer.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} mr-2`}></span>
                              {officer.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'System Preferences' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <h3 className="text-xl font-bold text-white mb-2">System Preferences</h3>
              <p className="text-sm text-slate-400 mb-8">Customize the appearance and behavior of the SentinAI platform.</p>
              
              <div className="space-y-8">
                {/* Appearance */}
                <div>
                  <h4 className="text-white font-medium mb-4 pb-2 border-b border-slate-800">Appearance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center justify-between bg-[#0b1120] p-4 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Dark Mode</p>
                        <p className="text-xs text-slate-500 mt-1">Enable dark theme for the entire UI</p>
                      </div>
                      <div onClick={() => handleToggle('darkMode')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggles.darkMode ? 'bg-[#4c1d95]' : 'bg-slate-700'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggles.darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0b1120] p-4 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-200">Compact Interface</p>
                        <p className="text-xs text-slate-500 mt-1">Reduce spacing to fit more data on screen</p>
                      </div>
                      <div onClick={() => handleToggle('compactView')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${toggles.compactView ? 'bg-[#4c1d95]' : 'bg-slate-700'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${toggles.compactView ? 'right-0.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h4 className="text-white font-medium mb-4 pb-2 border-b border-slate-800">Typography & Scale</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-slate-400">Font Size</label>
                      <div className="flex space-x-2">
                        {['Small', 'Medium', 'Large'].map(size => (
                          <button 
                            key={size}
                            onClick={() => handleFontSizeChange(size)}
                            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                              fontSize === size ? 'bg-[#4c1d95]/20 border border-[#4c1d95] text-white font-medium' : 'bg-[#0b1120] border border-slate-700 hover:border-[#4c1d95] text-slate-300'
                            }`}
                          >
                            {size} {size === 'Medium' && '(Default)'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-slate-400">Animation Speed</label>
                      <div className="relative pt-2">
                        <input type="range" min="1" max="3" value={animationSpeed} onChange={handleAnimationSpeed} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4c1d95]" />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                          <span>Slow</span>
                          <span>Normal</span>
                          <span>Fast</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Admin Controls' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Briefcase className="w-6 h-6 mr-2 text-blue-500" /> Admin Controls
                  </h3>
                  <p className="text-sm text-slate-400">Manage administrative tasks, track priorities, and resolve pending issues.</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={refreshReports} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs transition-colors flex items-center border border-slate-700">
                    <RefreshCw className="w-3 h-3 mr-2" /> Refresh
                  </button>
                  <button onClick={handleAddAdminTask} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs transition-colors flex items-center shadow-lg shadow-blue-500/20">
                    <Plus className="w-3 h-3 mr-2" /> Add Task
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-800/30 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Priority</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {adminTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                          <td className="p-4 font-medium text-white">{task.title}</td>
                          <td className="p-4 text-xs">{task.category}</td>
                          <td className="p-4 text-xs text-slate-500">{new Date(task.date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${task.priority === 'High' || task.priority === 'Critical' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : task.priority === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="p-4">
                            <select 
                              value={task.status}
                              onChange={(e) => handleUpdateAdminTaskStatus(task.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer outline-none appearance-none text-center ${
                                task.status === 'Resolved' || task.status === 'Closed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : 
                                task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30' : 
                                'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                              }`}
                              style={{ textAlignLast: 'center' }}
                            >
                              <option value="Pending" className="bg-[#0b1120] text-amber-400">Pending</option>
                              <option value="In Progress" className="bg-[#0b1120] text-blue-400">In Progress</option>
                              <option value="Resolved" className="bg-[#0b1120] text-emerald-400">Resolved</option>
                              <option value="Closed" className="bg-[#0b1120] text-slate-400">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleRemoveAdminTask(task.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-2 hover:bg-slate-800 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {adminTasks.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">No tasks found. Click "Add Task" to create one.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Audit Logs' && (
            <div className="glass-panel p-6 md:p-8 rounded-xl animate-fadeUp">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Audit Logs & Backup</h3>
                  <p className="text-sm text-slate-400">Monitor system activity, user events, and manage system backups.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs transition-colors flex items-center border border-slate-700">
                    <RefreshCw className="w-3 h-3 mr-2" /> Restore
                  </button>
                  <button className="bg-[#4c1d95]/20 text-purple-400 hover:bg-[#4c1d95]/30 px-4 py-2 rounded-lg text-xs transition-colors flex items-center border border-[#4c1d95]/50">
                    <Cloud className="w-3 h-3 mr-2" /> Backup Now
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0b1120] rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h4 className="font-medium text-sm text-white">System Events</h4>
                  <div className="flex space-x-3">
                    <button onClick={handleClearLogs} className="text-xs text-rose-400 hover:text-rose-300 flex items-center transition-colors"><Trash2 className="w-3 h-3 mr-1"/> Clear All</button>
                    <button onClick={() => exportToCSV(auditLogs, 'system_audit_logs.csv')} className="text-xs text-slate-400 hover:text-white flex items-center transition-colors"><Download className="w-3 h-3 mr-1"/> Export Log</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-800/30 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                        <th className="p-4 font-medium">Timestamp</th>
                        <th className="p-4 font-medium">User</th>
                        <th className="p-4 font-medium">Action</th>
                        <th className="p-4 font-medium">IP Address</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium w-10 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                          <td className="p-4 whitespace-nowrap text-xs">{log.logTime || log.timestamp}</td>
                          <td className="p-4 font-medium">{log.userName || log.user}</td>
                          <td className="p-4">{log.action}</td>
                          <td className="p-4 text-xs font-mono text-slate-500">{log.ip}</td>
                          <td className="p-4"><span className={`${log.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'} text-xs`}>{log.status}</span></td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleDeleteLog(log.id || log.ROWID)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors group"
                              title="Delete Log"
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'About' && (
            <div className="glass-panel p-6 md:p-10 rounded-xl animate-fadeUp flex flex-col items-center text-center mt-4">
              <div className="w-20 h-24 mb-6 relative">
                <Shield className="w-full h-full text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#4c1d95] rounded-full"></div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">SentinAI</h2>
              <p className="text-blue-400 font-medium tracking-widest uppercase text-sm mb-8">KSP Command Center</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10 text-left">
                <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Version</p>
                  <p className="text-lg text-white font-medium">2.1.0 (Stable)</p>
                </div>
                <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">AI Engine</p>
                  <p className="text-lg text-white font-medium">Zoho Catalyst</p>
                </div>
                <div className="bg-[#0b1120] border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">License</p>
                  <p className="text-lg text-white font-medium">KSP Internal Gov</p>
                </div>
              </div>

              <div className="max-w-2xl w-full space-y-4 text-left">
                <p className="text-sm text-slate-400 leading-relaxed">
                  SentinAI is an advanced predictive policing and intelligence dashboard developed exclusively for the Karnataka State Police. It leverages Zoho Catalyst's serverless infrastructure and Generative AI capabilities to provide real-time crime analytics, suspect network mapping, and a conversational AI Co-Pilot for field officers.
                </p>
                <div className="pt-6 mt-4 flex flex-wrap justify-center gap-6 border-t border-slate-800">
                  <a href="#" className="text-xs text-blue-400 hover:underline">Privacy Policy</a>
                  <a href="#" className="text-xs text-blue-400 hover:underline">Terms of Service</a>
                  <a href="#" className="text-xs text-blue-400 hover:underline">System Architecture</a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
