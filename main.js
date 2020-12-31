require('dotenv').config()
const Twit = require('twit')
const Discord = require('discord.js');
const { SSL_OP_NO_TLSv1_1 } = require('constants');
const client = new Discord.Client();
fs = require('fs');
let id_todiscord=1;

let array_following = [];

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})
client.login(process.env.DISCORD_TOKEN);
console.log("login discord + tweet success")
T.get('friends/ids', {id:process.env.TWITTER_USER_ID }, (err, data)=>{
  if(err)
    console.log(err);
  else
    array_following = Object.values(data.ids)
    //console.log(array_following)
    // fs.writeFile('list_following.txt', array_following, (err)=>{
    //   console.log("done save file")
    // });
})

client.once('ready', () => {

  var stream = T.stream('statuses/filter',
                        {track: ['hackathon', 'early supporter', 'testnet', 'Challenge', 'Apply before'], language: 'en' })
  stream.on('tweet', function (tweet) {
    //...
    //console.log(tweet);
    var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
    try {
        let channel = client.channels.fetch(process.env.DISCORD_CHANNEL_ID_HACKATHON).then(channel => {
          channel.send(url)
          id_todiscord += 1;
          console.log("Send to discord "+ id_todiscord)
        }).catch(err => {
          console.log(err)
        })
    } catch (error) {
            console.error(error);
    }
  })
})
