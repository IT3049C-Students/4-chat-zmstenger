const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;

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

sendButton.addEventListener("click", function (sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;
  sendMessages(sender, message);
  myMessage.value = "";
});
updateMessages()
setInterval(updateMessages, 10000);