import React, { useEffect } from 'react';
import { AppProvider, ToastProvider, useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ToastContainer from './components/UI/Toast';
import Dashboard from './components/Pages/Dashboard';

// Page title and subtitle mapping
const pageInfo = {
  dashboard: { title: 'Dashboard Overview', subtitle: "Welcome back! Here's what's happening today." },
  events: { title: 'Manage Events', subtitle: 'Create, edit, and monitor all campus events.' },
  clubs: { title: 'Manage Clubs', subtitle: 'Oversee club registrations and activities.' },
  announcements: { title: 'Announcements', subtitle: 'Send important updates to the campus community.' },
  users: { title: 'User Management', subtitle: 'Manage user accounts and permissions.' },
  chat: { title: 'Club Chat Monitor', subtitle: 'Monitor and moderate club chat rooms.' },
  rsvp: { title: 'RSVP & Email Logs', subtitle: 'Track event responses and email communications.' },
  settings: { title: 'Settings', subtitle: 'Configure system preferences and options.' },
  help: { title: 'Help & Support', subtitle: 'Get assistance and find documentation.' }
};

// Placeholder components for other pages
const EventsPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-calendar-day text-4xl text-indigo-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Events Management</h2>
    <p className="text-gray-600">Event management functionality will be implemented here.</p>
  </div>
);

const ClubsPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-users text-4xl text-green-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Clubs Management</h2>
    <p className="text-gray-600">Club management functionality will be implemented here.</p>
  </div>
);

const AnnouncementsPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-bullhorn text-4xl text-purple-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Announcements</h2>
    <p className="text-gray-600">Announcements functionality will be implemented here.</p>
  </div>
);

const UsersPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-user-cog text-4xl text-blue-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">User Management</h2>
    <p className="text-gray-600">User management functionality will be implemented here.</p>
  </div>
);

const ChatPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-comments text-4xl text-orange-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Chat Monitor</h2>
    <p className="text-gray-600">Chat monitoring functionality will be implemented here.</p>
  </div>
);

const RSVPPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-envelope text-4xl text-red-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">RSVP & Email Logs</h2>
    <p className="text-gray-600">RSVP and email tracking functionality will be implemented here.</p>
  </div>
);

const SettingsPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-cog text-4xl text-gray-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Settings</h2>
    <p className="text-gray-600">Settings functionality will be implemented here.</p>
  </div>
);

const HelpPage: React.FC = () => (
  <div className="card p-8 rounded-2xl text-center">
    <i className="fas fa-question-circle text-4xl text-teal-600 mb-4"></i>
    <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
    <p className="text-gray-600">Help and support documentation will be available here.</p>
  </div>
);

// Main dashboard component
const DashboardApp: React.FC = () => {
  const { state } = useApp();

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventsPage />;
      case 'clubs':
        return <ClubsPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'users':
        return <UsersPage />;
      case 'chat':
        return <ChatPage />;
      case 'rsvp':
        return <RSVPPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <Dashboard />;
    }
  };

  const currentPageInfo = pageInfo[state.currentPage as keyof typeof pageInfo] || pageInfo.dashboard;

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className={`main-content flex-1 overflow-y-auto transition-all duration-300 ${
          state.sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
          {/* Header */}
          <Header 
            title={currentPageInfo.title}
            subtitle={currentPageInfo.subtitle}
          />
          
          {/* Page Content */}
          <main className="p-4">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Root App component
const App: React.FC = () => {
  useEffect(() => {
    // Show welcome toast after component mounts
    const timer = setTimeout(() => {
      console.log('Welcome to CampusHub Admin Dashboard!');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <AppProvider>
        <div className="App">
          <DashboardApp />
          <ToastContainer />
        </div>
      </AppProvider>
    </ToastProvider>
  );
};

export default App;
