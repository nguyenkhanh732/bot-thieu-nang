const Discord = require('discord.js');
const fs = require('fs')
const { MessageActionRow, MessageButton, Message, Client } = require('discord.js');
const math = require('advanced-calculator');
const config = JSON.parse(fs.readFileSync("./config.json"));

module.exports = {
    name: "calc",
    description: "Tính toán phép tính",

    /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    async run (client, message, args) { 
        if (!args[0]) {
            return message.reply(`${config.prefix}calc <Phép tính> (\`sin\`, \`cos\`, \`tan\`, \`ln\`, \`log\`, \`sqrt\`, \`+\`, \`-\`, \`*\`, \`/\`, \`%\`, \`^\`, \`max\`, \`min\``)
        } else {
            try {
                var kq = await math.evaluate(args.slice(0).join(""));
            } catch {
                return message.reply(`Đã xảy ra lỗi khi tính toán. Kiểm tra lại cú pháp phép tính.`)
            }
            try {
                return message.reply(`\`${args.slice(0).join("")}\` = **${kq}**`);
            } catch {
                return message.reply(`Kết quả : **${kq}**`)
            }
        } 
    }
}