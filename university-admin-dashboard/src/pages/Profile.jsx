import React, { useState, useRef } from 'react';
import { FiCamera, FiSave, FiLogOut, FiUser, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import initialAvatar from '../assets/admin-avatar.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  
  const [adminData, setAdminData] = useState({
    name: 'Dilshan0216',
    email: 'vadiveldilshan@gmail.com',
    profilePic: initialAvatar
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    alert("Profile Updated Successfully!");
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        
        alert("Logging out...");
        navigate('/'); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-textDark mb-8">Admin Profile Settings</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave}>
          {/* Header/Avatar Section */}
          <div className="bg-primary/5 p-8 flex flex-col items-center border-b border-gray-100">
            <div className="relative group">
              <img
                src={adminData.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                onError={(e) => {e.target.src = 'https://ui-avatars.com/api/?name=Admin'}}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all"
              >
                <FiCamera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="mt-4 text-sm text-textGray font-medium">Click the camera icon to change photo</p>
          </div>

          {/* Form Fields Section */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-textGray mb-2 flex items-center gap-2">
                  <FiUser size={16}/> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textGray mb-2 flex items-center gap-2">
                  <FiMail size={16}/> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
              >
                <FiSave size={20} /> Save Changes
              </button>
              
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 border border-red-200 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <FiLogOut size={20} className="rotate-180" /> Logout
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;