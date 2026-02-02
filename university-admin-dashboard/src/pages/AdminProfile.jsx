import React, { useState, useEffect } from 'react';
import { Camera, LogOut, Save, Mail, User, Calendar, Hash, UserCheck } from 'lucide-react';
import api from '../api/axios';
import { parseNIC } from '../utils/nicParser'; 
import { toast, Toaster } from 'react-hot-toast';

const AdminProfile = () => {
  // --- State ---
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    nic: '', 
    profileImage: 'https://avatar.iran.liara.run/public/boy?username=Admin', 
  });

  const [derivedDetails, setDerivedDetails] = useState({
    birthday: '',
    age: '-',
    gender: '-'
  });

  const [currentUserName, setCurrentUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- HELPER: Manual Token Decoder ---
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // --- 1. Fetch Admin Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const localUser = localStorage.getItem('username');
        
        let foundUserName = null;

        if (localUser) {
            foundUserName = localUser;
        } else if (token) {
            const decoded = parseJwt(token);
            foundUserName = decoded?.sub || decoded?.username || decoded?.user?.userName;
        }

        if (foundUserName) {
            setCurrentUserName(foundUserName);
            const response = await api.get(`/users/${foundUserName}`);
            
            // Matches your 'getUser' controller which returns res.json(user)
            const backendUser = response.data; 

            if (backendUser) {
                setProfileData({
                    username: backendUser.userName || '',
                    email: backendUser.email || '',
                    nic: backendUser.id || '', 
                    profileImage: backendUser.img || 'https://avatar.iran.liara.run/public/boy?username=Admin'
                });
            }
        } else {
            toast.error("Session expired. Please login again.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. Calculate Details from NIC ---
  useEffect(() => {
    if (profileData.nic) {
      const info = parseNIC(profileData.nic);
      if (info) setDerivedDetails(info);
      else setDerivedDetails({ birthday: '', age: '-', gender: '-' });
    }
  }, [profileData.nic]);

  // --- Handlers ---
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      if (!currentUserName) {
          toast.error("Error: User not identified.", { id: toastId });
          return;
      }

      // Payload matching your 'updateUser' controller expectation
      const payload = {
          userName: profileData.username,
          email: profileData.email,
          id: profileData.nic,          
          img: profileData.profileImage, 
          age: derivedDetails.age !== '-' ? derivedDetails.age : null,
          gender: derivedDetails.gender !== '-' ? derivedDetails.gender : null,
          birthday: derivedDetails.birthday || null
      };
      
      console.log("Sending Payload:", payload); // Keep this to verify data

      // Matches: userRouter.put("/:userName", updateUser)
      await api.put(`/users/${currentUserName}`, payload);
      
      toast.success("Profile updated successfully!", { id: toastId });

      // Update local storage if username changed
      if (profileData.username !== currentUserName) {
          localStorage.setItem('username', profileData.username); 
          setCurrentUserName(profileData.username);
      }

    } catch (error) {
      console.error("Save error:", error);
      
      // Specific handling for your 404 error
      if (error.response?.status === 404) {
          toast.error("Error: Backend route not found (404). Check server routes.", { id: toastId });
      } else if (error.response?.status === 403) {
          toast.error("Access Denied: You are not an Admin.", { id: toastId });
      } else {
          toast.error(error.response?.data?.message || "Update failed.", { id: toastId });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm("Logout?")) {
        localStorage.clear(); 
        window.location.href = '/login'; 
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full text-gray-500 font-bold">Loading Profile...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100 bg-white flex-none">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your account settings.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                    <div className="relative group">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-100">
                            <img 
                                src={profileData.profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=User&background=random"; }}
                            />
                        </div>
                        <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105 border-4 border-white">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="text-xl font-bold text-gray-900">{profileData.username || 'Admin'}</h2>
                        <span className="inline-block mt-1 px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">Administrator</span>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2"><UserCheck size={18} className="text-blue-600"/> Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="Username" icon={<User size={18}/>} name="username" value={profileData.username} onChange={handleChange} />
                            <InputGroup label="Email Address" icon={<Mail size={18}/>} name="email" value={profileData.email} onChange={handleChange} type="email"/>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2"><Hash size={18} className="text-blue-600"/> Identity Verification</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sri Lankan NIC Number</label>
                            <input type="text" name="nic" value={profileData.nic} onChange={handleChange} placeholder="Enter NIC" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-lg tracking-wide"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <InfoCard label="Birthday" value={derivedDetails.birthday || 'mm/dd/yyyy'} icon={<Calendar size={16} />} />
                            <InfoCard label="Age" value={derivedDetails.age} />
                            <InfoCard label="Gender" value={derivedDetails.gender} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 pb-4">
                        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95">
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, name, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
            <input type={type} name={name} value={value} onChange={onChange} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700"/>
        </div>
    </div>
);

const InfoCard = ({ label, value, icon }) => (
    <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">{icon} {label}</span>
        <span className="text-base font-bold text-gray-800">{value}</span>
    </div>
);

export default AdminProfile;