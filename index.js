import axios from 'axios';
import Discord from 'discord.js';
import { TOKEN, dirble_key, prefix } from './constants.js';
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === 'search') {
    axios
      .post(`http://api.dirble.com/v2/search?token=${dirble_key}`, {
        query: 'KLOS'
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});

client.login(TOKEN);
