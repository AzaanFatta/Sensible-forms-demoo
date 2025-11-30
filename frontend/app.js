// CHANGE THIS to your Render backend URL if needed
const API_BASE = "https://sensible-forms-demoo.onrender.com";

const botSelect = document.getElementById("botSelect");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const chatResult = document.getElementById("chatResult");

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadResult = document.getElementById("uploadResult");

// 1. Send chat message to /api/chat
sendBtn.addEventListener("click", async () => {
  const bot = botSelect.value;
  const message = userMessage.value.trim();

  if (!message) {
    chatResult.textContent = "Please type a message first.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("bot", bot);
    formData.append("message", message);

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      chatResult.textContent = `Error from server: ${res.status}`;
      return;
    }

    const data = await res.json();
    // Show just the reply in a simple way
    chatResult.textContent = data.reply || JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    chatResult.textContent = "Network error – could not reach backend.";
  }
});

// 2. Upload file to /api/upload
uploadBtn.addEventListener("click", async () => {
  const bot = botSelect.value;
  const file = fileInput.files[0];

  if (!file) {
    uploadResult.textContent = "Please choose a CSV file first.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("bot", bot);
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      uploadResult.textContent = `Error from server: ${res.status}`;
      return;
    }

    const data = await res.json();
    uploadResult.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    uploadResult.textContent = "Network error – could not reach backend.";
  }
});
