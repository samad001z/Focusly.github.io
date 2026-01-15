/**
 * Focusly Modern UI System
 * Complete UI/UX improvements with property management, chat interface, and type-aware properties
 */

// ========================================
// 1. TOAST NOTIFICATION SYSTEM
// ========================================

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
            type = 'info',
            title = '',
            message = '',
            duration = 4000
        } = options;

        const toast = this.createToastElement(type, title, message);
        this.container.appendChild(toast);
        this.toasts.push(toast);

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

window.Toast = new ToastNotification();

// ========================================
// 2. PROPERTY TYPE SYSTEM
// ========================================

/**
 * Property Type Definitions
 * Each property has rendering logic, data structure, and validation
 */

const PropertyTypes = {
    STATUS: {
        name: 'Status',
        icon: 'fas fa-circle',
        options: ['Todo', 'In Progress', 'Done'],
        defaultValue: 'Todo',
        render(value) {
            const colors = {
                'Todo': '#9CA3AF',
                'In Progress': '#F59E0B',
                'Done': '#10B981'
            };
            return `
                <span class="property-badge" style="background: ${colors[value] || '#9CA3AF'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                    ${value}
                </span>
            `;
        },
        createInput(currentValue) {
            const select = document.createElement('select');
            select.className = 'property-select';
            this.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                option.selected = opt === currentValue;
                select.appendChild(option);
            });
            return select;
        }
    },

    DATE: {
        name: 'Date',
        icon: 'fas fa-calendar',
        defaultValue: new Date().toISOString().split('T')[0],
        render(value) {
            if (!value) return '<span class="property-empty">No date</span>';
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `<span class="property-date">${day}-${month}-${year}</span>`;
        },
        createInput(currentValue) {
            const input = document.createElement('input');
            input.type = 'date';
            input.className = 'property-input';
            input.value = currentValue || this.defaultValue;
            return input;
        }
    },

    CHECKBOX: {
        name: 'Checkbox',
        icon: 'fas fa-square',
        defaultValue: false,
        render(value) {
            return `
                <span class="property-checkbox">
                    <i class="fas ${value ? 'fa-check-square' : 'fa-square'}"></i>
                </span>
            `;
        },
        createInput(currentValue) {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'property-checkbox-input';
            input.checked = currentValue === true || currentValue === 'true';
            return input;
        }
    },

    NUMBER: {
        name: 'Number',
        icon: 'fas fa-hash',
        defaultValue: 0,
        render(value) {
            if (!value && value !== 0) return '<span class="property-empty">—</span>';
            return `<span class="property-number">${value}</span>`;
        },
        createInput(currentValue) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'property-input';
            input.value = currentValue || this.defaultValue;
            return input;
        }
    }
};

// ========================================
// 3. PROPERTY MANAGER (IMPROVED)
// ========================================

class PropertyManager {
    constructor() {
        this.activeProperties = new Map(); // Map to track property type and value
        this.listeners = [];
    }

    /**
     * Add or toggle a property
     * Returns true if added, false if removed
     */
    toggle(propertyType, initialValue = null) {
        if (this.activeProperties.has(propertyType)) {
            // Remove if already exists
            this.activeProperties.delete(propertyType);
            this.notifyListeners('propertyRemoved', { type: propertyType });
            return false;
        } else {
            // Add if not exists
            const propDef = PropertyTypes[propertyType];
            const value = initialValue !== null ? initialValue : propDef.defaultValue;
            this.activeProperties.set(propertyType, value);
            this.notifyListeners('propertyAdded', { type: propertyType, value });
            return true;
        }
    }

    hasProperty(propertyType) {
        return this.activeProperties.has(propertyType);
    }

    getValue(propertyType) {
        return this.activeProperties.get(propertyType);
    }

    setValue(propertyType, value) {
        if (this.activeProperties.has(propertyType)) {
            this.activeProperties.set(propertyType, value);
            this.notifyListeners('propertyChanged', { type: propertyType, value });
            return true;
        }
        return false;
    }

    getAll() {
        return new Map(this.activeProperties);
    }

    clear() {
        this.activeProperties.clear();
        this.notifyListeners('cleared', {});
    }

    addEventListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(callback => callback(event, data));
    }
}

window.PropertyManager = new PropertyManager();

// ========================================
// 4. AI CHAT UI (IMPROVED)
// ========================================

class AIChatUI {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.messagesContainer = this.container.querySelector('.ai-chat-messages');
        this.inputArea = this.container.querySelector('.ai-chat-input-area');
        this.chatInput = this.inputArea?.querySelector('.ai-chat-input');
        this.sendBtn = this.inputArea?.querySelector('.ai-chat-send-btn');

        this.isLoading = false;
        this.conversationHistory = []; // Track conversation context
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

        // Display welcome message
        this.addAIMessage('Hi! I\'m your AI assistant powered by Gemini. How can I help you today?');
    }

    sendMessage() {
        if (!this.chatInput || this.isLoading) return;

        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.conversationHistory.push({ role: 'user', content: message });
        this.chatInput.value = '';
        this.chatInput.focus();

        this.showLoading();
        this.getAIResponse(message);
    }

    async getAIResponse(userMessage) {
        try {
            // Simulate API call (replace with actual server endpoint)
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    context: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();
            const aiMessage = data.response;

            this.hideLoading();
            this.addAIMessage(aiMessage);
            this.conversationHistory.push({ role: 'ai', content: aiMessage });
        } catch (error) {
            this.hideLoading();
            this.showError('Unable to reach AI. Please try again.');
            console.error('AI response error:', error);
        }
    }

    addUserMessage(text) {
        const group = document.createElement('div');
        group.className = 'ai-message-group user';
        group.innerHTML = `
            <div class="ai-message-bubble user-bubble">${this.escapeHtml(text)}</div>
            <div class="ai-message-avatar">You</div>
        `;
        this.messagesContainer?.appendChild(group);
        this.scrollToBottom();
    }

    addAIMessage(text) {
        const group = document.createElement('div');
        group.className = 'ai-message-group ai';
        group.innerHTML = `
            <div class="ai-message-avatar">AI</div>
            <div class="ai-message-bubble ai-bubble">${this.escapeHtml(text)}</div>
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
        this.conversationHistory = [];
    }
}

// ========================================
// 5. TASK CREATION UI
// ========================================

class TaskCreationUI {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.init();
    }

    init() {
        const taskInput = this.container.querySelector('.task-title-input');
        if (taskInput) {
            taskInput.addEventListener('focus', (e) => {
                e.target.placeholder = 'What needs to be done?';
            });
            
            taskInput.addEventListener('blur', (e) => {
                e.target.placeholder = 'Write your task here...';
            });

            const addBtn = this.container.closest('.card')?.querySelector('[data-action="addTask"]');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    setTimeout(() => taskInput.focus(), 100);
                });
            }
        }

        this.setupPropertyButtons();
    }

    /**
     * Setup property button toggle behavior with no duplicates
     */
    setupPropertyButtons() {
        const buttons = this.container.querySelectorAll('.property-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const propertyType = button.dataset.property;
                
                // Toggle property
                const wasAdded = window.PropertyManager.toggle(propertyType);
                
                if (wasAdded) {
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                }
            });
        });

        // Listen to property manager changes
        window.PropertyManager.addEventListener((event, data) => {
            const button = this.container.querySelector(`[data-property="${data.type}"]`);
            if (button) {
                if (event === 'propertyAdded') {
                    button.classList.add('active');
                } else if (event === 'propertyRemoved') {
                    button.classList.remove('active');
                }
            }
        });
    }
}

// ========================================
// 6. UI HELPER UTILITIES
// ========================================

const UIHelpers = {
    showSkeleton(container, count = 1, type = 'task') {
        const className = `${type}-skeleton skeleton`;
        const html = Array(count)
            .fill()
            .map(() => `<div class="${className}"></div>`)
            .join('');
        container.innerHTML = html;
    },

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

    debounce(func, delay = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },

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

// ========================================
// 7. INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.task-input-container').forEach(container => {
        new TaskCreationUI(container);
    });

    document.querySelectorAll('.ai-chat-container').forEach(container => {
        new AIChatUI(container);
    });

    // Keyboard shortcut: Ctrl+Shift+K to focus task input
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            const input = document.querySelector('.task-title-input');
            if (input) {
                e.preventDefault();
                input.focus();
            }
        }
    });
});

// Export classes for external use
window.ToastNotification = ToastNotification;
window.TaskCreationUI = TaskCreationUI;
window.AIChatUI = AIChatUI;
window.PropertyTypes = PropertyTypes;
