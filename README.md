# Azure and Node.js Bots Workshop

Originally given at MinneWebCon 2018 on April 24.

[Slides](https://slides.com/kamranayub/node-js-bots-with-azure-workshop-6)

## Workshop Goal

Build a basic bot that accepts a user question, parses it, and returns a response.

We will:

- Leverage Azure Bot Service
- Leverage Bot Builder SDK with Node.js
- Leverage Cognitive Services (LUIS)

## Cost and Pricing

We will be using Azure cloud services. There will be a minimal cost to deploy Azure Storage. Storage costs $0.002/GB so we're talking < $1. The rest of the services we'll use are totally free.

If you do not already use Azure, the [free Azure account](https://azure.microsoft.com/en-us/free/) for initial signups provides $200 credit for 30 days and 12 months of access. After that, you will be on the Pay-as-you-Go plan but you can delete the workshop services way before that starts.

From Microsoft:

> A phone number, a credit or debit card, and a Microsoft Account username. Credit card information is used for identity verification. You won’t be charged until you upgrade.

## Prerequisites

- (Some) JavaScript experience
- A favorite editor (Recommended: [VS Code](https://code.visualstudio.com))
- Node.js 8+ (`node -v`)
- NPM 5+ (`npm -v`)
- Azure account

# Agenda

These are estimates. The workshop is designed for 3 hours with room for working through the hands-on tutorials and presenting from the instructor.

## 00 - Introduction - 15 minutes

[Slides](https://slides.com/kamranayub/node-js-bots-with-azure-workshop)

- Who am I?
- What is a bot? Why would I want to make one?
- What does Azure provide to make bots?

## 01 - Hello World - 20 minutes

- System check!
  - `node -v`
  - `npm -v`
- Sign up for a [free Azure account](https://azure.microsoft.com/en-us/free/)
- Create a new Web App bot
- Select F0 pricing (Free!)
- Bot Template
  - Node.js
  - Language Understanding
- Standard options for the rest
  - Storage option will cost < $1
- Test in Web Chat
  - *Trouble?* Refresh the portal after signing in, seems to make it work better!
- Trigger the Greeting intent
  - Type `hi!` or `hello`

## 02 - Hello Yourself! - 40 minutes

- Download the bot locally to your machine
  - Build > Download
  - Extract locally
  - (optional) Add "publish.js" to .gitignore since it contains your SCM password
- Open folder in an editor
  - Visual Studio Code or your favorite
- Walkthrough app.js
- Modify Greeting dialog
- Publish back to Azure
  - `node publish.js`

To test bot locally: 

- Download emulator: https://github.com/Microsoft/BotFramework-Emulator/releases
- Get environment variables (Azure Portal -> Bot -> App Settings):
  - Microsoft App ID (`MicrosoftAppId`)
  - Microsoft App Password (`MicrosoftAppPassword`)
  - Table storage connection string (`AzureWebJobsStorage`)
  - LUIS App Id (`LuisAppId`)
  - LUIS API key (`LuisAPIKey`)
- Set environment vars in shell (easiest is to make a script!)
- Run `npm install`
- Run your script or `node app.js`

## 03 - LUIS - 45 minutes

- Log in to https://luis.ai (same as Azure account)
- Overview of Intents, Utterances, Entities, and Conversations
- Walkthrough LUIS [tutorial](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-recognize-intent-luis)
- Train LUIS on Notes
- Publish changes
- Publish bot changes
- Try some variations of "read aloud" to see what works and what doesn't
  - In LUIS -> Review Endpoint Utterances
  - Add the utterances that matched successfully
- Train and publish LUIS model again
- Try again

## 04 - Channels - 15 minutes

- In Azure portal, look at hooking up bot to a 3rd party service
  in channels
- Configure Skype channel (free with Microsoft account)
- Save the channel
- Click Skype join link to add bot to contacts

## 05 - Stretch Goals - 20+ mins

- Add suggested actions to the greeting (https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-send-suggested-actions)
- Add a new intent and dialog (e.g. CopyNote)

# Resources

The following resources were used to build this workshop:

- https://docs.microsoft.com/en-us/azure/bot-service/
- https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart
- https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-overview
- https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-recognize-intent-luis
