const socket = io.connect("http://localhost:3000");

// On new message config :
const inputTag = document.getElementById("text");
const submitBtn = document.getElementById("textbtn");
const chatDiv = document.getElementById("chatbody");

if (socket) {
    socket.emit("join", document.getElementById("userName").value);
}

document.getElementById("textform").addEventListener("submit", (event) => {
    event.preventDefault();


    const formData = new FormData(event.target);

    let message = inputTag.value;

    if (message != "") {
        socket.emit("newMessage", { message: message, user: formData.get("userName"), image: formData.get("userImage"), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) });
    } else {
        return;
    }



    let chatBox = document.createElement("div");
    chatBox.className = "chatBox";
    chatBox.classList.add("right");
    let imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv"
    let messageDiv = document.createElement("div");
    messageDiv.className = "messageDiv";

    let imageTag = document.createElement("img");
    imageTag.setAttribute("src", document.getElementById("userImage").value);
    imageDiv.appendChild(imageTag);

    let timeSpan = document.createElement("span");
    timeSpan.className = "timeSpan";
    timeSpan.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    imageDiv.appendChild(timeSpan);


    let h3Tag = document.createElement("h3");
    h3Tag.textContent = document.getElementById("userName").value;
    let pTag = document.createElement("p");
    pTag.textContent = message;
    messageDiv.appendChild(h3Tag);
    messageDiv.appendChild(pTag);

    chatBox.appendChild(imageDiv);
    chatBox.appendChild(messageDiv);

    chatDiv.appendChild(chatBox);
    inputTag.value = "";
    chatDiv.scrollTop = chatDiv.scrollHeight;
})


// Broadcast message to other Users :
socket.on("broadcast", (data) => {
    let chatBox = document.createElement("div");
    chatBox.className = "chatBox";
    chatBox.classList.add("left");
    let imageDiv = document.createElement("div");
    imageDiv.className = "imageDiv"
    let messageDiv = document.createElement("div");
    messageDiv.className = "messageDiv";

    let imageTag = document.createElement("img");
    imageTag.setAttribute("src", data.image);
    imageDiv.appendChild(imageTag);

    let timeSpan = document.createElement("span");
    timeSpan.className = "timeSpan";
    timeSpan.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    imageDiv.appendChild(timeSpan);

    let h3Tag = document.createElement("h3");
    h3Tag.textContent = data.user;
    let pTag = document.createElement("p");
    pTag.textContent = data.message;
    messageDiv.appendChild(h3Tag);
    messageDiv.appendChild(pTag);

    chatBox.appendChild(imageDiv);
    chatBox.appendChild(messageDiv);

    chatDiv.appendChild(chatBox);
    inputTag.value = "";
    chatDiv.scrollTop = chatDiv.scrollHeight;
})

//Broadcast Online users :
socket.on("onlineUsers", (user) => {
    const container = document.getElementById("onlineusers");

    const div = document.createElement("div");
    div.className = "usersin";
    div.id = user;
    const strong = document.createElement("strong");
    const i = document.createElement("i");
    i.className = "fa-solid fa-earth-americas";
    strong.textContent = user;
    div.appendChild(strong);
    div.appendChild(i);

    container.appendChild(div);
})

// config for User Offline :
socket.on("userOffline", (user) => {
    const container = document.getElementById("onlineusers");
    const offlineUser = document.getElementById(user);
    container.removeChild(offlineUser);
})


//Config for Loading Past messages :
socket.on("pastMessages", (data) => {
    data.forEach(element => {
        let chatBox = document.createElement("div");
        chatBox.className = "chatBox";
        chatBox.classList.add("left");
        let imageDiv = document.createElement("div");
        imageDiv.className = "imageDiv"
        let messageDiv = document.createElement("div");
        messageDiv.className = "messageDiv";

        let imageTag = document.createElement("img");
        imageTag.setAttribute("src", element.image);
        imageDiv.appendChild(imageTag);

        let timeSpan = document.createElement("span");
        timeSpan.className = "timeSpan";
        timeSpan.textContent = element.time
        imageDiv.appendChild(timeSpan);

        let h3Tag = document.createElement("h3");
        h3Tag.textContent = element.name;
        let pTag = document.createElement("p");
        pTag.textContent = element.message;
        messageDiv.appendChild(h3Tag);
        messageDiv.appendChild(pTag);

        chatBox.appendChild(imageDiv);
        chatBox.appendChild(messageDiv);

        chatDiv.appendChild(chatBox);
        inputTag.value = "";
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });
})

// AI Part :
document.getElementById("AIForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("in");
    try {
        const formData = new FormData(event.target);
        document.getElementById("aioutputdiv").classList.add("show");
        document.getElementById("aitextArea").value = "";
        const response = await fetch("http://localhost:3000/AI", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        document.getElementById("aians").style.color = "white";
        document.getElementById("aians").textContent = data.output;
        document.getElementById("clearBtn").textContent = "Clear";
        document.getElementById("clearBtn").disabled = false;

        // AI OUTPUT CLEAR BUTTON :
        document.getElementById("clearBtn").addEventListener("click", function () {
            document.getElementById("aians").textContent = "";
            document.getElementById("aioutputdiv").classList.remove("show");
        });

    } catch (error) {
        console.log(error);
    }
});


//BROADCAST TYPING...
document.getElementById("text").addEventListener("focus",()=>{
    socket.emit("typing",document.getElementById("userName").value);
})

document.getElementById("text").addEventListener("blur",()=>{
    socket.emit("stoped");
})

socket.on("exited",()=>{
    document.getElementById("typPara").textContent = "";
})


socket.on("focusing",(user)=>{
    document.getElementById("typPara").textContent = `${user} typing..`;
})