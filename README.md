# Azure and Node.js Bots Workshop

Originally given at MinneWebCon 2018 on April 24.

## Workshop Goal

Build a basic bot that accepts a user question, parses it, and returns a response.

- Leverage Azure Bot Service
- Leverage Bot Builder SDK
- Leverage Cognitive Services

## Cost and Pricing

We will be using Azure cloud services. There will be a minimal cost to deploy Azure Storage. Storage costs $0.002/GB so we're talking < $1. The rest of the services we'll use are totally free.

If you do not already use Azure, the [free Azure account](https://azure.microsoft.com/en-us/free/) for initial signups provides $200 credit for 30 days and 12 months of access. After that, you will be on the Pay-as-you-Go plan but you can delete the workshop services way before that starts.

From Microsoft:

> A phone number, a credit or debit card, and a Microsoft Account username. Credit card information is used for identity verification. You won’t be charged until you upgrade.

## Prerequisites

- JavaScript experience
- A favorite editor
- Node.js
- Azure account

## 00 - Introduction

- What is a bot? Why would I want to make one?
- What does Azure provide to make bots?

## 01 - Hello World

- Sign up for a [free Azure account](https://azure.microsoft.com/en-us/free/)
- Create a new Web App bot
- Select F0 pricing (Free!)
- Bot Template
  - Node.js
  - Language Understanding
- Standard options for the rest
- Test in Web Chat
- Trigger the Greeting intent

## 02 - Hello Yourself!

- Download the bot locally to your machine
  - Build > Download
  - Extract locally
  - (optional) Add "publish.js" to .gitignore since it contains your SCM password
- Open folder in an editor
  - Visual Studio Code or your favorite
- Walkthrough app.js
- Modify Greeting dialog

## 03 - LUIS

- Log in to https://luis.ai (same as Azure account)
- Overview of Intents, Utterances, Entities, and Conversations
- Walkthrough LUIS [tutorial](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-recognize-intent-luis)



# Resources

The following resources were used to build this workshop:

- https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart
- https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-recognize-intent-luis