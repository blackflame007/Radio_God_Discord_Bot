import axios from 'axios';
import Discord from 'discord.js';
const opusscript = require('opusscript');
import { TOKEN, dirble_key, prefix } from './constants.js';

const client = new Discord.Client();

global.servers = {};

const samplingRate = 48000;
const frameDuration = 20;
const channels = 2;

client.on('ready', () => {
  console.log(
    `Logged in as ${client.user.tag} (${client.user.id} on ${
      client.guilds.size
    })`
  );
  client.user.setActivity(
    `${prefix}help | Active Servers ${client.guilds.size}`
  );
});

client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!msg.guild.voiceConnection) {
    if (!servers[msg.guild.id]) {
      servers[msg.guild.id] = { queue: [] };
    }
    if (command === 'join') {
      const server = servers[msg.guild.id];
      msg.member.voice.channel
        .join()
        .then(() => {
          msg.channel.send('Successfully Joined!');
        })
        .catch(error => {
          console.log(error);
        });
    }
  } else {
    msg.reply('You must be in a voice channel to summon me!');
  }
  if (msg.member.voiceChannel) {
    if (!msg.guild.voiceConnection) {
      if (command === 'search') {
        axios
          .post(`http://api.dirble.com/v2/search?token=${dirble_key}`, {
            query: args[0]
          })
          .then(response => {
            msg.channel.send(`Found ${response.data[0].name}`);
            console.log(response.data[0]);
          })
          .catch(error => {
            msg.channel.send('Query is missing');
            console.log(error);
          });
      }
    }
  }

  if (msg.guild.voiceConnection) {
    if (command === 'leave') {
      msg.guild.voiceConnection.disconnect();
    } else {
      msg.reply('I must be in a voice channel to leave');
    }
  }

  if (command === 'ping') {
    const then = Date.now();
    msg.channel.send('pinging ... ').then(m => {
      m.edit(`Pong! it took ${Date.now() - then}ms to send that message!`);
    });
  }
});

client.login(TOKEN);
