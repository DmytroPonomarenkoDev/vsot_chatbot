import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  const scriptContent = `
    (function() {
      // Create styles for the modal
      const styles = document.createElement('style');
      styles.textContent = \`
        .chat-modal {
          display: none;
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 1000;
          overflow: hidden;
          flex-direction: column;
        }
        .chat-modal.active {
          display: flex;
        }
        .chat-header {
          padding: 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          font-weight: bold;
        }
        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }
        .message {
          margin-bottom: 12px;
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
        }
        .message.bot {
          background: #f1f3f5;
          align-self: flex-start;
        }
        .chat-input {
          padding: 16px;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 8px;
        }
        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 20px;
          outline: none;
        }
        .chat-input button {
          padding: 8px 16px;
          background: #228be6;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }
        .chat-input button:hover {
          background: #1c7ed6;
        }
      \`;
      document.head.appendChild(styles);

      // Create chat bubble
      const chatBubble = document.createElement('div');
      chatBubble.innerHTML = \`
        <div id="chat-bubble" style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #228be6;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
          z-index: 1000;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>

        <div id="chat-modal" class="chat-modal">
          <div class="chat-header">Chat Support</div>
          <div class="chat-messages">
            <div class="message bot">Hi, how can I help you today?</div>
          </div>
          <div class="chat-input">
            <input type="text" placeholder="Type your message..." id="chat-input-field">
            <button id="chat-send-button">Send</button>
          </div>
        </div>
      \`;

      document.body.appendChild(chatBubble);

      const bubble = document.getElementById('chat-bubble');
      const modal = document.getElementById('chat-modal');
      const input = document.getElementById('chat-input-field');
      const sendButton = document.getElementById('chat-send-button');

      if (bubble && modal) {
        const toggleModal = (e) => {
          e.stopPropagation();
          modal.classList.toggle('active');
        };

        // Add click event to the bubble and its children
        bubble.addEventListener('click', toggleModal);
        bubble.querySelector('svg').addEventListener('click', toggleModal);
        bubble.querySelector('path').addEventListener('click', toggleModal);

        bubble.addEventListener('mouseenter', () => {
          bubble.style.transform = 'scale(1.1)';
        });
        bubble.addEventListener('mouseleave', () => {
          bubble.style.transform = 'scale(1)';
        });
      }

      // Close modal when clicking outside
      document.addEventListener('click', (e) => {
        const clickedElement = e.target;
        const isBubble = bubble?.contains(clickedElement);
        const isModal = modal?.contains(clickedElement);
        
        if (modal && !isModal && !isBubble) {
          modal.classList.remove('active');
        }
      });

      // Handle sending messages
      if (input && sendButton) {
        const sendMessage = async () => {
          const text = input.value.trim();
          if (text) {
            const messages = document.querySelector('.chat-messages');
            if (messages) {
              // Add user message
              const userMessageDiv = document.createElement('div');
              userMessageDiv.className = 'message';
              userMessageDiv.style.marginLeft = 'auto';
              userMessageDiv.style.background = '#228be6';
              userMessageDiv.style.color = 'white';
              userMessageDiv.textContent = text;
              messages.appendChild(userMessageDiv);
              
              // Disable input while waiting for response
              input.value = '';
              input.disabled = true;
              sendButton.disabled = true;

              try {
                // Send message to backend
                const response = await fetch('http://localhost:4000/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ message: text })
                });

                if (!response.ok) {
                  throw new Error('Failed to get response');
                }

                const data = await response.json();
                
                // Add bot response
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'message bot';
                botMessageDiv.textContent = data.response;
                messages.appendChild(botMessageDiv);
              } catch (error) {
                console.error('Error:', error);
                // Add error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message bot';
                errorDiv.style.color = 'red';
                errorDiv.textContent = 'Sorry, I encountered an error. Please try again.';
                messages.appendChild(errorDiv);
              } finally {
                // Re-enable input
                input.disabled = false;
                sendButton.disabled = false;
                messages.scrollTop = messages.scrollHeight;
              }
            }
          }
        };

        sendButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }
    })();
  `;

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
} 