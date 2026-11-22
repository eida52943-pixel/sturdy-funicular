# WhatsApp Web Clone

A modern, fully functional WhatsApp Web clone built with HTML5, CSS3, and vanilla JavaScript. This project was created as part of the ReTech Academy Front-End Development Project.

## Features Implemented

### Core Features
- **Contact List Sidebar** - Display 8 contacts with profile pictures, names, last messages, timestamps, and online status
- **Search Contacts** - Real-time filtering of contacts by name
- **Chat Window** - Dynamic chat area showing messages with proper alignment (sent/received)
- **Messaging System** - Send messages with Enter key or Send button, receive simulated replies
- **Message Bubbles** - Styled message bubbles with timestamps and read receipts (single/double check marks)
- **Emoji Picker** - Full emoji picker with 5 categories (Smileys, People, Activities, Objects, Symbols) and search
- **Message Timestamps** - Smart time formatting (Today, Yesterday, DD/MM/YYYY, HH:MM AM/PM)
- **Delete Conversations** - Delete individual conversations with confirmation
- **New Chat** - Start new conversations with any contact
- **Chat Settings** - Clear chat, delete conversation, mute notifications, view contact
- **LocalStorage Persistence** - All data persists across browser sessions
- **Responsive Design** - Works on Desktop, Laptop, Tablet, and Mobile

### Bonus Features
- **Typing Indicator** - Shows when the other person is "typing"
- **Frequently Used Emojis** - Tracks and displays most used emojis
- **Keyboard Shortcuts** - Ctrl+N (new chat), Ctrl+F (search), Ctrl+E (emoji), Escape (close modals)
- **Profile Management** - Edit your name and status
- **Online/Offline Indicators** - Visual status indicators
- **Unread Message Badges** - Badge counts on contacts with unread messages
- **Date Separators** - Messages grouped by date
- **Emoji-Only Messages** - Larger display for emoji-only messages
- **Smooth Animations** - Message appear animations, modal transitions
- **Dark/Light Theme Support** - CSS variables ready for theme switching
- **Accessibility** - ARIA labels, keyboard navigation, focus management

## Project Structure

```
ReTech-WhatsApp/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Complete styling with CSS variables
├── js/
│   ├── chats.js        # Contact & chat data management
│   ├── messages.js     # Message utilities & emoji data
│   └── script.js       # Main application logic
├── images/             # Image assets (empty, uses DiceBear API)
└── README.md           # This file
```

## Data Structures

### Contact
```javascript
{
    id: 'contact-1',
    name: 'Sarah Johnson',
    profileImage: 'https://api.dicebear.com/...',
    status: 'Online',
    lastSeen: null,
    isOnline: true,
    unreadCount: 2
}
```

### Message
```javascript
{
    id: 'msg-1234567890-abc123',
    senderId: 'current-user' | 'contact-1',
    text: 'Hello!',
    timestamp: '2026-11-22T10:30:00.000Z',
    type: 'text',
    status: 'sent' | 'delivered' | 'read',
    isEmojiOnly: false
}
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or server required - runs directly in browser

### Running the Project

1. **Clone or download** the project folder
2. **Open `index.html`** directly in your browser
   - Double-click the file, OR
   - Right-click → "Open with" → your browser, OR
   - Drag and drop into browser window

### Using a Local Server (Optional)
For best experience (especially with ES modules if added later):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage Guide

### Starting a Chat
1. Click on any contact in the sidebar
2. Or click "New Chat" button / press `Ctrl+N`
3. Select a contact from the modal

### Sending Messages
1. Type in the message input at the bottom
2. Press `Enter` to send (or click the send button)
3. Press `Shift+Enter` for new line

### Using Emojis
1. Click the emoji button (smiley face) next to input
2. Browse categories or search for emojis
3. Click an emoji to insert it
4. Frequently used emojis appear at the bottom

### Searching Contacts
1. Type in the search box at the top of sidebar
2. Results filter in real-time
3. Click the X button to clear search

### Chat Settings
1. Click the three-dot menu in chat header
2. Options: Clear Chat, Delete Conversation, Mute Notifications, View Contact

### Profile Settings
1. Click the settings gear in sidebar header
2. Edit your name and status
3. Click Save

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New Chat |
| `Ctrl/Cmd + F` | Focus Search |
| `Ctrl/Cmd + E` | Toggle Emoji Picker |
| `Escape` | Close Modals/Pickers |
| `Enter` | Send Message |
| `Shift + Enter` | New Line in Message |
| `Arrow Keys` | Navigate Emoji Picker |

## Technical Details

### LocalStorage Keys
- `whatsapp_chats` - All chat messages by contact ID
- `whatsapp_current_chat` - Currently active contact ID
- `whatsapp_user_data` - Current user profile (name, status, avatar)
- `whatsapp_frequent_emojis` - Array of frequently used emojis

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### CSS Architecture
- CSS Custom Properties (variables) for theming
- Mobile-first responsive design
- BEM-inspired class naming
- No external CSS frameworks

### JavaScript Architecture
- Modular structure with separate files
- Singleton ChatManager for state management
- MessageUtils for formatting and emoji data
- Event-driven UI updates
- No external dependencies

## Evaluation Criteria Mapping

| Criteria | Implementation |
|----------|---------------|
| HTML Structure (10) | Semantic HTML5, proper hierarchy, accessibility attributes |
| CSS Design (15) | WhatsApp-like design, responsive, animations, CSS variables |
| JavaScript Functionality (25) | All core features working, modular code, localStorage |
| Messaging System (15) | Send/receive, bubbles, timestamps, status indicators |
| Search & Emoji Picker (10) | Real-time search, 5 emoji categories, search, frequent |
| Local Storage (10) | Full persistence of chats, user data, emoji usage |
| Responsive Design (5) | Mobile, tablet, laptop, desktop breakpoints |
| Code Organization (5) | Separate files, clear structure, comments |
| Creativity (5) | Typing indicator, toast notifications, keyboard shortcuts, frequent emojis |

## Project Discussion Answers

1. **What is the DOM?**
   The Document Object Model (DOM) is a programming interface for web documents. It represents the page as a tree of nodes, allowing JavaScript to dynamically access and manipulate HTML elements, attributes, and content.

2. **What is the difference between Array and Object?**
   - Arrays: Ordered collections with numeric indices, ideal for lists where order matters. Methods: push, pop, map, filter, etc.
   - Objects: Key-value pairs with string keys, ideal for structured data. No guaranteed order (though modern JS preserves insertion order).

3. **What is Local Storage?**
   A Web Storage API that allows storing key-value pairs in the browser with no expiration. Data persists across sessions and tabs. Limited to ~5MB, stores strings only (use JSON.stringify/parse for objects).

4. **How did you send a message using JavaScript?**
   Created a message object with `createMessage()`, added it to ChatManager via `addMessage()`, which saves to localStorage and triggers UI re-render via `renderMessages()`.

5. **How did you save messages?**
   Used `localStorage.setItem('whatsapp_chats', JSON.stringify(chats))` where chats is a Map converted to object. Load with `JSON.parse(localStorage.getItem(...))` on initialization.

6. **What is addEventListener?**
   A method to attach event handlers to DOM elements. Syntax: `element.addEventListener(event, handler, options)`. Allows multiple handlers for same event, better than inline handlers.

7. **How did you search for contacts?**
   Added `input` event listener on search field. Filter contacts array with `filter()` checking if `name.toLowerCase().includes(query)`. Re-render contact list with filtered results.

8. **How did you calculate message time?**
   Used `MessageUtils.formatTimestamp()` which compares message date with today/yesterday. Returns formatted time (HH:MM AM/PM) and date label (Today/Yesterday/DD/MM/YYYY).

9. **What is the difference between innerHTML and textContent?**
   - `innerHTML`: Gets/sets HTML markup, parses as HTML (security risk with user input)
   - `textContent`: Gets/sets text only, treats input as literal text (safe from XSS)

10. **How did you delete a conversation?**
    ChatManager.deleteConversation(contactId) removes chat from Map, clears currentChat if active, saves to localStorage, then UI switches to empty state via closeChat().

11. **How did you separate messages between users?**
    Each message has `senderId` ('current-user' or contact ID). In renderMessages(), compare senderId to determine alignment (flex-end for sent, flex-start for received) and bubble styling.

12. **How did you make your application responsive?**
    CSS media queries at 1024px, 768px, 480px breakpoints. Mobile: sidebar slides in/out, chat header shows back button, modals become bottom sheets, touch-friendly sizes.

## License

This project is created for educational purposes as part of ReTech Academy Front-End Development Project.

## Credits

- Profile avatars generated via [DiceBear Avataaars API](https://dicebear.com/styles/avataaars/)
- Icons: Custom SVG icons inspired by WhatsApp Web
- Font: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

**ReTech Academy** - Your Future Starts with Technology