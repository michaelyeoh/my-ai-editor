export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "";
  const origin = req.headers.origin || "";
  if (allowedOrigin && origin !== allowedOrigin) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).send({ error: "Method not allowed" });
    return;
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing message string" });
      return;
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const r = await fetch(`${url}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      res.status(502).json({ error: "Upstream API error", status: r.status, body: txt });
      return;
    }

    const data = await r.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Internal server error", detail: String(err) });
  }
}
