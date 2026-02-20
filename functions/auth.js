export function onRequest(context) {
  const client_id = context.env.GITHUB_CLIENT_ID;
  // Questo reindirizza l'utente alla pagina di login ufficiale di GitHub
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`;
  return Response.redirect(url, 302);
}