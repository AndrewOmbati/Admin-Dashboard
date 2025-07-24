// User types
export interface User {
  id: number;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Moderator' | 'Faculty' | 'Student';
  avatar: string;
  email: string;
  lastLogin: string;
  status?: 'active' | 'inactive' | 'suspended';
  department?: string;
  joinDate?: string;
}

// Event types
export interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  endTime: string;
  capacity: number;
  registrations: number;
  club: string;
  clubId: number;
  status: 'active' | 'pending' | 'cancelled' | 'completed';
  category: 'Academic' | 'Cultural' | 'Technical' | 'Sports' | 'Social';
  image: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

// Club types
export interface Club {
  id: number;
  name: string;
  description: string;
  category: 'Academic' | 'Cultural' | 'Technical' | 'Sports' | 'Social';
  president: string;
  advisor: string;
  email: string;
  founded: string;
  members: number;
  maxMembers: number;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  image: string;
  activities: string[];
  meetingSchedule: string;
  location: string;
  budget: number;
  expenses: number;
  events: number;
  rating: number;
}

// Notification types
export interface Notification {
  id: number;
  type: 'event' | 'club' | 'user' | 'system' | 'chat';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// Activity types
export interface Activity {
  id: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  detail: string;
  time: string;
  action: string;
  type: 'event' | 'club' | 'user' | 'system';
}

// Settings types
export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  itemsPerPage: number;
  sidebarCollapsed: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalEvents: number;
  activeClubs: number;
  registeredUsers: number;
  rsvpsSent: number;
}

// Application state
export interface AppState {
  currentUser: User;
  currentPage: string;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  settings: Settings;
}

// Page information
export interface PageInfo {
  title: string;
  subtitle: string;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Toast types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Table column types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

// Filter types
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// Pagination types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'time' | 'number' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Chat types
export interface ChatMessage {
  id: number;
  clubId: number;
  clubName: string;
  sender: string;
  senderId: number;
  message: string;
  timestamp: string;
  flagged?: boolean;
  type: 'text' | 'image' | 'file';
  reported?: boolean;
  moderatorAction?: 'none' | 'warning' | 'muted' | 'banned';
}

// RSVP types
export interface RSVP {
  id: number;
  eventId: number;
  eventName: string;
  userId: number;
  userName: string;
  userEmail: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  timestamp: string;
  emailSent: boolean;
  reminderSent: boolean;
}

// Email log types
export interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  type: 'event_invitation' | 'reminder' | 'announcement' | 'club_notification' | 'system';
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}