// ============================================
// CHIC BOUTIQUE - CHATBOT UI LOGIC
// ============================================

// Configuration
const OLLAMA_ENDPOINT = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3.2:3b";

// Prompt Templates
const ZERO_SHOT_TEMPLATE = `You are a helpful, friendly, and concise customer support agent for an online e-commerce store called 'Chic Boutique'. Your goal is to assist customers with their questions quickly and efficiently. Always maintain a professional and empathetic tone.

Do not make up information about policies, shipping times, or product details if you don't know the answer. Instead, politely state that you'll need to escalate the query to a human agent.

Keep your responses under 60 words and use simple, clear language.

Customer Query: "{query}"

Agent Response:`;

const ONE_SHOT_TEMPLATE = `You are a helpful, friendly, and concise customer support agent for an online e-commerce store called 'Chic Boutique'. Your goal is to assist customers with their questions quickly and efficiently. Always maintain a professional and empathetic tone.

Do not make up information about policies, shipping times, or product details if you don't know the answer. Instead, politely state that you'll need to escalate the query to a human agent.

Keep your responses under 60 words and use simple, clear language.

--- EXAMPLE START ---
Customer Query: "What is your return policy?"
Agent Response: "We offer a 30-day return policy for all unworn items with tags still attached. You can start a return from your order history page. Items must be in original condition for a full refund."
--- EXAMPLE END ---

Customer Query: "{query}"

Agent Response:`;

// State
let currentMode = 'zero';
let responseCount = 0;
let responseTimes = [];

// DOM Elements
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const connectionStatus = document.getElementById('connection-status');
const loadingIndicator = document.getElementById('loading-indicator');
const modeButtons = document.querySelectorAll('.mode-btn');
const currentModeDisplay = document.getElementById('current-mode');
const responseCountDisplay = document.getElementById('response-count');
const avgTimeDisplay = document.getElementById('avg-time');
const sampleQueries = document.querySelectorAll('.sample-query');

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    checkOllamaStatus();
    setupEventListeners();
    updateModeDisplay();
}

function setupEventListeners() {
    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Enter to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Input validation
    userInput.addEventListener('input', () => {
        sendBtn.disabled = userInput.value.trim() === '';
    });

    // Mode buttons
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            updateModeDisplay();
        });
    });

    // Sample queries
    sampleQueries.forEach(query => {
        query.addEventListener('click', () => {
            userInput.value = query.textContent;
            sendBtn.disabled = false;
        });
    });
}

function updateModeDisplay() {
    const modeNames = {
        'zero': 'Zero-Shot',
        'one': 'One-Shot'
    };
    currentModeDisplay.textContent = modeNames[currentMode];
}

async function checkOllamaStatus() {
    try {
        const response = await fetch(`${OLLAMA_ENDPOINT.replace('/api/generate', '/api/tags')}`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });

        if (response.ok) {
            const data = await response.json();
            const hasModel = data.models?.some(model =>
                model.name.startsWith('llama3.2:3b')
            );

            if (hasModel) {
                connectionStatus.textContent = 'Connected';
                connectionStatus.className = 'badge connected';
            } else {
                connectionStatus.textContent = 'Model Missing';
                connectionStatus.className = 'badge disconnected';
                addSystemMessage('Llama 3.2:3b model not found. Please run: ollama pull llama3.2:3b');
            }
        } else {
            connectionStatus.textContent = 'Error';
            connectionStatus.className = 'badge disconnected';
        }
    } catch (error) {
        connectionStatus.textContent = 'Offline';
        connectionStatus.className = 'badge disconnected';
        addSystemMessage('Cannot connect to Ollama. Make sure Ollama is running on localhost:11434');
    }
}

async function sendMessage() {
    const query = userInput.value.trim();
    if (!query) return;

    // Add user message
    addMessage(query, 'user');

    // Clear input
    userInput.value = '';
    sendBtn.disabled = true;

    // Show loading
    showLoading(true);

    // Get template
    const template = currentMode === 'zero' ? ZERO_SHOT_TEMPLATE : ONE_SHOT_TEMPLATE;
    const prompt = template.replace('{query}', query);

    // Query Ollama
    const startTime = Date.now();
    try {
        const response = await queryOllama(prompt);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        responseTimes.push(responseTime);
        updateStats();

        addMessage(response, 'bot');
    } catch (error) {
        addMessage(`Error: ${error.message}`, 'bot', true);
    } finally {
        showLoading(false);
        sendBtn.disabled = false;
    }
}

async function queryOllama(prompt) {
    const payload = {
        model: MODEL_NAME,
        prompt: prompt,
        stream: false
    };

    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(60000) // 60 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.response || 'No response generated.';
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. The model might be busy or slow to respond.');
        }
        throw error;
    }
}

function addMessage(content, type, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    if (isError) {
        paragraph.style.color = '#ef4444';
    }

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = formatTime(new Date());

    contentDiv.appendChild(paragraph);
    contentDiv.appendChild(timestamp);

    messageDiv.appendChild(contentDiv);
    chatHistory.appendChild(messageDiv);

    if (type === 'bot') {
        responseCount++;
        responseCountDisplay.textContent = responseCount;
    }

    // Scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.style.opacity = '0.7';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.style.background = 'rgba(239, 68, 68, 0.1)';
    contentDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';

    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    paragraph.style.fontSize = '0.875rem';

    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    chatHistory.appendChild(messageDiv);

    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showLoading(show) {
    if (show) {
        loadingIndicator.classList.add('show');
    } else {
        loadingIndicator.classList.remove('show');
    }
}

function updateStats() {
    responseCountDisplay.textContent = responseCount;

    if (responseTimes.length > 0) {
        const avgTime = Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000
        );
        avgTimeDisplay.textContent = `${avgTime}s`;
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Expose for debugging
window.chatbotDebug = {
    checkStatus: checkOllamaStatus,
    sendMessage: sendMessage,
    getState: () => ({ currentMode, responseCount, responseTimes })
};
