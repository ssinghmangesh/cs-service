const querystring = require("querystring");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { updateWorkspace } = require("../controller/UserManager/workspace");
const router = require('express').Router();


// You should always store your client id and secret in environment variables for security — the exception: sample code.
const DRIP_CLIENT_ID = "7JSZkWUevz2ZlU6nouJtsxnm3ltLzHxhMP6szXnH5Yw";
const DRIP_CLIENT_SECRET = "aM48lMjEO-JNs3F3gCEuu0oodSjSk6acQL5zDCj1efY";
const BASE_URL = "https://cs-service.herokuapp.com";
const OAUTH_CALLBACK = `${BASE_URL}/oauth/drip/callback`;


// 2. The login link above will direct the user here, which will redirect
// to Mailchimp's OAuth login page.
router.get("/auth/drip", (req, res) => {
  res.redirect(
    `https://www.getdrip.com/oauth/authorize?${querystring.stringify({
      response_type: "code",
      client_id: DRIP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK
    })}`
  );
});

// 3. Once // 3. Once the user authorizes your app, Mailchimp will redirect the user to
// this endpoint, along with a code you can use to exchange for the user's
// access token.
router.get("/oauth/drip/callback", async (req, res) => {
  // console.log(req.query);
  const {
    query: { code }
  } = req;

  res.redirect(`https://app.customsegment.com/integrations?integration=drip&code=${code}`)
});

router.post("/oauth/drip/connect", async (req, res) => {
  const { 'x-workspace-id': workspaceId } = req.headers;
  // Here we're exchanging the temporary code for the user's access token.
  const code = req.body.code;
  // console.log(code);
  const tokenResponse = await fetch(
    "https://www.getdrip.com/oauth/token",
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: DRIP_CLIENT_ID,
        client_secret: DRIP_CLIENT_SECRET,
        redirect_uri: OAUTH_CALLBACK,
        code
      })
    }
  )

  const { access_token, token_type } = await tokenResponse.json();
  
    const data = {
        workspaceId: Number(workspaceId),
        dripData: {
            accessToken: access_token,
            tokenType: token_type,
            accountId: 6667052
        }
    }
    const response = await updateWorkspace(data, 'dripData')
  res.sendStatus(200)

})


module.exports = router;