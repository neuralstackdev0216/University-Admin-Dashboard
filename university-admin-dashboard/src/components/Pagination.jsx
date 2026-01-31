import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, showingStart, showingEnd }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 text-textGray text-sm">
      <div>
        <span className='text-sm text-gray-500 font-medium'>
          Showing <span className='text-gray-900 font-bold'>{showingStart}</span> to <span className='text-gray-900 font-bold'>{showingEnd}</span> of <span className='text-gray-900 font-bold'>{totalItems}</span> users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <FiChevronLeft size={18} />
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-8 h-8 flex items-center justify-center rounded-md font-medium ${
              currentPage === number
                ? 'bg-primary text-white'
                : 'border bg-white hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;