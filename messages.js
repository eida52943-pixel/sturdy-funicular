/**
 * Messages Module
 * Handles message data structure, formatting, and message-related utilities
 */

// Message types
const MESSAGE_TYPES = {
    TEXT: 'text',
    EMOJI: 'emoji',
    SYSTEM: 'system'
};

// Message status
const MESSAGE_STATUS = {
    SENT: 'sent',       // Single check - sent
    DELIVERED: 'delivered', // Double check - delivered
    READ: 'read'        // Double check blue - read
};

// Generate unique message ID
function generateMessageId() {
    return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Create a new message object
function createMessage(text, senderId, type = MESSAGE_TYPES.TEXT) {
    return {
        id: generateMessageId(),
        senderId,
        text: text || '',
        timestamp: new Date().toISOString(),
        type,
        status: MESSAGE_STATUS.SENT,
        isEmojiOnly: type === MESSAGE_TYPES.EMOJI && isEmojiOnly(text)
    };
}

// Check if text is emoji only
function isEmojiOnly(text) {
    if (!text) return false;
    const trimmed = text.trim();
    // Check if string contains only emoji characters
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]+$/u;
    return emojiRegex.test(trimmed.replace(/\s/g, ''));
}

// Format timestamp for display
function formatTimestamp(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let dateLabel = '';
    if (messageDate.getTime() === today.getTime()) {
        dateLabel = 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
        dateLabel = 'Yesterday';
    } else {
        // Format as DD/MM/YYYY for older messages
        dateLabel = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    const timeLabel = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return { dateLabel, timeLabel, fullTimestamp: d.toISOString() };
}

// Format time for message bubbles (just time)
function formatMessageTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Format last seen time
function formatLastSeen(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Online';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Get status icon SVG based on message status
function getStatusIcon(status) {
    switch (status) {
        case MESSAGE_STATUS.SENT:
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
        case MESSAGE_STATUS.DELIVERED:
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L7 17l-5-5"/><path d="M22 10L11 21l-5-5"/></svg>`;
        case MESSAGE_STATUS.READ:
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6L7 17l-5-5"/><path d="M22 10L11 21l-5-5"/></svg>`;
        default:
            return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
    }
}

// Emoji data organized by category
const EMOJI_CATEGORIES = {
    smileys: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
        '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
        '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
        '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
        '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
        '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
        '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
        '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
    ],
    people: [
        '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱',
        '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩‍🦲', '🧓', '👴', '👵',
        '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🤦', '🤷', '🧑‍⚕️',
        '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️',
        '👩‍⚖️', '🧑‍🌾', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧',
        '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍💻',
        '👨‍💻', '👩‍💻', '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍✈️', '👨‍✈️',
        '👩‍✈️', '🧑‍🚀', '👨‍🚀', '👩‍🚀', '🧑‍🚒', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️',
        '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '🥷', '👷', '👷‍♂️', '👷‍♀️',
        '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '🤵‍♂️', '🤵‍♀️',
        '👰', '👰‍♂️', '👰‍♀️', '🤰', '🤱', '👼', '🎅', '🤶', '🧑‍🎄', '🦸',
        '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️',
        '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️',
        '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '💅', '🤳', '💪', '🦾',
        '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀',
        '👁️', '👅', '👄', '💋', '🩸', '🩹', '🩺', '💊', '💉', '🩻'
    ],
    activities: [
        '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏫', '🏩',
        '🏨', '🏪', '🏦', '🏛️', '⛪', '🕌', '🕍', '🕋', '🗼', '🗽',
        '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️',
        '🏜️', '🌋', '⛰️', '🗻', '🏔️', '🗾', '🌅', '🌄', '🌌', '🌃',
        '🌆', '🌇', '🌉', '🌁', '🌈', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️',
        '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '☀️', '🌤️', '🌥️', '☁️',
        '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨',
        '💧', '💦', '☔', '☂️', '🌊', '🌊', '🏄', '🏊', '🤽', '🚣',
        '🧗', '🚴', '🚵', '🏎️', '🏍️', '🛹', '🛷', '⛸️', '🎿', '🏂',
        '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '👯', '👯‍♂️', '👯‍♀️', '🧖',
        '🧖‍♂️', '🧖‍♀️', '🧗‍♂️', '🧗‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️',
        '🤾', '🤾‍♂️', '🤾‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🤽‍♂️', '🤽‍♀️', '🤾', '🤾‍♂️',
        '🤾‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🤺', '🤸', '🤸‍♂️',
        '🤸‍♀️', '⛷️', '🏂', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏇', '🧘', '🧘‍♂️', '🧘‍♀️',
        '🛀', '🛌', '🎮', '🕹️', '🎰', '🎲', '🧩', '🎯', '🎳', '🎮',
        '🕹️', '🎰', '🎲', '🧩', '🎯', '🎳', '🎮', '🕹️', '🎰', '🎲'
    ],
    objects: [
        '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️',
        '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥',
        '🎬', '📽️', '📹', '📷', '📸', '📹', '📷', '📸', '📹', '🎞️',
        '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕',
        '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄',
        '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '💴', '💵', '💶', '💷',
        '💸', '💳', '🧾', '💹', '💱', '💲', '✉️', '📧', '📨', '📩',
        '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️',
        '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️',
        '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌',
        '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒',
        '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️',
        '🗡️', '⚔️', '💣', '🪃', '🏹', '🛡️', '🪚', '🔧', '🔩', '⚙️',
        '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🧪', '🧫',
        '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪',
        '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🪒', '🧴', '🧷', '🧹',
        '🧺', '🧻', '🧼', '🧽', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🪦',
        '🗿', '🪧', '🧱', '🧲', '🪝', '🪜', '🧱', '🧱', '🧱', '🧱'
    ],
    symbols: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
        '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
        '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '☮️',
        '🕎', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎',
        '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️',
        '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬',
        '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴',
        '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '♾️', '‼️', '⁉️',
        '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️',
        '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '✖️', '❌', '⭕',
        '💯', '💮', '🎓', '🎒', '🎒', '🎒', '🎒', '🎒', '🎒', '🎒'
    ]
};

// All emojis flat list for search
const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

// Frequently used emojis (will be updated based on usage)
let FREQUENT_EMOJIS = ['😀', '😂', '😍', '😭', '😎', '👍', '👎', '❤️', '🔥', '🎉', '🙏', '😊', '😭', '🤣', '😘', '😂'];

// Track emoji usage
function trackEmojiUsage(emoji) {
    // Remove if already exists
    FREQUENT_EMOJIS = FREQUENT_EMOJIS.filter(e => e !== emoji);
    // Add to front
    FREQUENT_EMOJIS.unshift(emoji);
    // Keep only top 20
    FREQUENT_EMOJIS = FREQUENT_EMOJIS.slice(0, 20);
    // Save to localStorage
    try {
        localStorage.setItem('whatsapp_frequent_emojis', JSON.stringify(FREQUENT_EMOJIS));
    } catch (e) {
        console.error('Error saving frequent emojis:', e);
    }
}

// Load frequent emojis from storage
function loadFrequentEmojis() {
    try {
        const stored = localStorage.getItem('whatsapp_frequent_emojis');
        if (stored) {
            FREQUENT_EMOJIS = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading frequent emojis:', e);
    }
}

// Search emojis
function searchEmojis(query) {
    if (!query) return ALL_EMOJIS;

    const lowerQuery = query.toLowerCase();
    // Simple keyword matching for common emojis
    const keywordMap = {
        'smile': ['😀', '😃', '😄', '😁', '😊', '☺️'],
        'laugh': ['😂', '🤣', '😆', '😅'],
        'love': ['😍', '🥰', '❤️', '😘', '💕', '💖'],
        'cry': ['😭', '😢', '🥺'],
        'angry': ['😠', '😡', '🤬', '😤'],
        'cool': ['😎', '🤩', '😏'],
        'think': ['🤔', '🤨', '🧐'],
        'sleep': ['😴', '💤', '😪'],
        'party': ['🎉', '🥳', '🎊', '🍾'],
        'fire': ['🔥', '💥', '✨'],
        'heart': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
        'thumbs': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👋', '🤚', '🖐️'],
        'clap': ['👏', '🙌'],
        'pray': ['🙏', '🛐'],
        'star': ['⭐', '🌟', '✨', '💫'],
        'check': ['✅', '☑️', '✔️'],
        'cross': ['❌', '❎', '🚫', '⛔'],
        'warning': ['⚠️', '🚨', '🔔', '🔕'],
        'question': ['❓', '❔', '⁉️'],
        'exclamation': ['❗', '❕', '‼️'],
        'music': ['🎵', '🎶', '🎧', '🎤', '🎸', '🎹'],
        'food': ['🍎', '🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🍫', '🍰', '🍦', '🍩'],
        'drink': ['☕', '🍵', '🧃', '🥤', '🍷', '🍺', '🍻', '🥂', '🍾'],
        'sport': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
        'animal': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
        'nature': ['🌸', '🌹', '🌻', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌿'],
        'weather': ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌈'],
        'travel': ['🚗', '🚌', '🚂', '✈️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤'],
        'time': ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '⏰', '⏱️', '⏲️', '⏳', '⌛'],
        'number': ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
        'letter': ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿']
    };

    // Check for keyword matches
    for (const [keyword, emojis] of Object.entries(keywordMap)) {
        if (keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) {
            return emojis;
        }
    }

    // Return frequent emojis as fallback for empty-ish searches
    return FREQUENT_EMOJIS;
}

// Export functions and constants
window.MessageUtils = {
    MESSAGE_TYPES,
    MESSAGE_STATUS,
    createMessage,
    formatTimestamp,
    formatMessageTime,
    formatLastSeen,
    getStatusIcon,
    isEmojiOnly,
    EMOJI_CATEGORIES,
    ALL_EMOJIS,
    FREQUENT_EMOJIS,
    trackEmojiUsage,
    loadFrequentEmojis,
    searchEmojis
};