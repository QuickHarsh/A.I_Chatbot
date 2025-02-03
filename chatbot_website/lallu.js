const chatBox = document.getElementById("chatBox");
        const userInput = document.getElementById("userInput");
        const sendButton = document.getElementById("sendButton");
        const themeToggle = document.getElementById("themeToggle");
        const clearChat = document.getElementById("clearChat");
        const uploadProfile = document.getElementById("uploadProfile");
        const profileImage = document.getElementById("profileImage");

        let darkMode = false;
        let chatHistory = [];

        function appendMessage(role, text) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", "flex", "items-start", "space-x-3");

            if (role === "user") {
                messageDiv.classList.add("justify-end");
                messageDiv.innerHTML = `
                    <img src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg" class="bot-image">
                    <div class="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-md">${text}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <img src="https://png.pngtree.com/png-vector/20220707/ourmid/pngtree-chatbot-robot-concept-chat-bot-png-image_5632381.png" class="bot-image">
                    <div class="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-md">${text}</div>
                `;
            }

            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        sendButton.addEventListener("click", async () => {
            let userMessage = userInput.value.trim();
            if (!userMessage) return;

            appendMessage("user", userMessage);
            userInput.value = "";
            chatHistory.push({ user: userMessage });

            const typingDiv = document.createElement("div");
            typingDiv.classList.add("message", "flex", "items-start", "space-x-3");
            typingDiv.innerHTML = `<div class="bg-gray-300 text-black px-4 py-2 rounded-lg max-w-md">Typing...</div>`;
            chatBox.appendChild(typingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                let response = await fetch("http://127.0.0.1:8000/chat/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_message: userMessage })
                });

                let data = await response.json();
                chatBox.removeChild(typingDiv);

                if (response.ok) {
                    appendMessage("bot", data.response);
                    chatHistory.push({ bot: data.response });
                } else {
                    appendMessage("bot", "Error: " + data.detail);
                }
            } catch (error) {
                chatBox.removeChild(typingDiv);
                appendMessage("bot", "Failed to fetch response.");
            }
        });

        userInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                sendButton.click();
            }
        });

        clearChat.addEventListener("click", () => {
            chatBox.innerHTML = `<p class="text-center text-gray-500">Chat cleared.</p>`;
            chatHistory = [];
        });

        themeToggle.addEventListener("click", () => {
            darkMode = !darkMode;
            document.body.classList.toggle("dark-mode");
            themeToggle.textContent = darkMode ? "☀ Light Mode" : "🌙 Dark Mode";

            chatBox.classList.toggle("bg-gray-900");
            chatBox.classList.toggle("text-white");

            document.querySelector(".p-4.bg-gray-200").classList.toggle("bg-gray-800");
        });

        uploadProfile.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });