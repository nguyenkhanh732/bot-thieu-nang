const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

module.exports = {
    name: "meme",
    description: "Gives you a meme",
    async run (client, message, args){
        

        const subReddits = ["dankmeme", "meme", "memes","dankmemes"]
        const random = subReddits[Math.floor(Math.random() * subReddits.length)]

        const img = await randomPuppy(random);

        const embed = new Discord.EmbedBuilder()
        .setColor("Random")
        .setImage(img)
        .setTitle(`Meme`)
        .setFooter({text: `Từ r/${random}`})
        .setURL(`https://reddit.com/r/${random}`)

        message.reply({embeds : [embed]});
    }
}