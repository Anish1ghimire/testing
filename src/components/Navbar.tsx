import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-orbitron font-bold text-xl">
              REPLIX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors duration-300 ${
                isActive('/') ? 'text-neon-blue' : 'text-white hover:text-neon-blue'
              }`}
            >
              Home
            </Link>
            <Link
              to="/games"
              className={`transition-colors duration-300 ${
                isActive('/games') ? 'text-neon-blue' : 'text-white hover:text-neon-blue'
              }`}
            >
              Games
            </Link>
            <Link
              to="/register"
              className={`transition-colors duration-300 ${
                isActive('/register') ? 'text-neon-blue' : 'text-white hover:text-neon-blue'
              }`}
            >
              Register
            </Link>
            <Link
              to="/contact"
              className={`transition-colors duration-300 ${
                isActive('/contact') ? 'text-neon-blue' : 'text-white hover:text-neon-blue'
              }`}
            >
              Contact
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-neon-purple hover:text-white transition-colors duration-300"
              >
                <Shield size={16} />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/admin/login" className="btn-neon text-sm px-4 py-2">
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neon-blue/20 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-white hover:text-neon-blue transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/games"
                className="text-white hover:text-neon-blue transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-neon-blue transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-neon-blue transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-neon-purple hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300 text-left"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link 
                  to="/admin/login" 
                  className="btn-neon text-sm px-4 py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;