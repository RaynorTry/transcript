import fetch from "node-fetch";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  const data = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://lolidarkgalaxy.vercel.app/api/oauth/callback",
  });

  try {
    // Получаем access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokenJson = await tokenRes.json();

    if (tokenJson.error) {
      return res.status(400).json({ error: tokenJson.error });
    }

    // Получаем данные пользователя
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });

    const user = await userRes.json();

    // Можно возвращать JSON или создавать JWT
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Discord OAuth failed", details: err.message });
  }
}
