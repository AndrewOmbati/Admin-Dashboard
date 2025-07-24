import React from 'react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { state, setCurrentPage, toggleSidebar, setMobileMenuOpen } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      badge: null
    },
    {
      id: 'events',
      icon: 'fas fa-calendar-day',
      label: 'Manage Events',
      badge: '12'
    },
    {
      id: 'clubs',
      icon: 'fas fa-users',
      label: 'Manage Clubs',
      badge: null
    },
    {
      id: 'announcements',
      icon: 'fas fa-bullhorn',
      label: 'Announcements',
      badge: null
    },
    {
      id: 'users',
      icon: 'fas fa-user-cog',
      label: 'User Management',
      badge: null
    },
    {
      id: 'chat',
      icon: 'fas fa-comments',
      label: 'Club Chat Monitor',
      badge: null
    },
    {
      id: 'rsvp',
      icon: 'fas fa-envelope',
      label: 'RSVP & Email Logs',
      badge: null
    }
  ];

  const settingsItems = [
    {
      id: 'settings',
      icon: 'fas fa-cog',
      label: 'Settings'
    },
    {
      id: 'help',
      icon: 'fas fa-question-circle',
      label: 'Help & Support'
    }
  ];

  const handleMenuClick = (pageId: string) => {
    setCurrentPage(pageId);
    // Close mobile menu when item is clicked
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${state.mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Sidebar */}
      <nav 
        className={`sidebar w-64 shadow-2xl flex flex-col z-50 ${
          state.sidebarCollapsed ? 'sidebar-collapsed' : ''
        } ${
          state.mobileMenuOpen ? 'mobile-open' : ''
        } ${className}`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-gray-200/20">
          <div className="gradient-bg text-white p-3 rounded-xl shadow-lg">
            <i className="fas fa-calendar-alt text-xl"></i>
          </div>
          <div className="logo-text transition-all duration-300">
            <h2 className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CampusHub
            </h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={state.currentUser.avatar} 
                alt="Profile" 
                className="h-10 w-10 rounded-full ring-2 ring-indigo-500"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="nav-text transition-all duration-300">
              <p className="font-medium text-sm">{state.currentUser.name}</p>
              <p className="text-xs text-gray-500">{state.currentUser.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`nav-item flex items-center space-x-3 p-3 rounded-xl w-full text-left ${
                  state.currentPage === item.id ? 'active' : ''
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="nav-text transition-all duration-300">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Settings Section */}
          <div className="px-4 mt-8 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Settings
            </div>
            {settingsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`nav-item flex items-center space-x-3 p-3 rounded-xl w-full text-left ${
                  state.currentPage === item.id ? 'active' : ''
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="nav-text transition-all duration-300">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200/20">
          <button 
            onClick={handleLogout}
            className="nav-item flex items-center space-x-3 p-3 rounded-xl w-full text-left hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <i className="fas fa-sign-out-alt text-lg"></i>
            <span className="nav-text transition-all duration-300">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;