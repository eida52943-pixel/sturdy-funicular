/**
 * Main Application Script
 * WhatsApp Web Clone - Handles UI interactions, event listeners, and state management
 */

// Application State
const AppState = {
    currentView: 'empty', // 'empty', 'chat'
    activeContactId: null,
    isMobile: window.innerWidth <= 768,
    isSidebarOpen: false,
    isEmojiPickerOpen: false,
    activeEmojiCategory: 'smileys',
    emojiSearchQuery: '',
    typingTimeout: null,
    isTyping: false,
    autoReplyTimeout: null
};

// DOM Elements - will be initialized in initializeApp()
const DOM = {};

// Initialize DOM elements after DOM is loaded
function initDOM() {
    DOM.sidebar = document.getElementById('sidebar');
    DOM.contactsList = document.getElementById('contactsList');
    DOM.noContacts = document.getElementById('noContacts');
    DOM.searchInput = document.getElementById('searchInput');
    DOM.clearSearch = document.getElementById('clearSearch');
    DOM.newChatBtn = document.getElementById('newChatBtn');
    DOM.currentUserAvatar = document.getElementById('currentUserAvatar');
    DOM.currentUserName = document.getElementById('currentUserName');
    DOM.currentUserStatus = document.getElementById('currentUserStatus');
    DOM.settingsBtn = document.getElementById('settingsBtn');

    DOM.emptyState = document.getElementById('emptyState');
    DOM.activeChat = document.getElementById('activeChat');
    DOM.startChatBtn = document.getElementById('startChatBtn');
    DOM.backBtn = document.getElementById('backBtn');
    DOM.chatAvatar = document.getElementById('chatAvatar');
    DOM.chatName = document.getElementById('chatName');
    DOM.chatStatus = document.getElementById('chatStatus');
    DOM.messagesList = document.getElementById('messagesList');
    DOM.messagesContainer = document.getElementById('messagesContainer');
    DOM.typingIndicator = document.getElementById('typingIndicator');
    DOM.typingText = document.getElementById('typingText');
    DOM.messageInput = document.getElementById('messageInput');
    DOM.sendBtn = document.getElementById('sendBtn');
    DOM.emojiBtn = document.getElementById('emojiBtn');
    DOM.attachBtn = document.getElementById('attachBtn');
    DOM.voiceBtn = document.getElementById('voiceBtn');
    DOM.videoBtn = document.getElementById('videoBtn');
    DOM.chatSettingsBtn = document.getElementById('chatSettingsBtn');
    DOM.chatHeaderInfo = document.querySelector('.chat-header-info');

    DOM.emojiPickerOverlay = document.getElementById('emojiPickerOverlay');
    DOM.emojiPicker = document.getElementById('emojiPicker');
    DOM.emojiTabs = document.getElementById('emojiTabs');
    DOM.emojiSearch = document.getElementById('emojiSearch');
    DOM.emojiPickerBody = document.getElementById('emojiPickerBody');
    DOM.frequentEmojis = document.getElementById('frequentEmojis');

    DOM.modalOverlay = document.getElementById('modalOverlay');
    DOM.chatSettingsModal = document.getElementById('chatSettingsModal');
    DOM.chatSettingsClose = document.getElementById('chatSettingsClose');
    DOM.chatSettingsList = document.getElementById('chatSettingsList');
    DOM.newChatModal = document.getElementById('newChatModal');
    DOM.newChatClose = document.getElementById('newChatClose');
    DOM.newChatSearch = document.getElementById('newChatSearch');
    DOM.newChatContactsList = document.getElementById('newChatContactsList');
    DOM.confirmModal = document.getElementById('confirmModal');
    DOM.confirmTitle = document.getElementById('confirmTitle');
    DOM.confirmMessage = document.getElementById('confirmMessage');
    DOM.confirmCancel = document.getElementById('confirmCancel');
    DOM.confirmOk = document.getElementById('confirmOk');
    DOM.profileModal = document.getElementById('profileModal');
    DOM.profileClose = document.getElementById('profileClose');
    DOM.profileModalAvatar = document.getElementById('profileModalAvatar');
    DOM.profileNameInput = document.getElementById('profileNameInput');
    DOM.profileStatusInput = document.getElementById('profileStatusInput');
    DOM.profileCancel = document.getElementById('profileCancel');
    DOM.profileSave = document.getElementById('profileSave');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize DOM elements
    initDOM();

    // Load frequent emojis
    MessageUtils.loadFrequentEmojis();

    // Set up event listeners
    setupEventListeners();

    // Render initial UI
    renderContacts();
    renderFrequentEmojis();
    renderEmojiCategory('smileys');
    updateCurrentUserUI();

    // Check for existing chat
    const currentChatId = window.ChatManager.getCurrentChatId();
    if (currentChatId) {
        openChat(currentChatId);
    }

    // Handle responsive behavior
    handleResize();
    window.addEventListener('resize', handleResize);

    // Focus search on load (desktop)
    if (!AppState.isMobile) {
        setTimeout(() => DOM.searchInput.focus(), 100);
    }
}

function setupEventListeners() {
    // Sidebar events
    DOM.searchInput.addEventListener('input', handleSearch);
    DOM.clearSearch.addEventListener('click', clearSearch);
    DOM.newChatBtn.addEventListener('click', openNewChatModal);
    DOM.settingsBtn.addEventListener('click', openProfileModal);

    // Chat area events
    DOM.startChatBtn.addEventListener('click', openNewChatModal);
    DOM.backBtn.addEventListener('click', closeChat);
    DOM.messageInput.addEventListener('input', handleMessageInput);
    DOM.messageInput.addEventListener('keydown', handleMessageKeydown);
    DOM.sendBtn.addEventListener('click', sendMessage);
    DOM.emojiBtn.addEventListener('click', toggleEmojiPicker);
    DOM.emojiPickerOverlay.addEventListener('click', closeEmojiPicker);
    DOM.chatSettingsBtn.addEventListener('click', openChatSettingsModal);
    DOM.chatAvatar.addEventListener('click', openContactProfile);
    DOM.chatHeaderInfo.addEventListener('click', openContactProfile);

    // Emoji picker events
    DOM.emojiTabs.addEventListener('click', handleEmojiTabClick);
    DOM.emojiSearch.addEventListener('input', handleEmojiSearch);
    DOM.emojiPickerBody.addEventListener('click', handleEmojiClick);

    // Modal events
    DOM.modalOverlay.addEventListener('click', closeAllModals);
    DOM.chatSettingsClose.addEventListener('click', closeChatSettingsModal);
    DOM.chatSettingsList.addEventListener('click', handleChatSettingsClick);
    DOM.newChatClose.addEventListener('click', closeNewChatModal);
    DOM.newChatSearch.addEventListener('input', handleNewChatSearch);
    DOM.newChatContactsList.addEventListener('click', handleNewChatContactClick);
    DOM.confirmCancel.addEventListener('click', closeConfirmModal);
    DOM.confirmOk.addEventListener('click', handleConfirmAction);
    DOM.profileClose.addEventListener('click', closeProfileModal);
    DOM.profileCancel.addEventListener('click', closeProfileModal);
    DOM.profileSave.addEventListener('click', saveProfile);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);

    // Click outside to close dropdowns
    document.addEventListener('click', handleGlobalClick);
}

function handleResize() {
    const wasMobile = AppState.isMobile;
    AppState.isMobile = window.innerWidth <= 768;

    if (wasMobile !== AppState.isMobile) {
        if (!AppState.isMobile) {
            // Switching to desktop
            DOM.sidebar.classList.remove('open');
            AppState.isSidebarOpen = false;
            DOM.backBtn.style.display = 'none';
        } else {
            // Switching to mobile
            DOM.backBtn.style.display = 'flex';
        }
    }
}

// ==================== Sidebar Functions ====================

function renderContacts(contacts = null) {
    const contactsToRender = contacts || window.ChatManager.getContacts();
    DOM.contactsList.innerHTML = '';

    if (contactsToRender.length === 0) {
        DOM.noContacts.style.display = 'flex';
        return;
    }

    DOM.noContacts.style.display = 'none';

    contactsToRender.forEach(contact => {
        const chatMessages = window.ChatManager.getChatMessages(contact.id);
        const lastMessage = chatMessages[chatMessages.length - 1];
        const isActive = contact.id === AppState.activeContactId;

        const contactEl = document.createElement('div');
        contactEl.className = `contact-item${isActive ? ' active' : ''}`;
        contactEl.dataset.contactId = contact.id;
        contactEl.setAttribute('role', 'listitem');
        contactEl.setAttribute('tabindex', '0');
        contactEl.innerHTML = `
            <div class="contact-avatar-wrapper">
                <img src="${contact.profileImage}" alt="${contact.name}" class="contact-avatar" loading="lazy">
                ${contact.isOnline ? '<span class="online-indicator" aria-label="Online"></span>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <span class="contact-name">${escapeHtml(contact.name)}</span>
                    <span class="contact-time">${lastMessage ? formatMessageTime(lastMessage.timestamp) : ''}</span>
                </div>
                <div class="contact-last-message ${lastMessage && contact.unreadCount > 0 ? 'unread' : ''}">
                    ${lastMessage ? `
                        <span class="message-status ${lastMessage.status === MessageUtils.MESSAGE_STATUS.READ ? 'read' : ''}">
                            ${lastMessage.senderId === 'current-user' ? MessageUtils.getStatusIcon(lastMessage.status) : ''}
                        </span>
                        <span>${escapeHtml(lastMessage.text)}</span>
                    ` : 'No messages yet'}
                    ${contact.unreadCount > 0 ? `<span class="unread-badge" aria-label="${contact.unreadCount} unread messages">${contact.unreadCount}</span>` : ''}
                </div>
            </div>
        `;

        contactEl.addEventListener('click', () => openChat(contact.id));
        contactEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openChat(contact.id);
            }
        });

        DOM.contactsList.appendChild(contactEl);
    });
}

function handleSearch(e) {
    const query = e.target.value;
    DOM.clearSearch.classList.toggle('visible', query.length > 0);

    const filteredContacts = window.ChatManager.searchContacts(query);
    renderContacts(filteredContacts);
}

function clearSearch() {
    DOM.searchInput.value = '';
    DOM.clearSearch.classList.remove('visible');
    renderContacts();
    DOM.searchInput.focus();
}

function updateCurrentUserUI() {
    const user = window.ChatManager.getCurrentUser();
    DOM.currentUserAvatar.src = user.profileImage;
    DOM.currentUserName.textContent = user.name;
    DOM.currentUserStatus.textContent = user.status;
}

// ==================== Chat Functions ====================

function openChat(contactId) {
    const contact = window.ChatManager.getContactById(contactId);
    if (!contact) return;

    AppState.activeContactId = contactId;
    window.ChatManager.setCurrentChat(contactId);
    AppState.currentView = 'chat';

    // Update UI
    DOM.emptyState.style.display = 'none';
    DOM.activeChat.style.display = 'flex';

    DOM.chatAvatar.src = contact.profileImage;
    DOM.chatAvatar.alt = contact.name;
    DOM.chatName.textContent = contact.name;
    DOM.chatStatus.textContent = contact.status;

    // Mark messages as read
    window.ChatManager.markMessagesAsRead(contactId);

    // Render messages
    renderMessages(contactId);

    // Update contact list
    renderContacts();

    // Focus message input
    setTimeout(() => DOM.messageInput.focus(), 100);

    // Mobile: close sidebar
    if (AppState.isMobile) {
        closeSidebar();
    }

    // Simulate typing indicator for demo
    simulateTyping(contactId);
}

function closeChat() {
    AppState.activeContactId = null;
    AppState.currentView = 'empty';
    DOM.activeChat.style.display = 'none';
    DOM.emptyState.style.display = 'flex';
    window.ChatManager.clearCurrentChat();
    renderContacts();
}

function renderMessages(contactId) {
    const messages = window.ChatManager.getChatMessages(contactId);
    DOM.messagesList.innerHTML = '';

    if (messages.length === 0) {
        // Show empty chat message
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-chat';
        emptyMsg.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-tertiary);
            text-align: center;
            padding: 40px 20px;
        `;
        emptyMsg.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 16px; opacity: 0.5;">
                <circle cx="40" cy="40" r="40" fill="var(--bg-tertiary)"/>
                <path d="M56 24L40 36L24 26V52C24 58.6274 29.3726 64 36 64H44C50.6274 64 56 58.6274 56 52V24Z" fill="var(--text-tertiary)"/>
            </svg>
            <p style="font-size: 1rem;">Start messaging with ${window.ChatManager.getContactById(contactId)?.name || 'this contact'}</p>
        `;
        DOM.messagesList.appendChild(emptyMsg);
        return;
    }

    let lastDate = null;

    messages.forEach((message, index) => {
        // Add date separator
        const messageDate = formatMessageDate(message.timestamp);
        if (messageDate !== lastDate) {
            const dateSeparator = document.createElement('div');
            dateSeparator.className = 'date-separator';
            dateSeparator.style.cssText = `
                text-align: center;
                margin: 16px 0 8px;
                color: var(--text-tertiary);
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            `;
            dateSeparator.textContent = messageDate;
            DOM.messagesList.appendChild(dateSeparator);
            lastDate = messageDate;
        }

        const messageEl = createMessageElement(message, contactId);
        DOM.messagesList.appendChild(messageEl);
    });

    // Scroll to bottom
    scrollToBottom();
}

function createMessageElement(message, contactId) {
    const isSent = message.senderId === 'current-user';
    const contact = window.ChatManager.getContactById(contactId);
    const showSenderName = !isSent && contactId !== 'current-user';

    const messageEl = document.createElement('div');
    messageEl.className = `message ${isSent ? 'sent' : 'received'}`;
    messageEl.dataset.messageId = message.id;

    const { timeLabel } = MessageUtils.formatTimestamp(message.timestamp);
    const statusIcon = MessageUtils.getStatusIcon(message.status);

    let bubbleClass = 'message-bubble';
    if (message.isEmojiOnly) {
        bubbleClass += ' emoji-only';
    }

    messageEl.innerHTML = `
        <div class="${bubbleClass}" style="${message.isEmojiOnly ? 'font-size: 2.5rem; padding: 8px; max-width: 180px;' : ''}">
            ${!isSent && showSenderName ? `<span class="message-sender-name" style="font-size: 0.7rem; font-weight: 600; margin-bottom: 2px; display: block; color: var(--text-secondary);">${escapeHtml(contact?.name || 'Unknown')}</span>` : ''}
            <span class="message-text">${escapeHtml(message.text)}</span>
            <div class="message-meta">
                <span class="message-time">${timeLabel}</span>
                ${isSent ? `<span class="message-status-icon">${statusIcon}</span>` : ''}
            </div>
        </div>
    `;

    return messageEl;
}

function formatMessageDate(timestamp) {
    const { dateLabel } = MessageUtils.formatTimestamp(timestamp);
    return dateLabel;
}

function scrollToBottom() {
    DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
}

function handleMessageInput(e) {
    const hasText = e.target.value.trim().length > 0;
    DOM.sendBtn.classList.toggle('active', hasText);
    DOM.sendBtn.disabled = !hasText;

    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';

    // Handle typing indicator
    handleTyping();
}

function handleMessageKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (e.target.value.trim()) {
            sendMessage();
        }
    }
}

function sendMessage() {
    const text = DOM.messageInput.value.trim();
    if (!text || !AppState.activeContactId) return;

    // Create and add message
    const message = MessageUtils.createMessage(text, 'current-user');
    window.ChatManager.addMessage(AppState.activeContactId, message);

    // Clear input
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';
    DOM.sendBtn.classList.remove('active');
    DOM.sendBtn.disabled = true;

    // Re-render messages
    renderMessages(AppState.activeContactId);

    // Simulate reply
    simulateReply(AppState.activeContactId, message);
}

function handleTyping() {
    if (AppState.typingTimeout) {
        clearTimeout(AppState.typingTimeout);
    }

    // In a real app, this would send typing status to server
    // For demo, we'll just simulate the other user typing occasionally
    AppState.typingTimeout = setTimeout(() => {
        // Simulate contact "typing" back
    }, 2000);
}

function simulateTyping(contactId) {
    // Randomly show typing indicator for demo
    if (Math.random() < 0.3) {
        showTypingIndicator(contactId);
        setTimeout(() => {
            hideTypingIndicator();
        }, Math.random() * 3000 + 1000);
    }
}

function showTypingIndicator(contactId) {
    const contact = window.ChatManager.getContactById(contactId);
    if (!contact) return;

    DOM.typingText.textContent = `${contact.name} is typing...`;
    DOM.typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    DOM.typingIndicator.style.display = 'none';
}

function simulateReply(contactId, originalMessage) {
    // Clear any existing auto-reply
    if (AppState.autoReplyTimeout) {
        clearTimeout(AppState.autoReplyTimeout);
    }

    // Show typing indicator
    showTypingIndicator(contactId);

    // Reply after random delay
    const delay = Math.random() * 2000 + 1000;
    AppState.autoReplyTimeout = setTimeout(() => {
        hideTypingIndicator();

        // Generate contextual reply
        const replies = [
            'That\'s interesting!',
            'I see what you mean.',
            'Thanks for sharing!',
            'Sounds good!',
            'Let me think about that...',
            'Got it!',
            '😊',
            '👍',
            'Cool!',
            'Nice!'
        ];

        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const replyMessage = MessageUtils.createMessage(replyText, contactId);
        window.ChatManager.addMessage(contactId, replyMessage);

        // Update UI
        renderMessages(contactId);
        renderContacts(); // Update last message preview
    }, delay);
}

// ==================== Emoji Picker Functions ====================

function toggleEmojiPicker() {
    if (AppState.isEmojiPickerOpen) {
        closeEmojiPicker();
    } else {
        openEmojiPicker();
    }
}

function openEmojiPicker() {
    AppState.isEmojiPickerOpen = true;
    DOM.emojiPickerOverlay.classList.add('visible');
    DOM.emojiPicker.style.display = 'flex';
    DOM.emojiPicker.classList.add('visible');

    // Focus search
    setTimeout(() => DOM.emojiSearch.focus(), 100);

    // Update frequent emojis
    renderFrequentEmojis();
}

function closeEmojiPicker() {
    AppState.isEmojiPickerOpen = false;
    DOM.emojiPickerOverlay.classList.remove('visible');
    DOM.emojiPicker.classList.remove('visible');
    setTimeout(() => {
        if (!AppState.isEmojiPickerOpen) {
            DOM.emojiPicker.style.display = 'none';
            DOM.emojiSearch.value = '';
            AppState.emojiSearchQuery = '';
            renderEmojiCategory(AppState.activeEmojiCategory);
        }
    }, 200);
}

function handleEmojiTabClick(e) {
    const tab = e.target.closest('.emoji-tab');
    if (!tab) return;

    const category = tab.dataset.category;
    if (!category) return;

    // Update active tab
    DOM.emojiTabs.querySelectorAll('.emoji-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    AppState.activeEmojiCategory = category;
    AppState.emojiSearchQuery = '';
    DOM.emojiSearch.value = '';
    renderEmojiCategory(category);
}

function handleEmojiSearch(e) {
    AppState.emojiSearchQuery = e.target.value.toLowerCase();
    renderEmojiSearchResults(AppState.emojiSearchQuery);
}

function renderEmojiSearchResults(query) {
    const results = MessageUtils.searchEmojis(query);
    DOM.emojiPickerBody.innerHTML = '';

    if (results.length === 0) {
        DOM.emojiPickerBody.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-tertiary);">
                <p>No emojis found</p>
            </div>
        `;
        return;
    }

    const categoryEl = document.createElement('div');
    categoryEl.className = 'emoji-category';
    categoryEl.innerHTML = `
        <div class="emoji-category-title">Search Results</div>
        <div class="emoji-grid" role="listbox" aria-label="Search results">
            ${results.map(emoji => `
                <button class="emoji-item" role="option" data-emoji="${escapeHtml(emoji)}" tabindex="0">${emoji}</button>
            `).join('')}
        </div>
    `;
    DOM.emojiPickerBody.appendChild(categoryEl);
}

function renderEmojiCategory(category) {
    const emojis = MessageUtils.EMOJI_CATEGORIES[category] || [];
    DOM.emojiPickerBody.innerHTML = '';

    const categoryEl = document.createElement('div');
    categoryEl.className = 'emoji-category';
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    categoryEl.innerHTML = `
        <div class="emoji-category-title">${categoryName}</div>
        <div class="emoji-grid" role="listbox" aria-label="${categoryName} emojis">
            ${emojis.map(emoji => `
                <button class="emoji-item" role="option" data-emoji="${escapeHtml(emoji)}" tabindex="0">${emoji}</button>
            `).join('')}
        </div>
    `;
    DOM.emojiPickerBody.appendChild(categoryEl);
}

function renderFrequentEmojis() {
    const emojis = MessageUtils.FREQUENT_EMOJIS;
    DOM.frequentEmojis.innerHTML = emojis.map(emoji => `
        <button class="emoji-item" data-emoji="${escapeHtml(emoji)}" tabindex="0">${emoji}</button>
    `).join('');
}

function handleEmojiClick(e) {
    const emojiItem = e.target.closest('.emoji-item');
    if (!emojiItem) return;

    const emoji = emojiItem.dataset.emoji;
    if (!emoji) return;

    // Track usage
    MessageUtils.trackEmojiUsage(emoji);

    // Insert emoji into message input
    const input = DOM.messageInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.slice(0, start) + emoji + text.slice(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;

    // Trigger input event to update send button
    input.dispatchEvent(new Event('input'));

    // Focus back to input
    input.focus();

    // Close picker on mobile, keep open on desktop for multiple selections
    if (AppState.isMobile) {
        closeEmojiPicker();
    }
}

// ==================== Modal Functions ====================

function openNewChatModal() {
    DOM.newChatModal.style.display = 'flex';
    DOM.modalOverlay.classList.add('visible');
    DOM.newChatModal.classList.add('visible');
    renderNewChatContacts();
    setTimeout(() => DOM.newChatSearch.focus(), 100);
}

function closeNewChatModal() {
    DOM.newChatModal.classList.remove('visible');
    DOM.modalOverlay.classList.remove('visible');
    setTimeout(() => {
        DOM.newChatModal.style.display = 'none';
        DOM.newChatSearch.value = '';
    }, 200);
}

function renderNewChatContacts(contacts = null) {
    const contactsToRender = contacts || window.ChatManager.getContacts();
    DOM.newChatContactsList.innerHTML = '';

    contactsToRender.forEach(contact => {
        const contactEl = document.createElement('div');
        contactEl.className = 'contact-item';
        contactEl.dataset.contactId = contact.id;
        contactEl.setAttribute('role', 'listitem');
        contactEl.setAttribute('tabindex', '0');
        contactEl.innerHTML = `
            <div class="contact-avatar-wrapper">
                <img src="${contact.profileImage}" alt="${contact.name}" class="contact-avatar" loading="lazy">
                ${contact.isOnline ? '<span class="online-indicator" aria-label="Online"></span>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <span class="contact-name">${escapeHtml(contact.name)}</span>
                </div>
                <div class="contact-last-message">
                    <span>${contact.status}</span>
                </div>
            </div>
        `;

        contactEl.addEventListener('click', () => {
            closeNewChatModal();
            setTimeout(() => window.ChatManager.createNewChat(contact.id), 100);
        });
        contactEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeNewChatModal();
                setTimeout(() => window.ChatManager.createNewChat(contact.id), 100);
            }
        });

        DOM.newChatContactsList.appendChild(contactEl);
    });
}

function handleNewChatSearch(e) {
    const query = e.target.value;
    const filteredContacts = window.ChatManager.searchContacts(query);
    renderNewChatContacts(filteredContacts);
}

function handleNewChatContactClick(e) {
    const contactItem = e.target.closest('.contact-item');
    if (contactItem) {
        const contactId = contactItem.dataset.contactId;
        closeNewChatModal();
        setTimeout(() => window.ChatManager.createNewChat(contactId), 100);
    }
}

function openChatSettingsModal() {
    DOM.chatSettingsModal.style.display = 'flex';
    DOM.modalOverlay.classList.add('visible');
    DOM.chatSettingsModal.classList.add('visible');
}

function closeChatSettingsModal() {
    DOM.chatSettingsModal.classList.remove('visible');
    DOM.modalOverlay.classList.remove('visible');
    setTimeout(() => {
        DOM.chatSettingsModal.style.display = 'none';
    }, 200);
}

function handleChatSettingsClick(e) {
    const settingItem = e.target.closest('.setting-item');
    if (!settingItem) return;

    const contactId = AppState.activeContactId;
    if (!contactId) return;

    if (settingItem.id === 'clearChatBtn') {
        closeChatSettingsModal();
        showConfirmModal('Clear Chat', `Are you sure you want to clear all messages in this chat?`, () => {
            window.ChatManager.clearChat(contactId);
            renderMessages(contactId);
            renderContacts();
        });
    } else if (settingItem.id === 'deleteConversationBtn') {
        closeChatSettingsModal();
        showConfirmModal('Delete Conversation', `Are you sure you want to delete this conversation? This action cannot be undone.`, () => {
            window.ChatManager.deleteConversation(contactId);
            closeChat();
        });
    } else if (settingItem.id === 'muteNotificationsBtn') {
        closeChatSettingsModal();
        // Toggle mute - for demo just show notification
        showToast('Notifications muted for this chat');
    } else if (settingItem.id === 'viewContactBtn') {
        closeChatSettingsModal();
        openContactProfile();
    }
}

function showConfirmModal(title, message, onConfirm) {
    DOM.confirmTitle.textContent = title;
    DOM.confirmMessage.textContent = message;
    DOM.confirmModal.style.display = 'flex';
    DOM.modalOverlay.classList.add('visible');
    DOM.confirmModal.classList.add('visible');

    // Store callback
    DOM.confirmModal.dataset.confirmAction = '';
    window.confirmCallback = onConfirm;
}

function closeConfirmModal() {
    DOM.confirmModal.classList.remove('visible');
    DOM.modalOverlay.classList.remove('visible');
    setTimeout(() => {
        DOM.confirmModal.style.display = 'none';
        window.confirmCallback = null;
    }, 200);
}

function handleConfirmAction() {
    if (window.confirmCallback) {
        window.confirmCallback();
        window.confirmCallback = null;
    }
    closeConfirmModal();
}

function openProfileModal() {
    const user = window.ChatManager.getCurrentUser();
    DOM.profileModalAvatar.src = user.profileImage;
    DOM.profileNameInput.value = user.name;
    DOM.profileStatusInput.value = user.status;

    DOM.profileModal.style.display = 'flex';
    DOM.modalOverlay.classList.add('visible');
    DOM.profileModal.classList.add('visible');
    setTimeout(() => DOM.profileNameInput.focus(), 100);
}

function closeProfileModal() {
    DOM.profileModal.classList.remove('visible');
    DOM.modalOverlay.classList.remove('visible');
    setTimeout(() => {
        DOM.profileModal.style.display = 'none';
    }, 200);
}

function saveProfile() {
    const name = DOM.profileNameInput.value.trim();
    const status = DOM.profileStatusInput.value.trim();

    if (!name) {
        showToast('Name cannot be empty');
        return;
    }

    window.ChatManager.updateCurrentUser({ name, status });
    updateCurrentUserUI();

    // Update chat header if current chat is with ourselves (not applicable here)
    closeProfileModal();
    showToast('Profile updated');
}

function openContactProfile() {
    const contactId = AppState.activeContactId;
    if (!contactId) return;

    const contact = window.ChatManager.getContactById(contactId);
    if (!contact) return;

    // For demo, just show contact info in a toast
    showToast(`${contact.name} - ${contact.status}`);
}

function closeAllModals() {
    closeEmojiPicker();
    closeChatSettingsModal();
    closeNewChatModal();
    closeConfirmModal();
    closeProfileModal();
}

function closeSidebar() {
    DOM.sidebar.classList.remove('open');
    AppState.isSidebarOpen = false;
}

// ==================== Keyboard Shortcuts ====================

function handleGlobalKeydown(e) {
    // Escape key closes modals/pickers
    if (e.key === 'Escape') {
        closeAllModals();
        if (AppState.isMobile && AppState.isSidebarOpen) {
            closeSidebar();
        }
    }

    // Ctrl/Cmd + N for new chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openNewChatModal();
    }

    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        DOM.searchInput.focus();
    }

    // Ctrl/Cmd + E for emoji picker
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEmojiPicker();
    }

    // Arrow keys for emoji picker navigation
    if (AppState.isEmojiPickerOpen) {
        handleEmojiPickerKeydown(e);
    }
}

function handleEmojiPickerKeydown(e) {
    const items = DOM.emojiPickerBody.querySelectorAll('.emoji-item:not([disabled])');
    if (items.length === 0) return;

    const focusedIndex = Array.from(items).findIndex(item => item === document.activeElement);

    let newIndex = focusedIndex;
    const cols = 8;

    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            newIndex = focusedIndex + 1;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            newIndex = focusedIndex - 1;
            break;
        case 'ArrowDown':
            e.preventDefault();
            newIndex = focusedIndex + cols;
            break;
        case 'ArrowUp':
            e.preventDefault();
            newIndex = focusedIndex - cols;
            break;
        case 'Home':
            e.preventDefault();
            newIndex = 0;
            break;
        case 'End':
            e.preventDefault();
            newIndex = items.length - 1;
            break;
        case 'Enter':
        case ' ':
            if (focusedIndex >= 0) {
                e.preventDefault();
                items[focusedIndex].click();
            }
            return;
    }

    if (newIndex >= 0 && newIndex < items.length) {
        items[newIndex].focus();
    }
}

function handleGlobalClick(e) {
    // Close emoji picker when clicking outside
    if (AppState.isEmojiPickerOpen &&
        DOM.emojiPicker &&
        DOM.emojiBtn &&
        !DOM.emojiPicker.contains(e.target) &&
        !DOM.emojiBtn.contains(e.target)) {
        closeEmojiPicker();
    }
}

// ==================== Utility Functions ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMessageTime(timestamp) {
    return MessageUtils.formatMessageTime(timestamp);
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-toast);
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        pointer-events: none;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== Mobile Sidebar Toggle ====================

// Add click handler for mobile menu button (if we add one)
// For now, we'll use a simple approach: clicking on empty space on mobile closes sidebar
if (AppState.isMobile) {
    document.addEventListener('click', (e) => {
        if (AppState.isSidebarOpen &&
            !DOM.sidebar.contains(e.target) &&
            !e.target.closest('.back-btn')) {
            closeSidebar();
        }
    });
}

// Handle back button on mobile
function handleBackButton() {
    if (AppState.isMobile && AppState.currentView === 'chat') {
        closeChat();
    }
}

// Listen for hash changes (for browser back button)
window.addEventListener('hashchange', handleBackButton);

// Export for debugging
window.App = {
    state: AppState,
    DOM,
    ChatManager: window.ChatManager,
    MessageUtils: window.MessageUtils
};