const Discord = require('discord.js')

module.exports = {
    name: "resume",
    description: "resume",
    aliases: ["resume", "unpause"],
    inVoiceChannel: true,

    async run (client, message, args) {
        const menu = require('../modules/menu.js')
        const cmdlog = new menu.cmdlog()
        cmdlog.log(message)
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | Bạn phải ở trong một kênh nói`);
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} | Bạn phải ở cùng kênh nói với Bot`); 

        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | Chả có gì đang phát cả`)
        if (queue.paused) {
            queue.resume()
            message.channel.send(`${client.emotes.play} | Tiếp tục phát`)
        } else message.channel.send(`${client.emotes.play} | Bạn đang phát rồi`)
    }
}