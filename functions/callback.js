export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const client_id = context.env.GITHUB_CLIENT_ID;
  const client_secret = context.env.GITHUB_CLIENT_SECRET;

  try {
    // Scambia il codice con il token segreto
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });
    
    const data = await response.json();
    const token = data.access_token;
    
    // Questo script manda il token al CMS per farlo entrare
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <script>
          const receiveMessage = (message) => {
            window.opener.postMessage(
              'authorization:github:success:{"token":"${token}","provider":"github"}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage, false);
            window.close();
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        </script>
      </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
    );
  } catch (error) {
    return new Response('Errore di Autenticazione: ' + error.message, { status: 500 });
  }
}