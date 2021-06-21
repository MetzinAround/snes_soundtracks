console.log("SNES Soundtracks booting up");

//making sure npm run develop works
if (process.env.NODE_ENV === "develop") {
    require("dotenv").config();
};

//rules for node-schedule
var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 1;
  rule.hour = 10;
  rule.minute = 30;
  rule.tz = "Etc/GMT+4";

//array to pull soundtracks from
var soundtrackArray = ["https://www.youtube.com/watch?v=jV7YxfwT4r0", "https://www.youtube.com/watch?v=-QsysJwzod4", "https://youtu.be/e8tg8G2iD3U", "https://www.youtube.com/watch?v=tBWl9p0fH28&", "https://www.youtube.com/watch?v=oRxgYC5zrV4", "https://youtu.be/c68MrLSXcZ4", "https://youtu.be/85u34SUh05Y", "https://www.youtube.com/watch?v=wpchBo75N68", "https://www.youtube.com/watch?v=_4EjGXRDOH0", "https://www.youtube.com/watch?v=438nMbWncRU", "https://www.youtube.com/watch?v=UyNufyV3VCo", "https://www.youtube.com/watch?v=rJJk9Zk2h_U", "https://www.youtube.com/watch?v=A4YeAdyYq4M", "https://www.youtube.com/watch?v=_-XNMr3x0l4", "https://www.youtube.com/watch?v=sySkD2Nfwok", "https://www.youtube.com/watch?v=jUbU5tHfyCs", "https://www.youtube.com/watch?v=dIKdZ2827rM",];
var soundtrackArrayLength = soundtrackArray.length;


// Create an Twitter object to connect to Twitter API
var Twit = require('twit');

// Pulling keys from another file
var config = require('./config.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// Setting up a user stream
var stream = T.stream('statuses/filter', { track: '@SnesSoundtracks' });

// Now looking for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', pressStart);

console.log(soundtrackArrayLength)
// Here a tweet event is triggered!
function pressStart(tweet) {

    let soundtrackArrayElement = Math.floor(Math.random() * soundtrackArrayLength);

    var id = tweet.id_str;
    var text = tweet.text;
    var name = tweet.user.screen_name;

    let regex = /(please)/gi;

    let playerOne = text.match(regex) || [];
    let playerTwo = playerOne.length > 0;

    //this helps with errors, so you can see if the regex matched and if playerTwo is true or false
    console.log(playerOne);
    console.log(playerTwo);
    

    // checks text of tweet for mention of SNESSoundtracks
    if (text.includes('@SnesSoundtracks') && playerTwo === true) {

        // Start a reply back to the sender
        let replyText = ("@" + name + " Here you go!" + soundtrackArray[soundtrackArrayElement]);

        // Post that tweet
        T.post('statuses/update', { status: replyText, in_reply_to_status_id: id }, gameOver);

    } else {
        console.log("uh-uh-uh, they didn't say the magic word.");
    };

    function gameOver(err, reply) {
        if (err) {
            console.log(err.message);
            console.log("Game Over");
        } else {
            console.log('Tweeted: ' + reply.text);
        }
    };
}

function pressSelect() {

    let soundtrackArrayElement2 = Math.floor(Math.random() * soundtrackArrayLength);

    let weeklyReplyText = soundtrackArray[soundtrackArrayElement2] + " Here's your soundtrack for the week!";
    T.post('statuses/update', { status: weeklyReplyText }, gameOver2);

    function gameOver2(err, reply) {
        if (err) {
            console.log(err.message);
            console.log("Game Over");
        } else {
            console.log('Tweeted: ' + reply.text);
        }
    }
}

 const job1 = schedule.scheduleJob(rule, pressSelect);

 job1.on("Every Day Tweet", pressSelect);





