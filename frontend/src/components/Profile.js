import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import MobileMenuButton from './MobileMenuButton';

const Profile = ({ user, token, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    department: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading profile with token:', token);
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile API error:', errorText);
        throw new Error(`Failed to load profile: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Profile data received:', result);
      const data = result.data;
      
      setProfileData(data);
      setFormData({
        name: data.name,
        email: data.email,
        contact_number: data.contact_number,
        department: data.department
      });
      setPrivacySettings(data.notification_preferences || {});
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage(`Failed to load profile data: ${error.message}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/;
    if (!formData.contact_number || !phoneRegex.test(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid phone number (+94 XX XXX XXXX)';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      setProfileData(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData.name,
      email: profileData.email,
      contact_number: profileData.contact_number,
      department: profileData.department
    });
    setEditMode(false);
    setErrors({});
  };

  const getContributionBadge = (score) => {
    if (score >= 90) return { emoji: '🌟', text: 'Super Helper' };
    if (score >= 70) return { emoji: '⭐', text: 'Active Member' };
    if (score >= 50) return { emoji: '👍', text: 'Good Member' };
    return { emoji: '🆕', text: 'New Member' };
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const savePrivacySettings = async () => {
    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(privacySettings)
      });
      
      if (response.ok) {
        setMessage('Privacy settings updated successfully!');
        setShowPrivacyModal(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to update privacy settings');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#EFF6FF',
      padding: '20px',
      fontFamily: 'Calibri, sans-serif'
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#03045E',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    title: {
      fontSize: '32px',
      color: '#1F2937',
      margin: '0',
      fontWeight: 'bold'
    },
    section: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: '#03045E',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      fontWeight: 'bold',
      cursor: 'pointer',
      position: 'relative',
      flexShrink: 0
    },
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      opacity: 0,
      transition: 'opacity 0.3s'
    },
    userName: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      margin: '0 0 8px 0'
    },
    userReg: {
      fontSize: '18px',
      color: '#6B7280',
      margin: '0 0 8px 0'
    },
    userDept: {
      fontSize: '16px',
      color: '#6B7280',
      margin: '0 0 12px 0'
    },
    memberSince: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '0'
    },
    fieldGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#EF4444'
    },
    inputReadonly: {
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
      cursor: 'not-allowed'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    error: {
      color: '#EF4444',
      fontSize: '14px',
      marginTop: '5px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    primaryButton: {
      background: '#03045E',
      color: 'white'
    },
    secondaryButton: {
      background: 'transparent',
      color: '#374151',
      border: '2px solid #D1D5DB'
    },
    editButton: {
      background: 'transparent',
      color: '#03045E',
      border: '1px solid #03045E',
      padding: '8px 16px',
      fontSize: '14px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    statCard: {
      background: '#F9FAFB',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '10px'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1F2937',
      margin: '0 0 5px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '0'
    },
    contributionCard: {
      background: 'linear-gradient(135deg, #03045E, #001D3D)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center'
    },
    notificationGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px'
    },
    checkboxGroup: {
      marginBottom: '15px'
    },
    checkbox: {
      marginRight: '10px'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '15px 20px',
      background: '#F9FAFB',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '10px',
      transition: 'all 0.2s'
    },
    deleteButton: {
      color: '#EF4444',
      borderColor: '#EF4444'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center'
    },
    message: {
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '600'
    },
    successMessage: {
      background: '#D1FAE5',
      color: '#065F46',
      border: '1px solid #10B981'
    },
    errorMessage: {
      background: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #EF4444'
    }
  };

  if (loading || !profileData) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const badge = getContributionBadge(profileData.statistics.contribution_score);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/lost-item', label: 'Report Lost Item' },
    { path: '/found-item', label: 'Report Found Item' },
    { path: '/my-items', label: 'My Items' },
    { path: '/matches', label: 'Matches' },
    { path: '/notifications', label: 'Notifications' }
  ];

  const MobileMenu = () => (
    <>
      {isMobile && isMobileMenuOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: 280,
              height: '100vh',
              background: '#D1E7F5',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1002,
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Logo Section */}
            <div style={{padding: '20px'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '40px'}}>
                <img style={{width: 80, height: 80, objectFit: 'contain', marginRight: 15}} src="/image/logo2_1.png" alt="Logo" />
                <h1 style={{color: '#03045E', fontSize: 28, fontWeight: '700', margin: 0, fontFamily: 'Roboto Slab, serif'}}>Back2U</h1>
              </div>
            </div>

            {/* Main Navigation */}
            <nav style={{flex: 1, padding: '20px 15px'}}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      padding: '16px 20px',
                      margin: '8px 0',
                      borderRadius: 12,
                      background: isActive ? 'white' : 'transparent',
                      color: isActive ? '#03045E' : '#1e40af',
                      fontSize: 15,
                      fontWeight: isActive ? '700' : '600',
                      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div style={{marginTop: 'auto', padding: '0 20px 20px'}}>
              <Link
                to="/profile"
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '12px 20px',
                  margin: '4px 0',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)',
                  color: '#1e40af',
                  fontSize: 14,
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              
              <div 
                style={{
                  padding: '12px 20px',
                  margin: '8px 0 0 0',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#dc2626',
                  fontSize: 14,
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                  navigate('/login');
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <div style={{minHeight: '100vh', background: '#F8FAFC', padding: 20, paddingTop: isMobile ? 80 : 20, fontFamily: 'Roboto, sans-serif'}}>
      {/* Mobile Menu Button */}
      <MobileMenuButton 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isOpen={isMobileMenuOpen}
      />
      
      {/* Mobile Menu */}
      <MobileMenu />
      
      <div style={{maxWidth: 1000, margin: '0 auto'}}>
        <div style={{marginBottom: 30}}>
          <h1 style={{fontSize: 32, fontWeight: '700', margin: 0, fontFamily: 'Roboto Slab, serif', color: '#1F2937'}}>My Profile</h1>
          <p style={{fontSize: 16, color: '#6B7280', margin: '8px 0 0 0'}}>Manage your account settings and view your activity</p>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('success') ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        {/* Two Column Layout */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30}}>
          
          {/* LEFT PANEL: Profile Information */}
          <div>
            {/* Profile Header */}
            <div style={{background: 'white', borderRadius: 16, padding: 30, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20}}>
                <div style={{...styles.avatar, background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'}}>
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{fontSize: 24, fontWeight: 'bold', margin: '0 0 4px 0', fontFamily: 'Roboto Slab, serif'}}>{profileData.name}</h2>
                  <p style={{fontSize: 16, color: '#6B7280', margin: '0 0 4px 0'}}>{profileData.registration_number}</p>
                  <p style={{fontSize: 14, color: '#6B7280', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 6}}>
                    🏢 {profileData.department}
                  </p>
                  <p style={{fontSize: 12, color: '#6B7280', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 6}}>
                    📅 Member since: {new Date(profileData.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <div style={{background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: 4, animation: 'pulse 2s infinite'}}>
                    ✅ Active Member
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div style={{background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <h3 style={{fontSize: 18, fontWeight: '600', margin: 0, color: '#1F2937'}}>Personal Information</h3>
                {!editMode && (
                  <button 
                    style={{background: '#3B82F6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: '500', cursor: 'pointer'}}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6}}>👤 Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {}),
                ...(editMode ? {} : styles.inputReadonly)
              }}
              readOnly={!editMode}
            />
            {errors.name && <div style={styles.error}>{errors.name}</div>}
          </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6}}>🆔 Registration Number</label>
            <input
              type="text"
              value={profileData.registration_number}
              style={{...styles.input, ...styles.inputReadonly}}
              readOnly
            />
            <div style={{fontSize: '12px', color: '#6B7280', marginTop: '5px'}}>
              Cannot be changed
            </div>
          </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6}}>✉️ Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
                ...(editMode ? {} : styles.inputReadonly)
              }}
              readOnly={!editMode}
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6}}>📱 Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.contact_number ? styles.inputError : {}),
                ...(editMode ? {} : styles.inputReadonly)
              }}
              readOnly={!editMode}
            />
            {errors.contact_number && <div style={styles.error}>{errors.contact_number}</div>}
            <div style={{fontSize: '12px', color: '#6B7280', marginTop: '5px'}}>
              Used for notifications
            </div>
          </div>

              <div style={{marginBottom: 16}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6}}>🏢 Department</label>
            {editMode ? (
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                style={{
                  ...styles.select,
                  ...(errors.department ? styles.inputError : {})
                }}
              >
                <option value="">Select Department</option>
                <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                <option value="Faculty of Communication and Business Studies">Faculty of Communication and Business Studies</option>
                <option value="Faculty of Siddha Medicine">Faculty of Siddha Medicine</option>
                <option value="Faculty of Engineering">Faculty of Engineering</option>
                <option value="Faculty of Medicine">Faculty of Medicine</option>
                <option value="Faculty of Arts">Faculty of Arts</option>
                <option value="Faculty of Science">Faculty of Science</option>
                <option value="Faculty of Management">Faculty of Management</option>
                <option value="Faculty of Law">Faculty of Law</option>
                <option value="Faculty of Education">Faculty of Education</option>
                <option value="Faculty of Agriculture">Faculty of Agriculture</option>
                <option value="Faculty of Veterinary Medicine">Faculty of Veterinary Medicine</option>
                <option value="Faculty of Dental Sciences">Faculty of Dental Sciences</option>
                <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
                <option value="Faculty of Architecture">Faculty of Architecture</option>
                <option value="Faculty of Social Sciences">Faculty of Social Sciences</option>
                <option value="Faculty of Information Technology">Faculty of Information Technology</option>
                <option value="Faculty of Computing">Faculty of Computing</option>
                <option value="Faculty of Economics">Faculty of Economics</option>
                <option value="Faculty of Fine Arts">Faculty of Fine Arts</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.department}
                style={{...styles.input, ...styles.inputReadonly}}
                readOnly
              />
            )}
            {errors.department && <div style={styles.error}>{errors.department}</div>}
          </div>

              {editMode && (
                <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20}}>
                  <button 
                    style={{background: 'transparent', color: '#6B7280', border: '2px solid #D1D5DB', padding: '10px 20px', borderRadius: 8, fontSize: 14, cursor: 'pointer'}}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    style={{background: '#3B82F6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: '500', cursor: 'pointer'}}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* RIGHT PANEL: Activity & Stats */}
          <div>

            {/* Statistics Grid */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20}}>
              <div style={{background: 'white', padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
                <div style={{fontSize: 32, marginBottom: 8}}>📦</div>
                <div style={{fontSize: 24, fontWeight: 'bold', color: '#3B82F6', marginBottom: 4}}>{profileData.statistics.found_items_active}</div>
                <div style={{fontSize: 12, color: '#6B7280', fontWeight: '500'}}>Found Items</div>
                <div style={{background: '#3B82F6', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 10, marginTop: 4, display: 'inline-block'}}>Active</div>
              </div>
              
              <div style={{background: 'white', padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
                <div style={{fontSize: 32, marginBottom: 8}}>📢</div>
                <div style={{fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 4}}>{profileData.statistics.lost_items_searching}</div>
                <div style={{fontSize: 12, color: '#6B7280', fontWeight: '500'}}>Lost Items</div>
                <div style={{background: '#F59E0B', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 10, marginTop: 4, display: 'inline-block'}}>Searching</div>
              </div>
              
              <div style={{background: 'white', padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>✅</div>
                <div style={{fontSize: 24, fontWeight: 'bold', color: '#10B981', marginBottom: 4}}>{profileData.statistics.successful_returns}</div>
                <div style={{fontSize: 12, color: '#6B7280', fontWeight: '500'}}>Successful Returns</div>
                <div style={{background: '#10B981', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 10, marginTop: 4, display: 'inline-block'}}>All Time</div>
              </div>
              
              <div style={{background: 'white', padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>🎯</div>
                <div style={{fontSize: 24, fontWeight: 'bold', color: '#8B5CF6', marginBottom: 4}}>{profileData.statistics.total_matches}</div>
                <div style={{fontSize: 12, color: '#6B7280', fontWeight: '500'}}>Total Matches</div>
                <div style={{background: '#8B5CF6', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 10, marginTop: 4, display: 'inline-block'}}>All Time</div>
              </div>
            </div>

            {/* Contribution Score Card */}
            <div style={{background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', padding: 24, borderRadius: 16, textAlign: 'center', marginBottom: 20}}>
              <div style={{fontSize: 20, fontWeight: 'bold', marginBottom: 12}}>
                {badge.emoji} Contribution Score: {profileData.statistics.contribution_score}%
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 8, marginBottom: 12}}>
                <div style={{background: '#10B981', height: '100%', borderRadius: 10, width: `${profileData.statistics.contribution_score}%`}}></div>
              </div>
              <div style={{fontSize: 16}}>You're a {badge.text.toLowerCase()}!</div>
              <div style={{fontSize: 12, opacity: 0.8, marginTop: 4}}>🆕👍⭐🌟</div>
            </div>

            {/* Account Actions */}
            <div style={{background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 18, fontWeight: '600', margin: '0 0 16px 0', color: '#1F2937'}}>Account Actions</h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <button 
                  style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#374151'}}
                  onClick={() => setShowPrivacyModal(true)}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  🔒 Privacy Settings
                </button>
                
                <button style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#374151'}}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  📖 Terms & Conditions
                </button>
                
                <button style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#374151'}}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  ❓ Help & Support
                </button>
                
                <button style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#374151'}}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  📥 Download My Data
                </button>
                
                <button 
                  style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#374151'}}
                  onClick={() => setShowLogoutModal(true)}
                  onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  🚪 Logout
                </button>
                
                <hr style={{margin: '12px 0', border: 'none', borderTop: '1px solid #E5E7EB'}} />
                
                <button 
                  style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s', color: '#EF4444'}}
                  onClick={() => setShowDeleteModal(true)}
                  onMouseEnter={(e) => e.target.style.background = '#FEF2F2'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  ⚠️ Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Logout</h3>
              <p>Are you sure you want to logout?</p>
              <p style={{color: '#6B7280', fontSize: '14px'}}>
                You'll need to login again to access your account.
              </p>
              <div style={styles.buttonGroup}>
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.button, ...styles.primaryButton}}
                  onClick={() => {
                    setShowLogoutModal(false);
                    onLogout();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings Modal */}
        {showPrivacyModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Privacy Settings</h3>
              <div style={{textAlign: 'left', margin: '20px 0'}}>
                <div style={styles.fieldGroup}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="checkbox"
                      checked={privacySettings.match_found || false}
                      onChange={(e) => handlePrivacyChange('match_found', e.target.checked)}
                    />
                    📧 Email notifications for matches
                  </label>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="checkbox"
                      checked={privacySettings.sms_enabled || false}
                      onChange={(e) => handlePrivacyChange('sms_enabled', e.target.checked)}
                    />
                    📱 SMS notifications
                  </label>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="checkbox"
                      checked={privacySettings.verification_ready || false}
                      onChange={(e) => handlePrivacyChange('verification_ready', e.target.checked)}
                    />
                    ✅ Verification notifications
                  </label>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="checkbox"
                      checked={privacySettings.quiet_hours_enabled || false}
                      onChange={(e) => handlePrivacyChange('quiet_hours_enabled', e.target.checked)}
                    />
                    🌙 Enable quiet hours (10 PM - 8 AM)
                  </label>
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={() => setShowPrivacyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.button, ...styles.primaryButton}}
                  onClick={savePrivacySettings}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{color: '#EF4444'}}>⚠️ Delete Account</h3>
              <p>Are you sure you want to delete your account?</p>
              <div style={{textAlign: 'left', margin: '20px 0'}}>
                <p>This will permanently delete:</p>
                <ul>
                  <li>All your found items</li>
                  <li>All your lost items</li>
                  <li>Your match history</li>
                  <li>Your profile information</li>
                </ul>
              </div>
              <p style={{color: '#EF4444', fontWeight: 'bold'}}>
                ⚠️ This action CANNOT be undone!
              </p>
              <div style={styles.buttonGroup}>
                <button 
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{...styles.button, background: '#EF4444', color: 'white'}}
                  onClick={() => {
                    // Handle account deletion
                    setShowDeleteModal(false);
                    alert('Account deletion would be implemented here');
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;