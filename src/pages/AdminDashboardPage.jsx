import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-[#0B181C] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B181C] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-[#00BFA5] mb-8">ADMIN DASHBOARD</h1>

        <div className="space-y-4">
          <Link to="/admin/buildings" className="block w-full bg-[#00BFA5] text-black font-bold py-4 rounded-lg text-lg hover:bg-teal-400 transition-colors">
            MANAGE BUILDINGS
          </Link>
          <Link to="/admin/floors-risers" className="block w-full bg-[#00BFA5] text-black font-bold py-4 rounded-lg text-lg hover:bg-teal-400 transition-colors">
            MANAGE FLOORS & RISERS
          </Link>
          <Link to="/admin/images" className="block w-full bg-[#00BFA5] text-black font-bold py-4 rounded-lg text-lg hover:bg-teal-400 transition-colors">
            MANAGE IMAGES
          </Link>
          <Link to="/admin/pdfs" className="block w-full bg-[#00BFA5] text-black font-bold py-4 rounded-lg text-lg hover:bg-teal-400 transition-colors">
            MANAGE TECHNOLOGY PDFs
          </Link>
          <Link to="/admin/users" className="block w-full bg-[#00BFA5] text-black font-bold py-4 rounded-lg text-lg hover:bg-teal-400 transition-colors">
            MANAGE USERS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;