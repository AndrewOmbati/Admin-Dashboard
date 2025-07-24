import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { DashboardStats, Activity } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const realTimeCounterRef = useRef<NodeJS.Timeout | null>(null);

  const stats: DashboardStats = {
    totalEvents: 142,
    activeClubs: 36,
    registeredUsers: 2847,
    rsvpsSent: 1924
  };

  const recentActivities: Activity[] = [
    {
      id: 1,
      icon: 'fas fa-calendar-plus',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      title: 'New event created',
      detail: '"Tech Conference 2024" by Computer Science Club',
      time: '2 hours ago',
      action: 'View',
      type: 'event'
    },
    {
      id: 2,
      icon: 'fas fa-user-plus',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'New club approved',
      detail: '"Photography Society" by Jane Smith',
      time: '5 hours ago',
      action: 'View',
      type: 'club'
    },
    {
      id: 3,
      icon: 'fas fa-comment-dots',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'New chat message flagged',
      detail: 'In "Debate Club" chat room',
      time: 'Yesterday',
      action: 'Review',
      type: 'system'
    },
    {
      id: 4,
      icon: 'fas fa-exclamation-triangle',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Event capacity reached',
      detail: '"Annual Science Fair" is now full',
      time: '2 days ago',
      action: 'Manage',
      type: 'event'
    }
  ];

  const upcomingEvents = [
    {
      name: 'Annual Science Fair',
      venue: 'Main Auditorium',
      date: 'May 15, 2024',
      time: '10:00 AM - 4:00 PM',
      club: 'Science Club',
      rsvps: 247,
      capacity: 300,
      status: 'Active'
    },
    {
      name: 'Music Festival',
      venue: 'Quadrangle',
      date: 'May 17, 2024',
      time: '6:00 PM - 10:00 PM',
      club: 'Music Club',
      rsvps: 189,
      capacity: 500,
      status: 'Active'
    },
    {
      name: 'Debate Competition',
      venue: 'Lecture Hall B',
      date: 'May 18, 2024',
      time: '3:00 PM - 6:00 PM',
      club: 'Debate Club',
      rsvps: 56,
      capacity: 100,
      status: 'Pending'
    },
    {
      name: 'Art Exhibition',
      venue: 'Gallery Hall',
      date: 'May 20, 2024',
      time: '2:00 PM - 8:00 PM',
      club: 'Art Club',
      rsvps: 78,
      capacity: 150,
      status: 'Active'
    }
  ];

  // Chart data
  const barChartData = {
    labels: ['Events', 'Clubs', 'Users', 'RSVPs'],
    datasets: [
      {
        label: 'Current Statistics',
        data: [stats.totalEvents, stats.activeClubs, stats.registeredUsers / 20, stats.rsvpsSent / 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const doughnutChartData = {
    labels: ['Academic', 'Cultural', 'Technical', 'Sports', 'Social'],
    datasets: [
      {
        data: [12, 8, 6, 5, 5],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 0
      }
    ]
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Events Created',
        data: [12, 19, 15, 25, 22, 18],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'User Registrations',
        data: [8, 15, 12, 18, 16, 14],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProgressPercentage = (rsvps: number, capacity: number) => {
    return Math.round((rsvps / capacity) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  useEffect(() => {
    // Start real-time counter animations
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current).toLocaleString();
          }
        }, 20);
      });
    };

    animateCounters();

    return () => {
      if (realTimeCounterRef.current) {
        clearInterval(realTimeCounterRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Events', value: stats.totalEvents, icon: 'fa-calendar-alt', color: 'indigo', change: '+12%' },
          { title: 'Active Clubs', value: stats.activeClubs, icon: 'fa-users', color: 'green', change: '+8%' },
          { title: 'Registered Users', value: stats.registeredUsers, icon: 'fa-user-friends', color: 'purple', change: '+15%' },
          { title: 'RSVPs Sent', value: stats.rsvpsSent, icon: 'fa-envelope', color: 'red', change: '+5%' }
        ].map((stat, index) => (
          <div key={index} className="card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold text-${stat.color}-600 counter`} data-target={stat.value}>
                  0
                </p>
                <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <i className={`fas ${stat.icon} text-2xl text-${stat.color}-600`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Club Categories</h3>
          <div className="h-64">
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Activity and Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${activity.iconBg}`}>
                  <i className={`${activity.icon} ${activity.iconColor}`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  {activity.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <span className={getStatusBadge(event.status)}>{event.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {event.venue}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-calendar mr-1"></i>
                  {event.date} • {event.time}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <i className="fas fa-users mr-1"></i>
                  {event.club}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">RSVPs</span>
                      <span className="font-medium">{event.rsvps}/{event.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(getProgressPercentage(event.rsvps, event.capacity))}`}
                        style={{ width: `${getProgressPercentage(event.rsvps, event.capacity)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getProgressPercentage(event.rsvps, event.capacity)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;