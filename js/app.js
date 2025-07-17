// Application State Management
class AdminDashboard {
    constructor() {
        this.state = {
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
            notifications: [],
            settings: {
                theme: 'light',
                notifications: true,
                autoRefresh: true,
                refreshInterval: 30000
            }
        };

        this.pages = {
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

        this.init();
    }

    init() {
        this.loadStoredData();
        this.initializeElements();
        this.setupEventListeners();
        this.loadNotifications();
        this.navigateToPage(this.state.currentPage);
        this.showToast('Welcome back, ' + this.state.currentUser.name + '!', 'success');
        
        if (this.state.settings.autoRefresh) {
            this.startAutoRefresh();
        }
    }

    loadStoredData() {
        const stored = localStorage.getItem('adminDashboardState');
        if (stored) {
            const storedState = JSON.parse(stored);
            this.state = { ...this.state, ...storedState };
        }
    }

    saveState() {
        localStorage.setItem('adminDashboardState', JSON.stringify(this.state));
    }

    initializeElements() {
        this.elements = {
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            collapseSidebarBtn: document.getElementById('collapseSidebarBtn'),
            mobileOverlay: document.getElementById('mobileOverlay'),
            mainContent: document.querySelector('.main-content'),
            pageTitle: document.getElementById('pageTitle'),
            pageSubtitle: document.getElementById('pageSubtitle'),
            pageContent: document.getElementById('pageContent'),
            navItems: document.querySelectorAll('.nav-item'),
            logoutBtn: document.getElementById('logoutBtn'),
            logoutBtn2: document.getElementById('logoutBtn2'),
            notificationBtn: document.getElementById('notificationBtn'),
            notificationDropdown: document.getElementById('notificationDropdown'),
            notificationList: document.getElementById('notificationList'),
            notificationCount: document.getElementById('notificationCount'),
            profileBtn: document.getElementById('profileBtn'),
            profileDropdown: document.getElementById('profileDropdown'),
            searchInput: document.getElementById('searchInput'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            userName: document.getElementById('userName'),
            modalContainer: document.getElementById('modalContainer')
        };

        this.updateUserInfo();
    }

    setupEventListeners() {
        // Mobile sidebar toggle
        this.elements.sidebarToggle?.addEventListener('click', () => this.toggleMobileSidebar());
        this.elements.mobileOverlay?.addEventListener('click', () => this.closeMobileSidebar());

        // Desktop sidebar collapse
        this.elements.collapseSidebarBtn?.addEventListener('click', () => this.toggleSidebarCollapse());

        // Navigation items
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Logout buttons
        [this.elements.logoutBtn, this.elements.logoutBtn2].forEach(btn => {
            btn?.addEventListener('click', () => this.handleLogout());
        });

        // Notification dropdown
        this.elements.notificationBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(this.elements.notificationDropdown);
        });

        // Profile dropdown
        this.elements.profileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(this.elements.profileDropdown);
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => this.closeAllDropdowns());

        // Search functionality
        this.elements.searchInput?.addEventListener('input', (e) => this.handleSearch(e));

        // Responsive handling
        window.addEventListener('resize', () => this.handleResize());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    toggleMobileSidebar() {
        this.elements.sidebar.classList.toggle('open');
        this.elements.mobileOverlay.classList.toggle('active');
    }

    closeMobileSidebar() {
        this.elements.sidebar.classList.remove('open');
        this.elements.mobileOverlay.classList.remove('active');
    }

    toggleSidebarCollapse() {
        this.elements.sidebar.classList.toggle('sidebar-collapsed');
        this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
        
        const icon = this.elements.collapseSidebarBtn.querySelector('i');
        if (this.state.sidebarCollapsed) {
            icon.className = 'fas fa-angle-double-right text-xl';
            this.elements.mainContent.style.marginLeft = '5rem';
        } else {
            icon.className = 'fas fa-angle-double-left text-xl';
            this.elements.mainContent.style.marginLeft = '16rem';
        }
        
        this.saveState();
    }

    navigateToPage(page) {
        // Update active nav item
        this.elements.navItems.forEach(item => item.classList.remove('active'));
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Update page title and content
        const pageConfig = this.pages[page] || this.pages.dashboard;
        this.elements.pageTitle.textContent = pageConfig.title;
        this.elements.pageSubtitle.textContent = pageConfig.subtitle;
        
        // Load page content
        this.loadPageContent(page);
        
        this.state.currentPage = page;
        this.saveState();
        
        // Close mobile sidebar
        if (window.innerWidth <= 1024) {
            this.closeMobileSidebar();
        }
    }

    loadPageContent(page) {
        // Show loading state
        this.elements.pageContent.innerHTML = this.getLoadingHTML();
        
        // Simulate loading delay
        setTimeout(() => {
            switch (page) {
                case 'dashboard':
                    if (window.DashboardManager) {
                        window.DashboardManager.render(this.elements.pageContent);
                    }
                    break;
                case 'events':
                    if (window.EventsManager) {
                        window.EventsManager.render(this.elements.pageContent);
                    }
                    break;
                case 'clubs':
                    if (window.ClubsManager) {
                        window.ClubsManager.render(this.elements.pageContent);
                    }
                    break;
                case 'users':
                    if (window.UsersManager) {
                        window.UsersManager.render(this.elements.pageContent);
                    }
                    break;
                case 'announcements':
                    if (window.AnnouncementsManager) {
                        window.AnnouncementsManager.render(this.elements.pageContent);
                    }
                    break;
                case 'chat':
                    if (window.ChatManager) {
                        window.ChatManager.render(this.elements.pageContent);
                    }
                    break;
                case 'rsvp':
                    if (window.RSVPManager) {
                        window.RSVPManager.render(this.elements.pageContent);
                    }
                    break;
                case 'settings':
                    if (window.SettingsManager) {
                        window.SettingsManager.render(this.elements.pageContent);
                    }
                    break;
                default:
                    this.elements.pageContent.innerHTML = this.getDefaultPageHTML(page);
            }
        }, 300);
    }

    getLoadingHTML() {
        return `
            <div class="card rounded-2xl shadow-lg p-8 text-center fade-in">
                <div class="loading-spinner mx-auto mb-4"></div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Loading Page Content...</h3>
                <p class="text-gray-600">Please wait while we load the requested page.</p>
            </div>
        `;
    }

    getDefaultPageHTML(page) {
        const pageConfig = this.pages[page] || this.pages.dashboard;
        return `
            <div class="card rounded-2xl shadow-lg p-8 text-center fade-in">
                <div class="mb-6">
                    <i class="fas fa-cog text-6xl text-indigo-600 mb-4"></i>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${pageConfig.title}</h3>
                    <p class="text-gray-600">${pageConfig.subtitle}</p>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p class="text-yellow-800">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        This page is currently under development. Full functionality will be available soon.
                    </p>
                </div>
                <button onclick="app.navigateToPage('dashboard')" class="btn-primary">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Dashboard
                </button>
            </div>
        `;
    }

    handleLogout() {
        this.showToast('Logging out...', 'info');
        
        // Clear stored data
        localStorage.removeItem('adminDashboardState');
        
        setTimeout(() => {
            this.showToast('Logged out successfully!', 'success');
            // In a real app, redirect to login page
            // window.location.href = '/login';
        }, 1000);
    }

    toggleDropdown(dropdown) {
        if (!dropdown) return;
        
        const isVisible = dropdown.classList.contains('opacity-100');
        this.closeAllDropdowns();
        
        if (!isVisible) {
            dropdown.classList.remove('opacity-0', 'invisible');
            dropdown.classList.add('opacity-100', 'visible');
        }
    }

    closeAllDropdowns() {
        [this.elements.notificationDropdown, this.elements.profileDropdown].forEach(dropdown => {
            if (dropdown) {
                dropdown.classList.remove('opacity-100', 'visible');
                dropdown.classList.add('opacity-0', 'invisible');
            }
        });
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 2) {
            this.showToast(`Searching for: "${query}"`, 'info');
            // Implement search functionality based on current page
            this.performSearch(query);
        }
    }

    performSearch(query) {
        // Basic search implementation
        console.log('Searching for:', query);
        // In a real app, this would make API calls or filter current data
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            this.closeMobileSidebar();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl + / for search
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.elements.searchInput?.focus();
        }
        
        // Escape to close dropdowns/modals
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
            this.closeModal();
        }
    }

    updateUserInfo() {
        if (this.elements.userName) {
            this.elements.userName.textContent = this.state.currentUser.name;
        }
        
        document.querySelectorAll('img[alt="Profile"]').forEach(img => {
            img.src = this.state.currentUser.avatar;
        });
    }

    loadNotifications() {
        // Sample notifications
        this.state.notifications = [
            {
                id: 1,
                type: 'event',
                title: 'New event submitted',
                message: 'Tech Conference 2024 awaits approval',
                time: '2 minutes ago',
                read: false,
                icon: 'fas fa-calendar',
                color: 'text-blue-600'
            },
            {
                id: 2,
                type: 'user',
                title: 'New user registered',
                message: 'John Doe joined the platform',
                time: '15 minutes ago',
                read: false,
                icon: 'fas fa-user-plus',
                color: 'text-green-600'
            },
            {
                id: 3,
                type: 'club',
                title: 'Club approved',
                message: 'Photography Society approved',
                time: '1 hour ago',
                read: true,
                icon: 'fas fa-check-circle',
                color: 'text-indigo-600'
            }
        ];
        
        this.renderNotifications();
        this.updateNotificationCount();
    }

    renderNotifications() {
        if (!this.elements.notificationList) return;
        
        this.elements.notificationList.innerHTML = this.state.notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
                <div class="flex items-start space-x-3">
                    <div class="bg-blue-100 p-2 rounded-full">
                        <i class="${notification.icon} ${notification.color} text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800">${notification.title}</p>
                        <p class="text-xs text-gray-600">${notification.message}</p>
                        <p class="text-xs text-gray-400 mt-1">${notification.time}</p>
                    </div>
                    ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full"></div>' : ''}
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        this.elements.notificationList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'));
                this.markNotificationAsRead(id);
            });
        });
    }

    markNotificationAsRead(id) {
        const notification = this.state.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.renderNotifications();
            this.updateNotificationCount();
            this.saveState();
        }
    }

    updateNotificationCount() {
        const unreadCount = this.state.notifications.filter(n => !n.read).length;
        if (this.elements.notificationCount) {
            this.elements.notificationCount.textContent = unreadCount;
            this.elements.notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info') {
        if (!this.elements.toast || !this.elements.toastMessage) return;
        
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = `toast ${type}`;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    showModal(content, options = {}) {
        const modalHTML = `
            <div class="modal-overlay" id="currentModal">
                <div class="modal-content" style="max-width: ${options.maxWidth || '600px'}">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-800">${options.title || 'Modal'}</h2>
                        <button class="text-gray-500 hover:text-gray-700" onclick="app.closeModal()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        this.elements.modalContainer.innerHTML = modalHTML;
        
        setTimeout(() => {
            const modal = document.getElementById('currentModal');
            if (modal) {
                modal.classList.add('active');
            }
        }, 10);
    }

    closeModal() {
        const modal = document.getElementById('currentModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                this.elements.modalContainer.innerHTML = '';
            }, 300);
        }
    }

    startAutoRefresh() {
        setInterval(() => {
            if (this.state.settings.autoRefresh && !document.hidden) {
                // Refresh current page data
                this.refreshCurrentPageData();
            }
        }, this.state.settings.refreshInterval);
    }

    refreshCurrentPageData() {
        // Simulate data refresh
        this.loadNotifications();
        
        if (this.state.currentPage === 'dashboard' && window.DashboardManager) {
            window.DashboardManager.refreshData();
        }
    }

    // Utility methods
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(date) {
        return `${this.formatDate(date)} at ${this.formatTime(date)}`;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AdminDashboard();
    window.app = app; // Make it globally accessible
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.app) {
        window.app.showToast('Welcome back!', 'info');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}