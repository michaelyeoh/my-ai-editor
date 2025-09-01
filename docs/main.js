async function sendMessage() {
  const prompt = document.getElementById("prompt").value;
  const responseBox = document.getElementById("response");
  responseBox.textContent = "Loading...";

  try {
    const res = await fetch("https://YOUR-VERCEL-PROJECT.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      JSON.stringify(data);

    responseBox.textContent = reply;
  } catch (err) {
    responseBox.textContent = "Error: " + err;
  }
}
