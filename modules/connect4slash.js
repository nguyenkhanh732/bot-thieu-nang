const discord = require('discord.js')

class ConnectFour {

    constructor() {
        this.gameEmbed = null
    }

    startGame (client, interaction, option) {
        var challenger = interaction.user;
        try {
            var oppenent = client.users.cache.find(user => user.id === `${option[0].value}`);
        } catch {
            return interaction.reply({content: "Không rõ đối thủ", ephemeral: true})
        }
        

        if(!oppenent || challenger === oppenent) return interaction.reply({content: `**Bạn định chơi một mình sao?**`, ephemeral: true})
        if (oppenent.bot) return interaction.reply({content: `**Bạn định chơi với Bot sao?**`, ephemeral: true})
        const board = [
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ];

        var ended=false;
        const renderBoard = (board) => {
            let tempString = "";
            for (const boardSection of board) {
                tempString += `${boardSection.join("")}\n`;
            }

            tempString = tempString.concat("1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣");
            return tempString;
        }

        const initialState = renderBoard(board);
        interaction.reply(`Đã tạo trận đấu Connect4 giữa **${challenger} và ${oppenent}**. Vui lòng kiểm tra tin nhắn bên dưới.`)

        const gameData = [
            { member: challenger, playerColor: "🔴" },
            { member: oppenent, playerColor: "🟡"}
        ]

        const initial = new discord.MessageEmbed()
            .setTitle(`🔴 Lượt của ${interaction.user.username}`)
            .setDescription(initialState)
            .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
            .setTimestamp()
        interaction.channel.send({embeds : [initial]}).then(gameMessage => {

            gameMessage.react("1️⃣")
            gameMessage.react("2️⃣")
            gameMessage.react("3️⃣")
            gameMessage.react("4️⃣")
            gameMessage.react("5️⃣")
            gameMessage.react("6️⃣")
            gameMessage.react("7️⃣")
            gameMessage.react("🏳️")
    
            const gameFilter = (reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣","🏳️"].includes(reaction.emoji.name) && (user.id === oppenent.id || user.id === challenger.id);
    
            const gameCollector = gameMessage.createReactionCollector({ filter: gameFilter });
    
            let player = 0;
    
            const checkFour = (a, b, c, d) => (a === b) && (b === c) && (c === d) && (a !== "⚪");
    
            const horizontalCheck = () => {
    
                for (let i = 0; i < 6; i++) {
    
                    for (let j = 0; j < 4; j++) {
                        if(checkFour(board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3])) return [
                            board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]
                        ];
                    }
                }
            }
    
            const verticalCheck = () => {
                for (let j = 0; j < 7; j++) {
                    for (let i = 0; i < 3; i++) {
    
                        if(checkFour(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) return [
                            board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]
                        ]
                    }
                }
            }
    
            const diagonal1 = () => {
                for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                        if(checkFour(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3])) return [
                            board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]
                        ]
                    }
                }
            }
    
            const diagonal2 = () => {
                for (let col = 0; col < 4; col++) {
                    for (let row = 5; row > 2; row--) {
                        if(checkFour(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3])) return [
                            board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]
                        ]
                    }
                }
            }
    
            const tieCheck = () => {
                let count = 0;
                for (const el of board) {
                    for (const string of el) {
                        if(string !== "⚪") count++;
                    }
                }
                if(count === 42) return true;
                else return false;
            }
    
            const checks = [horizontalCheck, verticalCheck, diagonal1, diagonal2];
    
            gameCollector.on("collect", (reaction, user) => {
    
                reaction.message.reactions.cache.get(reaction.emoji.name).users.remove(user.id);
    
                if(user.id === gameData[player].member.id) {
    
                    const openSpaces = [];
    
                    switch (reaction.emoji.name) {
                        case "1️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][0] === "⚪") openSpaces.push({ i, j: 0});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "2️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][1] === "⚪") openSpaces.push({ i, j: 1});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "3️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][2] === "⚪") openSpaces.push({ i, j: 2});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "4️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][3] === "⚪") openSpaces.push({ i, j: 3});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "5️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][4] === "⚪") openSpaces.push({ i, j: 4});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "6️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][5] === "⚪") openSpaces.push({ i, j: 5});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                        case "7️⃣":
                            for (let i = 5; i > -1 ; i--) {
                                if(board[i][6] === "⚪") openSpaces.push({ i, j: 6});
                            }
                            if(openSpaces.length == 0) return interaction.channel.send(`**${gameData[player].member}, cột đã đầy**`).then(msg1 => msg1.delete({timeout: 10000}))
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                    }
                    
                    if(tieCheck()) {
                        gameMessage.reactions.removeAll()
                        const TieEmbed = new discord.MessageEmbed()
                        .setTitle(`HÒA!`)
                        .setDescription(renderBoard(board))
                        .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
                        .addField('Lí do:', `Hòa theo luật`, true)
                        .setTimestamp()
                        gameCollector.stop("Hòa")
                        ended=true;
                        return gameMessage.edit({embeds : [TieEmbed]})
                    }
    
                    for (const func of checks) {
    
                        const data = func();
                        if(data) {
                            gameMessage.reactions.removeAll()
                            
                            const WinEmbed = new discord.MessageEmbed()
                            .setTitle(`${gameData[player].playerColor} ${gameData[player].member.username} dành chiến thắng!`)
                            .setDescription(renderBoard(board))
                            .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
                            .addField('Lí do:', `${gameData[player].member.username} thắng theo luật`, true)
                            .setTimestamp()
                            gameCollector.stop(`${gameData[player].member.id} thắng theo luật`);
                            ended=true;
                            return gameMessage.edit({embeds : [WinEmbed]})
                        }
                    }

                    player = (player + 1) % 2;
                    switch (reaction.emoji.name) {    
                        case "🏳️": {
                            var nguoithuacuoc = reaction.users.cache.find((user) => !user.bot).id
                            let kt;
                            if (gameData[0].member.id == nguoithuacuoc) {var winner = gameData[1].member.username; kt=1;}
                            else {var winner = gameData[0].member.username; kt=0;}
                            
                            gameMessage.reactions.removeAll()
                            const WinEmbed = new discord.MessageEmbed()
                            .setTitle(`${gameData[kt].playerColor} ${winner} dành chiến thắng!`)
                            .setDescription(renderBoard(board))
                            .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
                            .addField('Lí do:', `${winner} thắng do đối phương bỏ cuộc`, true)
                            .setTimestamp()
                            ended=true;
                            gameCollector.stop(`${winner} thắng do đối phương bỏ cuộc`);
                            return gameMessage.edit({embeds : [WinEmbed]})
                        }
                    }
                    if (ended==true) return;

                    const newEmbed = new discord.MessageEmbed()
                    .setTitle(`${gameData[player].playerColor} Lượt của ${gameData[player].member.username}`)
                    .setDescription(renderBoard(board))
                    .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
                    .setTimestamp()
                    gameMessage.edit({embeds: [newEmbed]});
                } else {
                switch (reaction.emoji.name) {    
                    case "🏳️": {
                        var nguoithuacuoc = reaction.users.cache.find((user) => !user.bot).id
                        let kt;
                        if (gameData[0].member.id == nguoithuacuoc) {var winner = gameData[1].member.username; kt=1;}
                        else {var winner = gameData[0].member.username; kt=0;}
                        
                        gameMessage.reactions.removeAll()
                        const WinEmbed = new discord.MessageEmbed()
                        .setTitle(`${gameData[kt].playerColor} ${winner} dành chiến thắng!`)
                        .setDescription(renderBoard(board))
                        .setFooter(`${gameData[0].playerColor}${challenger.username} vs ${gameData[1].playerColor}${oppenent.username}`)
                        .addField('Lí do:', `${winner} thắng do đối phương bỏ cuộc`, true)
                        .setTimestamp()
                        ended=true;
                        gameCollector.stop(`${winner} thắng do đối phương bỏ cuộc`);
                        return gameMessage.edit({embeds : [WinEmbed]})
                    }
                }
            } if (ended==true) return;
            })
            if (ended==true) return;
        })
        if (ended==true) return;
    }
}

module.exports = ConnectFour;