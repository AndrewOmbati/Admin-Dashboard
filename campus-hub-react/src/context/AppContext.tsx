import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, User, Notification, Settings, Toast } from '../types';

// Initial state
const initialState: AppState = {
  currentUser: {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Super Admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'sarah.johnson@campushub.edu',
    lastLogin: new Date().toISOString()
  },
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  notifications: [],
  settings: {
    theme: 'light',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30000,
    itemsPerPage: 10,
    sidebarCollapsed: false
  }
};

// Action types
type AppAction =
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, mobileMenuOpen: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications].slice(0, 50) 
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

// Context interface
interface AppContextType {
  state: AppState;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: number) => void;
  clearNotifications: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setUser: (user: User) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Toast context for managing toast notifications
interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// App provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem('campusHubState');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('campusHubState', JSON.stringify({
        currentPage: state.currentPage,
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings
      }));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state.currentPage, state.sidebarCollapsed, state.settings]);

  // Load initial notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: 1,
        type: 'event',
        title: 'New Event Pending Approval',
        message: 'Tech Conference 2024 by Computer Science Club',
        time: '2 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'club',
        title: 'Club Registration Submitted',
        message: 'Photography Society by Jane Smith',
        time: '5 hours ago',
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'chat',
        title: 'Chat Message Flagged',
        message: 'In Debate Club chat room',
        time: 'Yesterday',
        read: false,
        priority: 'medium'
      }
    ];

    initialNotifications.forEach(notification => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    });
  }, []);

  const setCurrentPage = (page: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const toggleMobileMenu = () => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const setMobileMenuOpen = (open: boolean) => {
    dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: open });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now() + Math.random();
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { ...notification, id } 
    });
  };

  const markNotificationRead = (id: number) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const updateSettings = (settings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const showToast = (toast: Omit<Toast, 'id'>) => {
    // This will be implemented by the ToastProvider
    console.log('Toast:', toast);
  };

  const contextValue: AppContextType = {
    state,
    setCurrentPage,
    toggleSidebar,
    toggleMobileMenu,
    setSidebarCollapsed,
    setMobileMenuOpen,
    addNotification,
    markNotificationRead,
    clearNotifications,
    updateSettings,
    setUser,
    showToast
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hooks
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default AppContext;