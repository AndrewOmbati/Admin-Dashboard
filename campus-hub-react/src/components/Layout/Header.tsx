import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { 
    state, 
    toggleSidebar, 
    toggleMobileMenu, 
    markNotificationRead, 
    clearNotifications 
  } = useApp();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadNotifications = state.notifications.filter(n => !n.read);

  const handleNotificationClick = (notificationId: number) => {
    markNotificationRead(notificationId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search logic here
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic
  };

  return (
    <header className="card m-4 rounded-2xl shadow-lg">
      <div className="py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-indigo-600 focus:outline-none lg:hidden transition-colors"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-indigo-600 hidden lg:block transition-colors"
          >
            <i className={`fas ${state.sidebarCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'} text-xl`}></i>
          </button>
          
          {/* Page Title */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, clubs, users..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-64"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </form>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <i className="fas fa-bell text-xl"></i>
              {unreadNotifications.length > 0 && (
                <span className="notification-dot absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            <div 
              className={`absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 transition-all duration-300 ${
                showNotifications ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {state.notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {state.notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <i className="fas fa-bell-slash text-2xl mb-2"></i>
                    <p>No notifications</p>
                  </div>
                ) : (
                  state.notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                        notification.read 
                          ? 'border-transparent opacity-60' 
                          : notification.priority === 'high' 
                            ? 'border-red-500' 
                            : notification.priority === 'medium'
                              ? 'border-yellow-500'
                              : 'border-blue-500'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full text-xs ${
                          notification.type === 'event' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'club' ? 'bg-green-100 text-green-600' :
                          notification.type === 'user' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'chat' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <i className={`fas ${
                            notification.type === 'event' ? 'fa-calendar' :
                            notification.type === 'club' ? 'fa-users' :
                            notification.type === 'user' ? 'fa-user' :
                            notification.type === 'chat' ? 'fa-comments' :
                            'fa-bell'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img 
                src={state.currentUser.avatar} 
                alt="Profile" 
                className="h-8 w-8 rounded-full ring-2 ring-indigo-500"
              />
              <span className="font-medium hidden md:block">{state.currentUser.name}</span>
              <i className="fas fa-chevron-down text-sm text-gray-500"></i>
            </button>
            
            {/* Profile Dropdown */}
            <div 
              className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 transition-all duration-300 ${
                showProfile ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-medium text-sm">{state.currentUser.name}</p>
                <p className="text-xs text-gray-500">{state.currentUser.email}</p>
              </div>
              <button 
                onClick={() => setShowProfile(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-user mr-2"></i>Profile
              </button>
              <button 
                onClick={() => setShowProfile(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-cog mr-2"></i>Settings
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;