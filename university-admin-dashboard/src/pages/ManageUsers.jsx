import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiPlus } from 'react-icons/fi';
import { MOCK_USERS } from '../data/mockData';
import Pagination from '../components/Pagination';
import UserEditModal from '../components/UserEditModal';

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case 'Admin': return 'bg-roleAdminBg text-roleAdminText';
    case 'Employer': return 'bg-roleEmployerBg text-roleEmployerText';
    case 'Student': return 'bg-roleStudentBg text-roleStudentText';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ManageUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const itemsPerPage = 4;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All Roles' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveRole = (userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? {...u, role: newRole} : u)
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-textDark">Manage Users</h1>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
          <FiPlus size={20} /> Add New User
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textGray size={20}" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-gray-100 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-gray-100 p-1 rounded-xl overflow-hidden">
              {['All Roles', 'Admin', 'Employer', 'Student'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filterRole === role
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-textGray hover:bg-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase w-12">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              </th>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase">User Name</th>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase">Email</th>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase">Role</th>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase">Date Registered</th>
              <th className="p-6 text-xs font-bold tracking-wider text-textGray uppercase text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></td>
                    <td className="p-6 font-bold text-textDark">{user.name}</td>
                    <td className="p-6 text-textGray font-medium">{user.email}</td>
                    <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="p-6 text-textGray font-medium">{user.date}</td>
                    <td className="p-6 text-center">
                        <button 
                            onClick={() => handleEditClick(user)}
                            className="text-textGray hover:text-primary transition-colors p-2 bg-gray-50 rounded-lg" 
                            title="Edit User Role"
                        >
                            <FiEdit2 size={18} />
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6" className="p-8 text-center text-textGray">No users found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        showingStart={filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1}
        showingEnd={Math.min(indexOfLastItem, filteredUsers.length)}
      />

       <UserEditModal 
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         user={userToEdit}
         onSave={handleSaveRole}
       />
    </div>
  );
};

export default ManageUsers;