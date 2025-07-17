// Announcements Manager
class AnnouncementsManager {
    constructor() {
        this.announcements = [
            {
                id: 1,
                title: 'Campus WiFi Maintenance',
                content: 'Network maintenance scheduled for this weekend. Expect brief interruptions.',
                type: 'maintenance',
                priority: 'medium',
                targetAudience: 'all',
                status: 'published',
                publishDate: '2024-01-20',
                expiryDate: '2024-01-25',
                author: 'IT Department',
                views: 1247
            },
            {
                id: 2,
                title: 'New Event Registration Open',
                content: 'Registration for the annual science fair is now open. Limited spots available.',
                type: 'event',
                priority: 'high',
                targetAudience: 'students',
                status: 'published',
                publishDate: '2024-01-18',
                expiryDate: '2024-02-15',
                author: 'Events Team',
                views: 892
            }
        ];
    }

    render(container) {
        container.innerHTML = this.getHTML();
    }

    getHTML() {
        return `
            <div class="fade-in">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Announcements Management</h2>
                        <p class="text-gray-600">Create and manage campus-wide announcements</p>
                    </div>
                    <button onclick="AnnouncementsManager.showCreateModal()" class="btn-primary">
                        <i class="fas fa-plus mr-2"></i>Create Announcement
                    </button>
                </div>

                <div class="grid gap-4">
                    ${this.announcements.map(announcement => `
                        <div class="card rounded-xl shadow-sm p-6">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <h3 class="text-lg font-semibold text-gray-900">${announcement.title}</h3>
                                        <span class="status-badge ${announcement.status}">${announcement.status}</span>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${announcement.priority === 'high' ? 'red' : announcement.priority === 'medium' ? 'yellow' : 'gray'}-100 text-${announcement.priority === 'high' ? 'red' : announcement.priority === 'medium' ? 'yellow' : 'gray'}-800">
                                            ${announcement.priority} priority
                                        </span>
                                    </div>
                                    <p class="text-gray-600 mb-3">${announcement.content}</p>
                                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                                        <span><i class="fas fa-user mr-1"></i>${announcement.author}</span>
                                        <span><i class="fas fa-eye mr-1"></i>${announcement.views} views</span>
                                        <span><i class="fas fa-calendar mr-1"></i>Published ${announcement.publishDate}</span>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button class="text-green-600 hover:text-green-800" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-red-600 hover:text-red-800" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static showCreateModal() {
        if (window.app) {
            window.app.showModal(`
                <form class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input type="text" class="form-input" placeholder="Announcement title">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea rows="4" class="form-input" placeholder="Announcement content"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select class="form-input">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                            <select class="form-input">
                                <option value="all">All Users</option>
                                <option value="students">Students</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex space-x-4">
                        <button type="button" onclick="app.closeModal()" class="btn-secondary flex-1">Cancel</button>
                        <button type="submit" class="btn-primary flex-1">Create Announcement</button>
                    </div>
                </form>
            `, { title: 'Create New Announcement', maxWidth: '600px' });
        }
    }
}

window.AnnouncementsManager = new AnnouncementsManager();