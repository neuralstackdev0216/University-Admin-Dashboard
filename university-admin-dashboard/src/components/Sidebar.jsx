import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode"; // Ensure you have installed this
import avatarImg from '../assets/admin-avatar.jpg';

const SidebarItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
        isActive ? 'bg-sidebarActive text-primary' : 'text-textGray hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Default values
  let adminName = "Admin";
  let adminEmail = "admin@gmail.com";

  // Decode token to get real-time info
  if (token) {
    try {
      const decoded = jwtDecode(token);
      adminName = decoded.userName || "Admin";
      adminEmail = decoded.email || "";
    } catch (e) {
      console.error("Token error", e);
    }
  }

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-50">
      {/* UPDATED: Profile Header area redirects to /profile */}
      <Link to="/profile" className="p-6 flex items-center gap-4 mb-6 hover:bg-gray-50 transition-all cursor-pointer">
        <img
          src={avatarImg} // Later replace with adminData.img from DB if needed
          alt="Admin"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-primary"
          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin"; }}
        />
        <div className="overflow-hidden">
          <h3 className="font-bold text-textDark truncate">{adminName}</h3>
          <p className="text-[10px] text-textGray truncate">{adminEmail}</p>
        </div>
      </Link>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem
          to="/users"
          icon={FiUsers}
          label="Manage Users"
          isActive={location.pathname === '/users'}
        />
        <SidebarItem
          to="/vacancies"
          icon={FiBriefcase}
          label="Manage Job Vacancies"
          isActive={location.pathname === '/vacancies'}
        />
      </nav>
    </div>
  );
};

export default Sidebar;