// script.js

import Lume from './lume.js';

// Inicializar el chatbot
const lume = new Lume();
const corpusFile = 'corpus.txt';

async function initializeLume() {
    try {
        const greeting = await lume.initialize(corpusFile);
        addMessage('bot', greeting);
        document.getElementById('send-button').disabled = false;
    } catch (error) {
        console.error('Error al inicializar Lume:', error);
    }
}

// Manejar el envío de mensajes
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        addMessage('user', message);
        const typingIndicator = showTypingIndicator();

        setTimeout(() => {
            const response = lume.getResponse(message);
            hideTypingIndicator(typingIndicator);
            addMessage('bot', response);
            messageInput.value = '';
        }, Math.random() * 1000 + 500); // Tiempo de respuesta aleatorio entre 0.5 y 1.5 segundos
    }
}

// Agregar mensaje al chat
function addMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar el indicador de "generando"
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator active';
    typingIndicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingIndicator;
}

// Ocultar el indicador de "generando"
function hideTypingIndicator(typingIndicator) {
    typingIndicator.remove();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeLume);
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
