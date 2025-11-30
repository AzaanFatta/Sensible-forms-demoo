// Change this if your backend URL is different in the future
const API_BASE = "https://sensible-forms-demoo.onrender.com";

let selectedBot = "question";

const botButtons = document.querySelectorAll(".bot-button");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const chatOutput = document.getElementById("chatOutput");

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadOutput = document.getElementById("uploadOutput");

// Bot selection
botButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    botButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedBot = btn.getAttribute("data-bot");
    chatOutput.textContent = "";
    uploadOutput.textContent = "";
  });
});

// Chat submit
sendBtn.addEventListener("click", async () => {
  const message = messageInput.value.trim();
  if (!message) return;

  sendBtn.disabled = true;
  chatOutput.textContent = "Sending to webserver...";

  const formData = new FormData();
  formData.append("bot", selectedBot);
  formData.append("message", message);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    chatOutput.textContent = data.reply || JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    chatOutput.textContent = "Error: could not reach the webserver.";
  } finally {
    sendBtn.disabled = false;
  }
});

// Drag-and-drop logic
dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFileUpload(fileInput.files[0]);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload(files[0]);
  }
});

async function handleFileUpload(file) {
  uploadOutput.textContent = "";
  if (!file.name.toLowerCase().endsWith(".csv")) {
    uploadOutput.textContent = "Only CSV files are supported in this prototype.";
    return;
  }

  const formData = new FormData();
  formData.append("bot", selectedBot);
  formData.append("file", file);

  uploadOutput.textContent = "Uploading to webserver...";

  try {
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    uploadOutput.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    uploadOutput.textContent = "Error: could not reach the webserver.";
  }
}
