export default function Home() {
  const loginWithDiscord = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "https://lolidarkgalaxy.vercel.app/api/oauth/callback"
    );
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

    window.location.href = discordUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login with Discord</h1>
      <button onClick={loginWithDiscord} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Login
      </button>
    </div>
  );
}
