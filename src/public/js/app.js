const socket = io();

const welcome = document.getElementById("welcome");
const nameForm = document.getElementById("name");
const enterForm = document.getElementById("enter");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

const handleMessageSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};

const handleNicknameSubmit = (e) => {
  e.preventDefault();
  const input = nameForm.querySelector("input");

  socket.emit("nickname", input.value);
  input.value = "";
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = enterForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

enterForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left TT`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  const roomList = welcome.querySelector("ul");
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
