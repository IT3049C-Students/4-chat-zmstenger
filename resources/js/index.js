const body = document.getElementById('my-body')
const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const yoursMessages = document.getElementById('yours-messages')
const header = document.getElementById('jumbotron')
const saveNameButton = document.getElementById("save-name");
const darkModeBtn = document.getElementById('toggle-dark-mode')
const clearUserDataBtn = document.getElementById('clear-user-data')
const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;
const nameProvided = false
const username = sessionStorage.getItem('username')


function toggleDarkMode() {
  body.classList.toggle("dark-mode");
  header.classList.toggle('dark-mode-header');
} 

function fetchMessages() {
    return fetch(serverURL)
        .then( response => response.json())
}

function formatMessages (message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
  if (myNameInput === message.sender) {
    return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `
  } else {
    return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `
  }
}

function sendMessages (username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  }
  fetch(serverURL, {
    method: `POST`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
  updateMessages()
}

async function updateMessages () {
  const messages = await fetchMessages();
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessages(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
  console.log(messages)
}

saveNameButton.addEventListener("click", function (saveNameButtonClickEvent) {
  saveNameButtonClickEvent.preventDefault();
  localStorage.setItem('username', nameInput.value)
  sessionStorage.setItem('username', nameInput.value)
  myMessage.placeholder = 'Type a message ...'
  myMessage.disabled = false
});

sendButton.addEventListener("click", function (sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
    const sender = nameInput.value;
    const message = myMessage.value;
    sendMessages(sender, message);
    myMessage.value = "";
});

clearUserDataBtn.addEventListener('click', function(clearUserDataBtnClickEavent){
  clearUserDataBtnClickEavent.preventDefault()
  localStorage.removeItem('username')
  localStorage.clear()
  sessionStorage.clear()
  nameInput.value=''
  myMessage.placeholder = 'DISABLED'
  myMessage.disabled=true
})

darkModeBtn.addEventListener('click', function(e){
  e.preventDefault()
  toggleDarkMode()
})



if(username===null){
  myMessage.placeholder = 'DISABLED'
  myMessage.disabled=true
}

updateMessages()
setInterval(updateMessages, 10000);