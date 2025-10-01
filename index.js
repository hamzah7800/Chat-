const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector('.chatbox');

let userMessage;

const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', className);
  let chatContent = `<p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const messageElement = incomingChatLi.querySelector('p');
  const API_URL = '/.netlify/functions/chat';

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch(() => {
      messageElement.classList.add('error');
      messageElement.textContent = 'Oops! Something went wrong. Please try again!';
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, 'chat-outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi('Thinking...', 'chat-incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);

  chatInput.value = '';
};

sendChatBtn.addEventListener('click', handleChat);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

function cancel() {
  let chatbotcomplete = document.querySelector('.chatBot');
  if (chatbotcomplete.style.display !== 'none') {
    chatbotcomplete.style.display = 'none';
    let lastMsg = document.createElement('p');
    lastMsg.textContent = 'Thanks for using our Chatbot!';
    lastMsg.classList.add('lastMessage');
    document.body.appendChild(lastMsg);
  }
}
