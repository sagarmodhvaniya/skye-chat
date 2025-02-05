
const express = require('express')
const cors = require('cors');
const app = express();
const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const { struct } = require('pb-util');
// Replace these values with your Dialogflow CX agent details
const projectId = '';
const location = ''; // Use the appropriate location for your agent
const agentId = '';
const languageCode = ''; // Set your desired language code
const serviceAccount = {}
app.use(cors())
const port = process.env.PORT || 3000;
app.use(express.json());
app.post('/', async (req, res) => {
  try {
    const { text, sessionId } = req.body;
    console.log(text, sessionId)
    if (!text || !sessionId) {
      res.status(400).json({ error: 'Invalid request, missing text or sessionId' });
      return;
    }
    const client = new SessionsClient({ apiEndpoint: 'us-central1-dialogflow.googleapis.com', credentials: serviceAccount })

    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        languageCode: languageCode,
        text: {
          text: text,
        },
      },
      queryParams:{}
    }
    if (text.includes('00EVENT00')) {
      request.queryInput.event = {
        event: text.split('00EVENT00')[1]
      }
      delete request.queryInput.text;
    }
    if (text.includes('00FLOW00')) {
      request.queryParams.currentPage =  text.split('00FLOW00')[1]
      delete request.queryInput.text;
    }
    ;
    console.log(request)
    const [response] = await client.detectIntent(request);
    let customData = {};
    try {
      // console.log(response.queryResult.diagnosticInfo)
      response.queryResult.parameters = struct.decode(response.queryResult.parameters)
      response.queryResult.diagnosticInfo = struct.decode(response.queryResult.diagnosticInfo)

      // return customData
    } catch (e) {
      // log.warn("extractCustomPayload Error in decode JSON")
      // return customData
    }
    console.log("response.queryResult", JSON.stringify(response, null, 2))
    const fulfillmentText = [];
    let previousMessage;
    for (const message of response.queryResult.responseMessages) {
      console.log("message", message)
      if (message.text) {
        console.log(`Agent Response: ${message.text.text}`);
        previousMessage = message.text.text[0]
        fulfillmentText.push(message)
      } else if (message.payload) {
        message.payload = struct.decode(message.payload)
        if(previousMessage){
          fulfillmentText.pop()
        }
        message.text = previousMessage;

        fulfillmentText.push(message)
        previousMessage = undefined

      }

    }
    res.json(fulfillmentText);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(200).json([
      {
        "responseType": "ENTRY_PROMPT",
        "channel": "",
        "text": {
            "text": [
                "I'm having trouble processing your request. Can you try again?"
            ],
            "allowPlaybackInterruption": false
        },
        "message": "text"
    }
    ]);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
