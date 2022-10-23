const luachon = ["bua", "lua", "keo", "ran", "nguoi", "cay", "soi", "botbien", "bao", "khongkhi", "nuoc", "rong", "acquy", "samchop", "sung"]
const name = ["Búa", "Lửa", "Kéo", "Rắn", "Người", "Cây", "Sói", "Bọt biển", "Bao", "Không Khí", "Nước", "Rồng", "Ác quỷ", "Sấm chớp", "Súng"]
const Discord = require("discord.js")
const { ButtonStyle, ComponentType} = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
function demsansang(readylist) {
    var dem = 0;
    for (let i = 0; i < readylist.length; i++) {
        if (readylist[i] == true) {dem++}
    }    
    return dem;
}
function diem(vt1, vt2, luachon, hs) { //hs=7, Tính điểm cho vt1 
        //Hòa  
        if (vt1 == vt2) {return 1}
        //Thắng
        else if (vt2-vt1<=hs) {return 2} //Theo quy tắc
        else return 0; //Bất quy tắc = Thua
}

module.exports = {
    name: "oantuti",
    description: "keo bua bao",

    async run(client, message, args) {
        if (message.mentions.users.size < 2) return message.reply(`Trò chơi yêu cầu tối thiểu 2 người tham gia chơi`)
        //Cấu hình
        let readylist = []
        let ready = []
        var player = []
        var savelist = []
        var savetext = []
        var save = []
        var score = []
        var scoredata = []
        var scoretext = []
        var ingame = false;
        var ready_time=60; //Thời gian chờ Ready (s)
        var play_time=90; //Thời gian để người chơi chọn
        var kt=false; //Điều kiện kết thúc trò chơi
        var timeout_started=false; //Timeout Play đã bắt đầu chưa? (Config ở phần Timeout Play)

        let i = 0
        message.mentions.users.forEach(user => {
            player[i] = user
            i++
        });
        
        let j=0;
        for (i = 0; i < message.mentions.users.size; i++) {
            //i=j-1
            readylist[j] = false 
            savelist[j]= false
            ready[j] = `${player[j]} - ${readylist[j] ? "✅" : "❌"}`
            savetext[j] = `${player[j]} - ${readylist[j] ? "✅" : "❌"}`
            save[j] = -1
            score[j] = 0
            scoredata[j] = [j, score[j], 0, 0, 0]
            scoretext[j] = ""
            j++
        }

        //chuẩn bị các biến
        var list = new Discord.EmbedBuilder()
            .setTitle(ready_time + "s để người chơi sẵn sàng...")
            .setDescription(`Danh sách người chơi:
            ${ready.join("\n")}`)
            .setAuthor({name: 'Oản tù tì Phiên bản Mở rộng'})
            .setFooter({text: `${demsansang(readylist)}/${readylist.length} sẵn sàng`})
            .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
            .setColor("Blue")
            .setTimestamp()
        let readybutton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ready')
                .setLabel('Sẵn sàng!')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('unready')
                .setLabel('Hủy sẵn sàng')
                .setStyle(ButtonStyle.Secondary),
        );
        let luachon1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('bua')
                .setLabel('Búa')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('lua')
                .setLabel('Lửa')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('keo')
                .setLabel('Kéo')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('ran')
                .setLabel('Rắn')
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId('nguoi')
                .setLabel('Người')
                .setStyle(ButtonStyle.Primary),
        );
        let luachon2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('cay')
                .setLabel('Cây')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('soi')
                .setLabel('Sói')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('botbien')
                .setLabel('Bọt Biển')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('bao')
                .setLabel('Bao')
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId('khongkhi')
                .setLabel('Không Khí')
                .setStyle(ButtonStyle.Primary),
        );
        let luachon3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('nuoc')
                .setLabel('Nước')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('rong')
                .setLabel('Rồng')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('acquy')
                .setLabel('Ác Quỷ')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('samchop')
                .setLabel('Sấm Chớp')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('sung')
                .setLabel('Súng')
                .setStyle(ButtonStyle.Primary),
        );

        
        //Phần ready và đợi
            message.reply({embeds : [list], components : [readybutton]}).then((msg)=> {
            const filter = (interaction) => {
                for (let k = 0; k < player.length; k++) {
                    if (interaction.user.id == player[k].id) return true;
                }
            }
            const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button, filter})
            setTimeout(function() {
                if (demsansang(readylist) !== readylist.length) {
                    var cancelbyready = new Discord.EmbedBuilder()
                        .setTitle(`Trò chơi bị hủy do có người chơi chưa sẵn sàng`)
                        .setDescription(`Danh sách người chơi:
                        ${ready.join("\n")}`)
                        .setAuthor({name: 'Oản tù tì Phiên bản Mở rộng'})
                        .setFooter({text: `${demsansang(readylist)}/${readylist.length} sẵn sàng`})
                        .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                        .setColor("Red")
                        .setTimestamp()
                    msg.edit({embeds : [cancelbyready], components : []})
                    kt=true;
                    return;
                }
            }, ready_time*1000);
            collector.on("collect", interaction => {
                interaction.deferUpdate();
             //Ready
                if (kt == true) return collector.stop();
                if (interaction.customId === 'ready') {
                    var find;    
                    for (let k = 0; k < player.length; k++) {
                        if (interaction.user.id == player[k].id) {find = k}
                    }
                    readylist[find] = true
                    ready[find] = `${player[find]} - ${readylist[find] ? "✅" : "❌"}`
                    var list = new Discord.EmbedBuilder()
                        .setTitle(ready_time+"s để người chơi sẵn sàng...")
                        .setDescription(`Danh sách người chơi:
                        ${ready.join("\n")}`)
                        .setAuthor({name: 'Oản tù tì Phiên bản Mở rộng'})
                        .setFooter({text: `${demsansang(readylist)}/${readylist.length} sẵn sàng`})
                        .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                        .setColor("Blue")
                        .setTimestamp()
                    msg.edit({embeds : [list]})
                }
                if (kt == true) return collector.stop();
                if (interaction.customId === 'unready') {
                    var find;    
                    for (let k = 0; k < player.length; k++) {
                        if (interaction.user.id == player[k].id) {find = k}
                    }
                    readylist[find] = false 
                    ready[find] = `${player[find]} - ${readylist[find] ? "✅" : "❌"}`
                    var list = new Discord.EmbedBuilder()
                        .setTitle(ready_time + "s để người chơi sẵn sàng...")
                        .setDescription(`Danh sách người chơi:
                        ${ready.join("\n")}`)
                        .setAuthor({name: 'Oản tù tì Phiên bản Mở rộng'})
                        .setFooter({text: `${demsansang(readylist)}/${readylist.length} sẵn sàng`})
                        .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                        .setColor("Blue")
                        .setTimestamp()
                    msg.edit({embeds : [list]})
                }
                if (kt == true) return collector.stop();
             //Wait 15s
                if (demsansang(readylist) == readylist.length && kt==false) {
                    if (ingame == false) {
                        var list = new Discord.EmbedBuilder()
                        .setAuthor({name: "Oản tù tì phiên bản Mở rộng"})
                        .setTitle(`Trò chơi sẽ bắt đầu sau 15s`)
                        .setDescription(`**Luật chơi:**
                        Thắng sẽ được 2 điểm
                        Hòa sẽ được 1 điểm
                        Thua sẽ không được điểm
                        
                        ***Chú ý: Bạn không thể chọn 2 lần**`)
                        .setImage(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                        .setColor("Yellow")
                        .setTimestamp()
                        msg.edit({embeds : [list], components : []})
                    }
                        setTimeout(function() {
                            if (kt == true) return collector.stop();
                            if (timeout_started == false) {
                                var start = new Discord.EmbedBuilder()
                                    .setAuthor({name: "Oản tù tì phiên bản Mở rộng"})
                                    .setTitle(`Oản tù tì, ra cái gì, ra cái...`)
                                    .setDescription(`**Luật chơi:**
                                Thắng sẽ được 2 điểm
                                Hòa sẽ được 1 điểm
                                Thua sẽ không được điểm
                                
                                ***Chú ý: Bạn không thể chọn 2 lần**`)
                                    .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                                    .setColor("Yellow")
                                    .setTimestamp()
                                    .setFooter({text: `Chưa có ai đã chọn | ${play_time}s để chọn`})
                                msg.edit({embeds : [start], components : [luachon1,luachon2,luachon3]});
                                timeout_started = true;
                                setTimeout(function() { //Timeout Play
                                    if (demsansang(savelist) !== savelist.length) {
                                        var cancelbytimeout = new Discord.EmbedBuilder()
                                            .setTitle(`Trò chơi bị hủy do có người chơi chưa chọn`)
                                            .setDescription(`Danh sách người chơi đã chọn: \n${savetext.join("\n")}`)
                                            .setAuthor({name: 'Oản tù tì Phiên bản Mở rộng'})
                                            .setFooter({text: `${demsansang(readylist)}/${readylist.length} sẵn sàng`})
                                            .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                                            .setColor("Red")
                                            .setTimestamp()
                                        msg.edit({embeds : [cancelbytimeout], components : []})
                                        kt=true;
                                        return;
                                    }
                                }, play_time*1000);
                                return;
                            }
                        },15000)
                    ingame = true;
                 //Phần chính
                 if (kt == true) return collector.stop();
                    if (luachon.includes(interaction.customId) && kt==false) {
                        var lcid = luachon.indexOf(interaction.customId)
                        var findk;    
                        if (kt == true) return collector.stop();
                        for (let k = 0; k < player.length; k++) {
                            if (interaction.user.id == player[k].id) {findk = k}
                        }
                        if (savelist[findk] == false) {
                            savelist[findk] = true 
                            savetext[findk] = `${player[findk]} - ✅`
                            save[findk] = lcid;
                        } // Chống chọn 2 lần
                        if (kt == true) return collector.stop();
                        var start = new Discord.EmbedBuilder()
                            .setAuthor({name: "Oản tù tì phiên bản Mở rộng"})
                            .setTitle(`Oản tù tì, ra cái gì, ra cái...`)
                            .setDescription(`Danh sách người chơi đã chọn:
                            ${savetext.join("\n")}`)
                            .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                            .setColor("Yellow")
                            .setFooter({text: `${demsansang(savelist)}/${savelist.length} đã chọn | ${play_time}s để chọn`})
                            .setTimestamp()
                        if (kt == true) return collector.stop();
                        msg.edit({embeds : [start]})
                        if (kt == true) return collector.stop();
                        if (demsansang(savelist) == savelist.length) {
                         //Tính điểm
                            for (let i = 0; i < save.length; i++) {
                                for (let j = 0; j < save.length; j++) {
                                    if (i !== j) {
                                        score[i] = score[i] + diem(save[i], save[j], luachon, 7);
                                        scoredata[i][1] = score[i];
                                        scoredata[i][0] = i; //Đặt lại thứ tự do bên trên đặt sai
                                        if (diem(save[i], save[j], luachon, 7) == 2) {scoredata[i][2]++}
                                        else if (diem(save[i], save[j], luachon, 7) == 1) {scoredata[i][3]++}
                                        else if (diem(save[i], save[j], luachon, 7) == 0) {scoredata[i][4]++}
                                    }
                                }
                            }
                            if (kt == true) return collector.stop();
                         //Sắp xếp Rank
                            var tam = [];
                            for (i = 0; i < scoredata.length - 1; i++) {
                                for (j = i + 1; j < scoredata.length; j++) {
                                    if (scoredata[i][1] < scoredata[j][2]) {
                                        tam = scoredata[i];
                                        scoredata[i] = scoredata[j];
                                        scoredata[j] = tam;
                                        
                                    }
                                }
                            }
                            if (kt == true) return collector.stop();
                            for (i = 0; i < scoredata.length; i++) {
                                if (i==0) {scoretext[i] = `**🥇Hạng ${i+1} : ${player[scoredata[i][0]]} : ${scoredata[i][1]} điểm (${scoredata[i][2]}/${scoredata[i][3]}/${scoredata[i][4]}) ** (Chọn *${name[save[scoredata[i][0]]]}*)`}
                                else if (i==1) {scoretext[i] = `**🥈Hạng ${i+1} : ${player[scoredata[i][0]]} : ${scoredata[i][1]} điểm (${scoredata[i][2]}/${scoredata[i][3]}/${scoredata[i][4]})** (Chọn *${name[save[scoredata[i][0]]]}*)`}
                                else if (i==2) {scoretext[i] = `**🥉Hạng ${i+1} : ${player[scoredata[i][0]]} : ${scoredata[i][1]} điểm (${scoredata[i][2]}/${scoredata[i][3]}/${scoredata[i][4]})** (Chọn *${name[save[scoredata[i][0]]]}*)`}
                                else {scoretext[i] = `${i+1}. ${player[scoredata[i][0]]} : ${scoredata[i][1]} điểm (${scoredata[i][2]}/${scoredata[i][3]}/${scoredata[i][4]}) (Chọn *${name[save[scoredata[i][0]]]}*)`}
                            }
                            if (kt == true) return collector.stop();
                            var end = new Discord.EmbedBuilder()
                                .setAuthor({name: "Oản tù tì phiên bản Mở rộng"})
                                .setTitle(`Trò chơi kết thúc!`)
                                .setDescription(`Danh sách điểm:
                                ${scoretext.join("\n")}`)
                                .setThumbnail(`https://photo-cms-viettimes.zadn.vn/w666/Uploaded/2021/firns/2019_03_11/7ea25208ab4942171b58.jpg`)
                                .setColor("Green")
                                .setTimestamp()
                            msg.edit({embeds : [end], components : []})
                            if (kt == true) return collector.stop();
                            kt = true; // Anti-Repeat
                            if (kt == true) return collector.stop();
                        }
                        if (kt == true) return collector.stop();
                    }
                    if (kt == true) return collector.stop();
                }
                if (kt == true) return collector.stop();
            })
            if (kt == true) return collector.stop();
        })
        if (kt == true) return; //End
    }
}