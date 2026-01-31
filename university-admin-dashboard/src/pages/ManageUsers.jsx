import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import Pagination from '../components/Pagination';
import UserEditModal from '../components/UserEditModal';

const getRoleBadgeStyle = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return 'bg-blue-100 text-blue-700 font-bold';
    case 'moderator': return 'bg-purple-100 text-purple-700 font-bold';
    case 'user': return 'bg-green-100 text-green-700 font-bold';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const itemsPerPage = 4;

  
  const fetchUsers = async (isInitialLoad = false) => {
  try {
    
    if (isInitialLoad) {
      setLoading(true);
    }
    
    const token = localStorage.getItem('token'); 
    const response = await axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setUsers(response.data.list); 
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Session expired or Unauthorized. Please login again.");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchUsers(true);
}, []);

  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.userName || "";
      const email = user.email || "";
      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'All Roles' || user.role === filterRole.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  
  const handleSaveRole = async (userName, newRole) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/users/${userName}`, 
      { role: newRole }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    
    await fetchUsers(false); 
    setIsEditModalOpen(false);
  } catch (error) {
    alert("Failed to update user role.");
  }
};

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="text-center p-20 font-bold">Loading Data from Database...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-textDark">Manage Users</h1>
        {/* Add New User button removed as per your request */}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textGray" size={20} />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full bg-gray-100 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['All Roles', 'Admin','Moderator','User'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filterRole === role ? 'bg-primary text-white shadow-sm' : 'text-textGray'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold text-textGray uppercase">User Name</th>
              <th className="p-6 text-xs font-bold text-textGray uppercase">Email</th>
              <th className="p-6 text-xs font-bold text-textGray uppercase">Role</th>
              <th className="p-6 text-xs font-bold text-textGray uppercase">Date Registered</th>
              <th className="p-6 text-xs font-bold text-textGray uppercase text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-bold text-textDark">{user.userName}</td>
                <td className="p-6 text-textGray font-medium">{user.email}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs uppercase ${getRoleBadgeStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-textGray font-medium">
                  {new Date(user.date).toLocaleDateString()}
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => handleEditClick(user)}
                    className="text-textGray hover:text-primary transition-colors p-2 bg-gray-50 rounded-lg"
                  >
                    <FiEdit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-0 right-0 left-64 bg-gray-50 p-6 border-t border-gray-200">
        <Pagination 
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          showingStart={filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1}
          showingEnd={Math.min(indexOfLastItem, filteredUsers.length)}
        />
      </div>

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