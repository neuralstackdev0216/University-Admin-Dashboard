import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiEyeOff, FiEye } from 'react-icons/fi';
import { MOCK_VACANCIES } from '../data/mockData';

const ManageVacancies = () => {
  const [vacancies, setVacancies] = useState(MOCK_VACANCIES);

  const toggleStatus = (id) => {
      setVacancies(vacancies.map(v => 
          v.id === id ? {...v, status: v.status === 'Active' ? 'Hidden' : 'Active'} : v
      ))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-textDark">Manage Job Vacancies</h1>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
          <FiPlus size={20} /> Add New Vacancy
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Simple list view for vacancies placeholder */}
          <ul className="divide-y divide-gray-100">
              {vacancies.map(vacancy => (
                  <li key={vacancy.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                      <div>
                          <h3 className="font-bold text-lg">{vacancy.title}</h3>
                          <p className="text-textGray">{vacancy.company}</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${vacancy.status === 'Active' ? 'bg-green-100 text-green-700': 'bg-gray-200 text-gray-600'}`}>{vacancy.status}</span>
                          
                          <button className="p-2 text-textGray hover:text-primary border rounded bg-white" title="Edit Vacancy Form">
                              <FiEdit2 />
                          </button>
                           <button onClick={() => toggleStatus(vacancy.id)} className="p-2 text-textGray hover:text-primary border rounded bg-white" title={vacancy.status === 'Active' ? "Hide Vacancy" : "Show Vacancy"}>
                              {vacancy.status === 'Active' ? <FiEyeOff /> : <FiEye />}
                          </button>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
    </div>
  );
};

export default ManageVacancies;