/**
 * Chats Data Module
 * Handles contact data structure and chat management
 */

// Contact data structure
const CONTACTS = [
    {
        id: 'contact-1',
        name: 'Sarah Johnson',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        status: 'Online',
        lastSeen: null,
        isOnline: true,
        unreadCount: 2
    },
    {
        id: 'contact-2',
        name: 'Michael Chen',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        status: 'Last seen today at 14:30',
        lastSeen: '2026-11-22T14:30:00',
        isOnline: false,
        unreadCount: 0
    },
    {
        id: 'contact-3',
        name: 'Emily Davis',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        status: 'Online',
        lastSeen: null,
        isOnline: true,
        unreadCount: 0
    },
    {
        id: 'contact-4',
        name: 'James Wilson',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        status: 'Last seen yesterday at 22:15',
        lastSeen: '2026-11-21T22:15:00',
        isOnline: false,
        unreadCount: 5
    },
    {
        id: 'contact-5',
        name: 'Lisa Anderson',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        status: 'At work',
        lastSeen: '2026-11-22T09:00:00',
        isOnline: false,
        unreadCount: 0
    },
    {
        id: 'contact-6',
        name: 'David Brown',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        status: 'Online',
        lastSeen: null,
        isOnline: true,
        unreadCount: 1
    },
    {
        id: 'contact-7',
        name: 'Jennifer Lee',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer',
        status: 'Last seen 2 days ago',
        lastSeen: '2026-11-20T18:45:00',
        isOnline: false,
        unreadCount: 0
    },
    {
        id: 'contact-8',
        name: 'Robert Taylor',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
        status: 'Online',
        lastSeen: null,
        isOnline: true,
        unreadCount: 0
    }
];

// Current user data
const CURRENT_USER = {
    id: 'current-user',
    name: 'You',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current-user',
    status: 'Hey there! I\'m using WhatsApp'
};

// Chat storage key
const CHATS_STORAGE_KEY = 'whatsapp_chats';
const CURRENT_CHAT_KEY = 'whatsapp_current_chat';
const USER_DATA_KEY = 'whatsapp_user_data';

// Chat class to manage chats
class ChatManager {
    constructor() {
        this.chats = new Map();
        this.currentChatId = null;
        this.contacts = [...CONTACTS];
        this.currentUser = { ...CURRENT_USER };
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.ensureChatsExist();
    }

    loadFromStorage() {
        try {
            const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
            if (storedChats) {
                const parsed = JSON.parse(storedChats);
                this.chats = new Map(Object.entries(parsed).map(([id, messages]) => [id, messages]));
            }

            const storedCurrentChat = localStorage.getItem(CURRENT_CHAT_KEY);
            if (storedCurrentChat) {
                this.currentChatId = storedCurrentChat;
            }

            const storedUserData = localStorage.getItem(USER_DATA_KEY);
            if (storedUserData) {
                this.currentUser = { ...this.currentUser, ...JSON.parse(storedUserData) };
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            const chatsObj = Object.fromEntries(this.chats);
            localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chatsObj));
            if (this.currentChatId) {
                localStorage.setItem(CURRENT_CHAT_KEY, this.currentChatId);
            }
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    ensureChatsExist() {
        // Initialize empty chat arrays for all contacts if they don't exist
        this.contacts.forEach(contact => {
            if (!this.chats.has(contact.id)) {
                this.chats.set(contact.id, []);
            }
        });
    }

    getContacts() {
        return [...this.contacts];
    }

    getContactById(id) {
        return this.contacts.find(c => c.id === id) || null;
    }

    getCurrentUser() {
        return { ...this.currentUser };
    }

    updateCurrentUser(data) {
        this.currentUser = { ...this.currentUser, ...data };
        this.saveToStorage();
        return this.currentUser;
    }

    getChatMessages(contactId) {
        return this.chats.get(contactId) || [];
    }

    getAllChats() {
        const chats = [];
        this.chats.forEach((messages, contactId) => {
            const contact = this.getContactById(contactId);
            if (contact && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                chats.push({
                    contactId,
                    contact,
                    lastMessage,
                    unreadCount: contact.unreadCount || 0,
                    messageCount: messages.length
                });
            }
        });
        // Sort by last message time, newest first
        return chats.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
    }

    getCurrentChatId() {
        return this.currentChatId;
    }

    setCurrentChat(contactId) {
        const contact = this.getContactById(contactId);
        if (!contact) return false;

        this.currentChatId = contactId;
        // Mark as read
        contact.unreadCount = 0;
        this.saveToStorage();
        return true;
    }

    clearCurrentChat() {
        this.currentChatId = null;
        localStorage.removeItem(CURRENT_CHAT_KEY);
    }

    addMessage(contactId, message) {
        if (!this.chats.has(contactId)) {
            this.chats.set(contactId, []);
        }
        const messages = this.chats.get(contactId);
        messages.push(message);
        this.chats.set(contactId, messages);

        // Update contact's last message preview
        const contact = this.getContactById(contactId);
        if (contact) {
            // Increment unread if not current chat
            if (this.currentChatId !== contactId) {
                contact.unreadCount = (contact.unreadCount || 0) + 1;
            }
        }

        this.saveToStorage();
        return message;
    }

    markMessagesAsRead(contactId) {
        const contact = this.getContactById(contactId);
        if (contact) {
            contact.unreadCount = 0;
            this.saveToStorage();
        }
    }

    deleteConversation(contactId) {
        this.chats.delete(contactId);
        if (this.currentChatId === contactId) {
            this.clearCurrentChat();
        }
        this.saveToStorage();
        return true;
    }

    clearChat(contactId) {
        this.chats.set(contactId, []);
        const contact = this.getContactById(contactId);
        if (contact) {
            contact.unreadCount = 0;
        }
        this.saveToStorage();
        return true;
    }

    searchContacts(query) {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return this.getContacts();

        return this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowerQuery)
        );
    }

    createNewChat(contactId) {
        const contact = this.getContactById(contactId);
        if (!contact) return null;

        // If chat already has messages, just switch to it
        const messages = this.getChatMessages(contactId);
        this.setCurrentChat(contactId);
        return contact;
    }
}

// Export singleton instance
window.ChatManager = new ChatManager();