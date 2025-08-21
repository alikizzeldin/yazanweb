// Supabase Configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://omchjfgwmlbaefquswox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2hqZmd3bWxiYWVmcXVzd294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzI2NzgsImV4cCI6MjA3MTMwODY3OH0._vuvzsVNa7yaKILUrcvscJOFjeYSCGgARjGaEsh7LPk';

// Initialize Supabase client
console.log('Initializing Supabase client...');
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized');

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');
const refreshBtn = document.getElementById('refreshBtn');

// Message form elements
const messageContentInput = document.getElementById('messageContent');

// Initialize the inbox
document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    setupEventListeners();
    setupAutoRefresh();
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
        const content = messageContentInput.value.trim();
        
        // Validate input
        if (!content) {
            throw new Error('Please enter a message');
        }
        
        // Generate anonymous sender info
        const name = `Anonymous User ${Math.floor(Math.random() * 1000)}`;
        const email = `anonymous@visitor.com`;
        
        // Send message to Supabase
        const { data, error } = await supabaseClient
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
        const { data: messages, error } = await supabaseClient
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
    
    // Check if it's an anonymous message
    const isAnonymous = message.sender_email === 'anonymous@visitor.com';
    const displayName = isAnonymous ? 'Anonymous Visitor' : escapeHtml(message.sender_name);
    
    return `
        <div class="message-item">
            <div class="message-bubble">
                <div class="message-header">
                    <div class="message-sender">${displayName}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
                <div class="message-content">${escapeHtml(message.message_content)}</div>
                ${!isAnonymous ? `<div class="message-email">${escapeHtml(message.sender_email)}</div>` : ''}
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
            <p>Be the first to leave a message!</p>
        </div>
    `;
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.success-message, .error-message, .info-message');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = type === 'success' ? 'success-message' : type === 'error' ? 'error-message' : 'info-message';
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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

// Play notification sound
function playNotificationSound() {
    try {
        // Create a simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Could not play notification sound:', error);
    }
}

// Setup real-time subscription for new messages
function setupRealtimeSubscription() {
    console.log('Setting up real-time subscription...');
    
    const subscription = supabaseClient
        .channel('messages')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages' 
            }, 
            (payload) => {
                console.log('New message received via real-time:', payload.new);
                
                // Add new message to the top of the list with animation
                const newMessageHTML = createMessageHTML(payload.new);
                const firstMessage = messagesList.querySelector('.message-item');
                
                if (firstMessage) {
                    // Insert at the top with a smooth animation
                    messagesList.insertAdjacentHTML('afterbegin', newMessageHTML);
                    
                    // Add entrance animation to the new message
                    const newMessageElement = messagesList.querySelector('.message-item');
                    if (newMessageElement) {
                        newMessageElement.style.opacity = '0';
                        newMessageElement.style.transform = 'translateY(-20px)';
                        
                        setTimeout(() => {
                            newMessageElement.style.transition = 'all 0.5s ease';
                            newMessageElement.style.opacity = '1';
                            newMessageElement.style.transform = 'translateY(0)';
                        }, 10);
                    }
                } else {
                    // If no messages exist, reload all messages
                    loadMessages();
                }
                
                // Show notification with sound effect
                showNotification('New message received! 🎉', 'success');
                playNotificationSound();
            }
        )
        .on('postgres_changes',
            {
                event: 'DELETE',
                schema: 'public',
                table: 'messages'
            },
            (payload) => {
                console.log('Message deleted via real-time:', payload.old);
                // Reload messages to reflect deletion
                loadMessages();
                showNotification('Message removed', 'info');
            }
        )
        .subscribe((status) => {
            console.log('Real-time subscription status:', status);
            updateRealtimeStatus(status);
            if (status === 'SUBSCRIBED') {
                showNotification('Real-time updates connected! 🔗', 'success');
            }
        });
        
    return subscription;
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

// Setup auto-refresh as backup for real-time updates
function setupAutoRefresh() {
    // Refresh messages every 2.5 seconds as a backup
    setInterval(() => {
        console.log('Auto-refreshing messages...');
        loadMessages();
    }, 2500); // 2.5 seconds
}

// Update real-time status indicator
function updateRealtimeStatus(status) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (statusDot && statusText) {
        if (status === 'SUBSCRIBED') {
            statusDot.classList.add('connected');
            statusText.textContent = 'Live';
        } else if (status === 'CHANNEL_ERROR') {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Error';
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Connecting...';
        }
    }
}

// Export functions for potential use in other scripts
window.InboxManager = {
    loadMessages,
    sendMessage: handleMessageSubmit,
    formatTimestamp,
    showNotification
};
