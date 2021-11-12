const Discord = require('discord.js');
const { DiscordTogether } = require('discord-together');

module.exports = {
    name: "wordsnack",
    description: "play wordsnack",

    async run (client, message, args){
        
        client.discordTogether = new DiscordTogether(client);
        if(message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'wordsnack').then(async invite => {
                return message.reply(`BẤM VÀO **LIÊN KẾT** ĐÂY : ${invite.code}`)  
            });
        } else message.reply(`Bạn phải ở trong 1 kênh nói thoại`);
    }
}