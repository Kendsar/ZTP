import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Zap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">Z-Training</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span className="ml-2">Profile</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/login"
                  className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="ml-2">Sign In</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}