import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import avatarImg from '../assets/admin-avatar.jpg';

const SidebarItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
        isActive
          ? 'bg-sidebarActive text-primary'
          : 'text-textGray hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col">
      {/* Profile Header - Clicking this leads to Profile page for Logout */}
      <div className="p-6 flex items-center gap-4 mb-6">
        <Link to="/profile">
          <img
            src={avatarImg}
            alt="Admin"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-primary cursor-pointer transition-all"
            onError={(e) => {
              
              e.target.src = "https://ui-avatars.com/api/?name=Admin";
            }}
          />
        </Link>
        <div>
          <h3 className="font-bold text-textDark">Dilshan0216</h3>
          <p className="text-sm text-textGray">vadiveldilshan@gmail.com</p>
        </div>
      </div>

      {/* Navigation Links */}
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

      {/* Settings and Bottom Logout have been removed from here */}
    </div>
  );
};

export default Sidebar;