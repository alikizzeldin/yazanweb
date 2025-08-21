// Supabase Configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://omchjfgwmlbaefquswox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2hqZmd3bWxiYWVmcXVzd294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzI2NzgsImV4cCI6MjA3MTMwODY3OH0._vuvzsVNa7yaKILUrcvscJOFjeYSCGgARjGaEsh7LPk';

// Initialize Supabase client
console.log('Initializing Supabase client...');
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized');

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');
const refreshBtn = document.getElementById('refreshBtn');

// Message form elements
const senderNameInput = document.getElementById('senderName');
const senderEmailInput = document.getElementById('senderEmail');
const messageContentInput = document.getElementById('messageContent');

// Initialize the inbox
document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Message form submission
    messageForm.addEventListener('submit', handleMessageSubmit);
    
    // Refresh button
    refreshBtn.addEventListener('click', loadMessages);
    
    // Real-time subscription for new messages
    setupRealtimeSubscription();
}

// Handle message form submission
async function handleMessageSubmit(e) {
    e.preventDefault();
    
    const submitBtn = messageForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const name = senderNameInput.value.trim();
        const email = senderEmailInput.value.trim();
        const content = messageContentInput.value.trim();
        
        // Validate input
        if (!name || !email || !content) {
            throw new Error('Please fill in all fields');
        }
        
        // Send message to Supabase
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    sender_name: name,
                    sender_email: email,
                    message_content: content,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) {
            throw error;
        }
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Clear form
        messageForm.reset();
        
        // Reload messages
        loadMessages();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Load messages from Supabase
async function loadMessages() {
    try {
        // Show loading state
        showLoadingState();
        
        console.log('Attempting to load messages from Supabase...');
        console.log('Supabase URL:', SUPABASE_URL);
        
        // Fetch messages from Supabase
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        console.log('Supabase response:', { data: messages, error });
        
        if (error) {
            throw error;
        }
        
        // Display messages
        displayMessages(messages);
        
    } catch (error) {
        console.error('Error loading messages:', error);
        showNotification(`Failed to load messages: ${error.message}`, 'error');
        showEmptyState();
    }
}

// Display messages in the UI
function displayMessages(messages) {
    if (!messages || messages.length === 0) {
        showEmptyState();
        return;
    }
    
    const messagesHTML = messages.map(message => createMessageHTML(message)).join('');
    messagesList.innerHTML = messagesHTML;
}

// Create HTML for a single message
function createMessageHTML(message) {
    const timestamp = formatTimestamp(message.created_at);
    
    return `
        <div class="message-item">
            <div class="message-bubble">
                <div class="message-header">
                    <div class="message-sender">${escapeHtml(message.sender_name)}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
                <div class="message-content">${escapeHtml(message.message_content)}</div>
                <div class="message-email">${escapeHtml(message.sender_email)}</div>
            </div>
        </div>
    `;
}

// Show loading state
function showLoadingState() {
    messagesList.innerHTML = `
        <div class="loading-messages">
            <div class="loading-spinner"></div>
            <p>Loading messages...</p>
        </div>
    `;
}

// Show empty state
function showEmptyState() {
    messagesList.innerHTML = `
        <div class="empty-messages">
            <i class="fas fa-inbox"></i>
            <h4>No messages yet</h4>
            <p>Be the first to send a message!</p>
        </div>
    `;
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.success-message, .error-message');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = type === 'success' ? 'success-message' : 'error-message';
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of the messages container
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.insertBefore(notification, messagesContainer.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Setup real-time subscription for new messages
function setupRealtimeSubscription() {
    const subscription = supabase
        .channel('messages')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages' 
            }, 
            (payload) => {
                // Add new message to the top of the list
                const newMessageHTML = createMessageHTML(payload.new);
                const firstMessage = messagesList.querySelector('.message-item');
                
                if (firstMessage) {
                    messagesList.insertAdjacentHTML('afterbegin', newMessageHTML);
                } else {
                    // If no messages exist, reload all messages
                    loadMessages();
                }
                
                // Show notification
                showNotification('New message received!', 'success');
            }
        )
        .subscribe();
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add smooth scrolling to messages list
function scrollToBottom() {
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Export functions for potential use in other scripts
window.InboxManager = {
    loadMessages,
    sendMessage: handleMessageSubmit,
    formatTimestamp,
    showNotification
};
