/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require("restify");
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log("%s listening to %s", server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post("/api/messages", connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = "botdata";
var azureTableClient = new botbuilder_azure.AzureTableClient(
  tableName,
  process.env["AzureWebJobsStorage"]
);
var tableStorage = new botbuilder_azure.AzureBotStorage(
  { gzipData: false },
  azureTableClient
);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function(session, args) {
  session.send(
    "Hi... I'm the note bot sample. I can create new notes, read saved notes to you and delete notes."
  );

  // If the object for storing notes in session.userData doesn't exist yet, initialize it
  if (!session.userData.notes) {
    session.userData.notes = {};
    console.log("initializing userData.notes in default message handler");
  }
});

bot.set("storage", tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName =
  process.env.LuisAPIHostName || "westus.api.cognitive.microsoft.com";

const LuisModelUrl =
  "https://" +
  luisAPIHostName +
  "/luis/v2.0/apps/" +
  luisAppId +
  "?subscription-key=" +
  luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis
bot
  .dialog("GreetingDialog", session => {
    session.send(
      "You reached the Greeting intent. You said '%s'.",
      session.message.text
    );
    session.endDialog();
  })
  .triggerAction({
    matches: "Greeting"
  });

bot
  .dialog("HelpDialog", session => {
    session.send(
      "You reached the Help intent. You said '%s'.",
      session.message.text
    );
    session.endDialog();
  })
  .triggerAction({
    matches: "Help"
  });

bot
  .dialog("CancelDialog", session => {
    session.send(
      "You reached the Cancel intent. You said '%s'.",
      session.message.text
    );
    session.endDialog();
  })
  .triggerAction({
    matches: "Cancel"
  });

// CreateNote dialog
bot
  .dialog("CreateNote", [
    function(session, args, next) {
      // Resolve and store any Note.Title entity passed from LUIS.
      var intent = args.intent;
      var title = builder.EntityRecognizer.findEntity(
        intent.entities,
        "Note.Title"
      );

      var note = (session.dialogData.note = {
        title: title ? title.entity : null
      });

      // Prompt for title
      if (!note.title) {
        builder.Prompts.text(session, "What would you like to call your note?");
      } else {
        next();
      }
    },
    function(session, results, next) {
      var note = session.dialogData.note;
      if (results.response) {
        note.title = results.response;
      }

      // Prompt for the text of the note
      if (!note.text) {
        builder.Prompts.text(
          session,
          "What would you like to say in your note?"
        );
      } else {
        next();
      }
    },
    function(session, results) {
      var note = session.dialogData.note;
      if (results.response) {
        note.text = results.response;
      }

      // If the object for storing notes in session.userData doesn't exist yet, initialize it
      if (!session.userData.notes) {
        session.userData.notes = {};
        console.log("initializing session.userData.notes in CreateNote dialog");
      }
      // Save notes in the notes object
      session.userData.notes[note.title] = note;

      // Send confirmation to user
      session.endDialog(
        'Creating note named "%s" with text "%s"',
        note.title,
        note.text
      );
    }
  ])
  .triggerAction({
    matches: "Note.Create",
    confirmPrompt:
      "This will cancel the creation of the note you started. Are you sure?"
  })
  .cancelAction("cancelCreateNote", "Note canceled.", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
  });

// Delete note dialog
bot
  .dialog("DeleteNote", [
    function(session, args, next) {
      if (noteCount(session.userData.notes) > 0) {
        // Resolve and store any Note.Title entity passed from LUIS.
        var title;
        var intent = args.intent;
        var entity = builder.EntityRecognizer.findEntity(
          intent.entities,
          "Note.Title"
        );
        if (entity) {
          // Verify that the title is in our set of notes.
          title = builder.EntityRecognizer.findBestMatch(
            session.userData.notes,
            entity.entity
          );
        }

        // Prompt for note name
        if (!title) {
          builder.Prompts.choice(
            session,
            "Which note would you like to delete?",
            session.userData.notes
          );
        } else {
          next({ response: title });
        }
      } else {
        session.endDialog("No notes to delete.");
      }
    },
    function(session, results) {
      delete session.userData.notes[results.response.entity];
      session.endDialog("Deleted the '%s' note.", results.response.entity);
    }
  ])
  .triggerAction({
    matches: "Note.Delete"
  })
  .cancelAction("cancelDeleteNote", "Ok - canceled note deletion.", {
    matches: /^(cancel|nevermind)/i
  });

// Read note dialog
bot
  .dialog("ReadNote", [
    function(session, args, next) {
      if (noteCount(session.userData.notes) > 0) {
        // Resolve and store any Note.Title entity passed from LUIS.
        var title;
        var intent = args.intent;
        var entity = builder.EntityRecognizer.findEntity(
          intent.entities,
          "Note.Title"
        );
        if (entity) {
          // Verify it's in our set of notes.
          title = builder.EntityRecognizer.findBestMatch(
            session.userData.notes,
            entity.entity
          );
        }

        // Prompt for note name
        if (!title) {
          builder.Prompts.choice(
            session,
            "Which note would you like to read?",
            session.userData.notes
          );
        } else {
          next({ response: title });
        }
      } else {
        session.endDialog("No notes to read.");
      }
    },
    function(session, results) {
      session.endDialog(
        "Here's the '%s' note: '%s'.",
        results.response.entity,
        session.userData.notes[results.response.entity].text
      );
    }
  ])
  .triggerAction({
    matches: "Note.ReadAloud"
  })
  .cancelAction("cancelReadNote", "Ok.", {
    matches: /^(cancel|nevermind)/i
  });

// Helper function to count the number of notes stored in session.userData.notes
function noteCount(notes) {
  var i = 0;
  for (var name in notes) {
    i++;
  }
  return i;
}
