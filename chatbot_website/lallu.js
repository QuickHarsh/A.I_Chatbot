const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let darkMode = localStorage.getItem('novaDarkMode') === 'true';

const applyTheme = () => {
    document.documentElement.classList.toggle('dark', darkMode);
    themeIcon.classList.toggle('fa-moon', !darkMode);
    themeIcon.classList.toggle('fa-sun', darkMode);
    if (darkMode) {
        document.documentElement.classList.add('text-white');
    } else {
        document.documentElement.classList.remove('text-white');
    }
    localStorage.setItem('novaDarkMode', darkMode);
};

themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
});

applyTheme();

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

const createMessage = (role, content) => {
    const message = document.createElement('div');
    message.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} space-x-4`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    message.innerHTML = `
        ${role === 'ai' ? `
            <div class="w-10 h-10 rounded-full bg-nova-primary flex items-center justify-center">
                <i class="fas fa-robot text-white"></i>
            </div>
        ` : ''}
        
        <div class="max-w-xl ${role === 'user' ? 'bg-nova-primary text-white' : 'bg-gray-100 dark:bg-gray-800'} 
            p-4 rounded-2xl ${role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'} 
            transition-all message-enter">
            <p class="text-gray-800 dark:text-white">${content}</p>
            <div class="text-xs opacity-70 mt-2 flex items-center justify-between">
                <span>${time}</span>
                <div class="flex space-x-2">
                    <button class="hover:opacity-70">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="hover:opacity-70">
                        <i class="fas fa-thumbs-up"></i>
                    </button>
                </div>
            </div>
        </div>

        ${role === 'user' ? `
            <div class="w-10 h-10 rounded-full bg-nova-secondary flex items-center justify-center">
                <i class="fas fa-user text-white"></i>
            </div>
        ` : ''}
    `;

    return message;
};

sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (!message) return;

    chatBox.appendChild(createMessage('user', message));

    const typing = document.createElement('div');
    typing.className = 'flex space-x-4 items-center';
    typing.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-nova-primary flex items-center justify-center">
            <i class="fas fa-robot text-white"></i>
        </div>
        <div class="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
            <div class="w-2 h-2 bg-nova-primary rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-nova-primary rounded-full animate-bounce delay-100"></div>
            <div class="w-2 h-2 bg-nova-primary rounded-full animate-bounce delay-200"></div>
        </div>
    `;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(async () => {
        try {
            const response = await fetch('/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_message: message })
            });
            
            const data = await response.json();
            chatBox.removeChild(typing);
            chatBox.appendChild(createMessage('ai', data.response || "I'm having trouble connecting right now."));
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            chatBox.removeChild(typing);
            chatBox.appendChild(createMessage('ai', "I'm having trouble connecting right now. Please try again later."));
        }
    }, 1500);

    userInput.value = '';
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

