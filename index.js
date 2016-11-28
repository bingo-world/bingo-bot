var builder = require('botbuilder');
var Game = require('bingo-core');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        session.send("Hello. I am Bingo Bot");
        session.beginDialog('/menu');
    },
    function (session, results) {
        session.endConversation("Goodbye until next time.");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Start a new game|Draw next number|Quit');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/new');
                break;
            case 1:
                session.beginDialog('/draw');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('/new', [
    function (session, args) {
        session.conversationData.game = new Game();
        session.endDialog('A new game has been started.');
    }
]);

bot.dialog('/draw', [
    function (session, args) {
        var combination = session.conversationData.game.nextCombination();
        session.endDialog(combination + ' was drawn.');
    }
]);