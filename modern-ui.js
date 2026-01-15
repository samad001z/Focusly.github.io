/**
 * Modern Toast Notification System
 * Professional UI/UX improvements for Bloom
 */

class ToastNotification {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(options = {}) {
        const {
            type = 'info', // 'success', 'error', 'warning', 'info'
            title = '',
            message = '',
            duration = 4000
        } = options;

        const toast = this.createToastElement(type, title, message);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    createToastElement(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
                <div class="toast-message">${this.escapeHtml(message)}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });

        // Also close on click
        toast.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        if (!toast) return;
        
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Convenience methods
    success(title, message, duration) {
        return this.show({ type: 'success', title, message, duration });
    }

    error(title, message, duration) {
        return this.show({ type: 'error', title, message, duration });
    }

    warning(title, message, duration) {
        return this.show({ type: 'warning', title, message, duration });
    }

    info(title, message, duration) {
        return this.show({ type: 'info', title, message, duration });
    }

    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

// Global instance
window.Toast = new ToastNotification();

/**
 * Task Creation UI Handler
 * Makes task creation clear and intuitive
 */

class TaskCreationUI {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.init();
    }

    init() {
        // Setup auto-focus on task input
        const taskInput = this.container.querySelector('.task-title-input');
        if (taskInput) {
            taskInput.addEventListener('focus', (e) => {
                e.target.placeholder = 'What needs to be done?';
            });
            
            taskInput.addEventListener('blur', (e) => {
                e.target.placeholder = 'Write your task here...';
            });

            // Auto-focus when "+ New Task" button is clicked
            const addBtn = this.container.closest('.card')?.querySelector('[data-action="addTask"]');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    setTimeout(() => taskInput.focus(), 100);
                });
            }
        }

        // Setup property button toggle logic
        this.setupPropertyButtons();
    }

    setupPropertyButtons() {
        const buttons = this.container.querySelectorAll('.property-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const propertyType = button.dataset.property;
                
                // Check if already added
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    // Emit remove event
                    button.dispatchEvent(new CustomEvent('propertyRemoved', {
                        detail: { property: propertyType },
                        bubbles: true
                    }));
                } else {
                    button.classList.add('active');
                    // Emit add event
                    button.dispatchEvent(new CustomEvent('propertyAdded', {
                        detail: { property: propertyType },
                        bubbles: true
                    }));
                }
            });
        });
    }
}

/**
 * AI Chat UI Handler
 * ChatGPT-style message bubbles and interactions
 */

class AIChatUI {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.messagesContainer = this.container.querySelector('.ai-chat-messages');
        this.inputArea = this.container.querySelector('.ai-chat-input-area');
        this.chatInput = this.inputArea?.querySelector('.ai-chat-input');
        this.sendBtn = this.inputArea?.querySelector('.ai-chat-send-btn');

        this.isLoading = false;
        this.init();
    }

    init() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    sendMessage() {
        if (!this.chatInput || this.isLoading) return;

        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.chatInput.value = '';
        this.chatInput.focus();

        this.showLoading();
    }

    addUserMessage(text) {
        const group = document.createElement('div');
        group.className = 'ai-message-group user';
        group.innerHTML = `
            <div class="ai-message-avatar">You</div>
            <div class="ai-message-bubble">${this.escapeHtml(text)}</div>
        `;
        this.messagesContainer?.appendChild(group);
        this.scrollToBottom();
    }

    addAIMessage(text) {
        const group = document.createElement('div');
        group.className = 'ai-message-group ai';
        group.innerHTML = `
            <div class="ai-message-avatar">AI</div>
            <div class="ai-message-bubble">${this.escapeHtml(text)}</div>
        `;
        this.messagesContainer?.appendChild(group);
        this.scrollToBottom();
    }

    showLoading() {
        this.isLoading = true;
        if (this.sendBtn) this.sendBtn.disabled = true;

        const group = document.createElement('div');
        group.className = 'ai-message-group ai';
        group.id = 'loading-indicator';
        group.innerHTML = `
            <div class="ai-message-avatar">AI</div>
            <div class="ai-loading-indicator">
                <div class="ai-loading-dot"></div>
                <div class="ai-loading-dot"></div>
                <div class="ai-loading-dot"></div>
            </div>
        `;
        this.messagesContainer?.appendChild(group);
        this.scrollToBottom();
    }

    hideLoading() {
        const loading = this.messagesContainer?.querySelector('#loading-indicator');
        if (loading) loading.remove();
        
        this.isLoading = false;
        if (this.sendBtn) this.sendBtn.disabled = false;
    }

    showError(message = 'AI is unavailable right now. Please try again.') {
        const group = document.createElement('div');
        group.className = 'ai-message-group ai';
        group.innerHTML = `
            <div class="ai-message-avatar">AI</div>
            <div class="ai-error-message">${this.escapeHtml(message)}</div>
        `;
        this.messagesContainer?.appendChild(group);
        this.scrollToBottom();
        
        this.hideLoading();
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 0);
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    clear() {
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
        }
    }
}

/**
 * Property Duplicate Prevention Manager
 * Ensures properties are not duplicated
 */

class PropertyManager {
    constructor() {
        this.activeProperties = new Set();
    }

    addProperty(property) {
        if (this.activeProperties.has(property)) {
            return false; // Already exists
        }
        this.activeProperties.add(property);
        return true;
    }

    removeProperty(property) {
        return this.activeProperties.delete(property);
    }

    hasProperty(property) {
        return this.activeProperties.has(property);
    }

    clear() {
        this.activeProperties.clear();
    }

    getAll() {
        return Array.from(this.activeProperties);
    }
}

window.PropertyManager = new PropertyManager();

/**
 * Modern UI Helper Functions
 */

const UIHelpers = {
    /**
     * Show loading skeleton
     */
    showSkeleton(container, count = 1, type = 'task') {
        const className = `${type}-skeleton skeleton`;
        const html = Array(count)
            .fill()
            .map(() => `<div class="${className}"></div>`)
            .join('');
        container.innerHTML = html;
    },

    /**
     * Create a simple confirmation dialog
     */
    confirm(title, message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
        `;

        content.innerHTML = `
            <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600;">${title}</h3>
            <p style="margin: 0 0 24px; color: #6B7280; font-size: 14px; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="btn-cancel" style="padding: 10px 16px; border: 1px solid #E5E7EB; border-radius: 8px; background: white; cursor: pointer; font-weight: 600;">Cancel</button>
                <button class="btn-confirm" style="padding: 10px 16px; border: none; border-radius: 8px; background: #6366F1; color: white; cursor: pointer; font-weight: 600;">Confirm</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const close = () => {
            modal.remove();
        };

        content.querySelector('.btn-cancel').addEventListener('click', () => {
            close();
            onCancel?.();
        });

        content.querySelector('.btn-confirm').addEventListener('click', () => {
            close();
            onConfirm?.();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    },

    /**
     * Debounce function for expensive operations
     */
    debounce(func, delay = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Format date for display
     */
    formatDate(date) {
        if (typeof date === 'string') date = new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        }).format(date);
    }
};

window.UIHelpers = UIHelpers;

/**
 * Initialize all modern UI components when DOM is ready
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize task creation UIs
    document.querySelectorAll('.task-input-container').forEach(container => {
        new TaskCreationUI(container);
    });

    // Initialize chat UIs
    document.querySelectorAll('.ai-chat-container').forEach(container => {
        new AIChatUI(container);
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+K to focus first task input
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            const input = document.querySelector('.task-title-input');
            if (input) {
                e.preventDefault();
                input.focus();
            }
        }
    });
});

// Export for external use
window.ToastNotification = ToastNotification;
window.TaskCreationUI = TaskCreationUI;
window.AIChatUI = AIChatUI;
