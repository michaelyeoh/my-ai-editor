// main.js - simple fetch-based frontend
// Replace BACKEND_URL with your deployed backend endpoint.
const BACKEND_URL = "https://<your-vercel-deployment>.vercel.app/api/chat";

document.getElementById("backendUrl").textContent = BACKEND_URL;

const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "ai");
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function send() {
  const txt = inputEl.value.trim();
  if (!txt) return;
  appendMessage("user", txt);
  inputEl.value = "";
  sendBtn.disabled = true;

  try {
    const resp = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: txt })
    });

    if (!resp.ok) {
      const t = await resp.text();
      appendMessage("ai", `Error: ${resp.status} ${t}`);
      sendBtn.disabled = false;
      return;
    }

    const data = await resp.json();
    // try common shapes of response from OpenAI's Chat API
    const reply = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
    appendMessage("ai", reply);
  } catch (err) {
    appendMessage("ai", "Network error: " + String(err));
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", send);
inputEl.addEventListener("keydown", e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send(); });
clearBtn.addEventListener("click", () => { chatEl.innerHTML = ""; });
