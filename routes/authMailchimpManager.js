const querystring = require("querystring");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { updateWorkspace } = require("../controller/UserManager/workspace");
const router = require('express').Router();


// You should always store your client id and secret in environment variables for security — the exception: sample code.
const MAILCHIMP_CLIENT_ID = "420629775515";
const MAILCHIMP_CLIENT_SECRET =
  "6c9d982f569a37a9758c43605a654158092bef233a23d69d45";
const BASE_URL = "https://cs-service.herokuapp.com";
const OAUTH_CALLBACK = `${BASE_URL}/oauth/mailchimp/callback`;


// 2. The login link above will direct the user here, which will redirect
// to Mailchimp's OAuth login page.
router.get("/auth/mailchimp", (req, res) => {
  res.redirect(
    `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK
    })}`
  );
});

// 3. Once // 3. Once the user authorizes your app, Mailchimp will redirect the user to
// this endpoint, along with a code you can use to exchange for the user's
// access token.
router.get("/oauth/mailchimp/callback", async (req, res) => {
  // console.log(req.query);
  const {
    query: { code }
  } = req;

  res.redirect(`https://app.customsegment.com/integrations?code=${code}`)
});

router.post("/oauth/mailchimp/connect", async (req, res) => {
  const { 'x-workspace-id': workspaceId } = req.headers;
  // Here we're exchanging the temporary code for the user's access token.
  const code = req.body.code;
  // console.log(code);
  const tokenResponse = await fetch(
    "https://login.mailchimp.com/oauth2/token",
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: MAILCHIMP_CLIENT_ID,
        client_secret: MAILCHIMP_CLIENT_SECRET,
        redirect_uri: OAUTH_CALLBACK,
        code
      })
    }
  );
    // console.log(tokenResponse);
  const { access_token } = await tokenResponse.json();
    // console.log(access_token);
  // Now we're using the access token to get information about the user.
  // Specifically, we want to get the user's server prefix, which we'll use to
  // make calls to the API on their behalf.  This prefix will change from user
  // to user.

  const metadataResponse = await fetch(
    "https://login.mailchimp.com/oauth2/metadata",
    {
      headers: {
        Authorization: `OAuth ${access_token}`
      }
    }
  );

  const { dc: server } = await metadataResponse.json();
    // console.log(server);
    const data = {
        workspaceId: Number(workspaceId),
        mailchimpData: {
            accessToken: access_token,
            server: server
        }
    }
  const response = await updateWorkspace(data, 'mailchimpData')
  res.sendStatus(200)

})


module.exports = router;