const { MessageEmbed } = require("discord.js")
const moment = require("moment")

const devs = 'RisuOverseaProject - @yourShiroko';
const idev = 'https://cdn.glitch.me/43c97a00-a2f0-421c-ac5c-5f54f3a11ed5%2Fbronya-rich.png?v=1637488038424';

module.exports = {
  name: "user-info",
  categories: "info",
  aliases: ["whois", "user"],
  usage: "`.<commandName/Aliases> <@user>` or `.<commandName/Aliases>` to see your information",
  description: "get advance stats of given person or yourself",
  run: async (client, message, args) => {


    let user;

    if (!args[0]) {
      user = message.member;
    } else {


   


      user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(err => { return message.channel.send(":x: Unable to find this Person") })
    }

    if (!user) {
      return message.channel.send( new MessageEmbed()
                                  .setColor(process.env.ERROR)
                                  .setAuthor('Warning 404: an error occurred')
                                  .setDescription("unable to find that user, command cancelled")
                                  .setFooter(devs, idev)
                                 )
    }


    //OPTIONS FOR STATUS

    let stat = {
      online: "https://emoji.gg/assets/emoji/9166_online.png",
      idle: "https://emoji.gg/assets/emoji/3929_idle.png",
      dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
      offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
    }

    //NOW BADGES
    let badges = await user.user.flags
    badges = await badges ? badges.toArray() : ["None"]

    let newbadges = [];
    badges.forEach(m => {
      newbadges.push(m.replace("_", " "))
    })

    let embed = new MessageEmbed()
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))

    //ACTIVITY
    let array = []
    if (user.user.presence.activities.length) {

      let data = user.user.presence.activities;

      for (let i = 0; i < data.length; i++) {
        let name = data[i].name || "None"
        let xname = data[i].details || "None"
        let zname = data[i].state || "None"
        let type = data[i].type

        array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``)

        if (data[i].name === "Spotify") {
          embed.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace("spotify:", "")}`)
        }

        embed.setDescription(array.join("\n"))

      }
    }

      //EMBED COLOR BASED ON member
      embed.setColor(user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor)

      //OTHER STUFF 
      embed.setAuthor(user.user.tag)

      //CHECK IF USER HAVE NICKNAME
      if (user.nickname !== null) embed.addField("Nickname", user.nickname)
      embed.addField("Joined at", moment(user.joinedAt).format("LLLL"))
        .addField("Account created at", moment(user.user.createdAt).format("LLLL"))
        .addField("Common information", `**· User ID:** ${user.user.id}\n**· Discriminator:** ${user.user.discriminator}\n**· Bot:** ${user.user.bot}\n**· Deleted user:** ${user.deleted}`)
        .addField("Badges", newbadges.join(", ").toLowerCase() || "None")



      return message.channel.send(embed).catch(err => {
        return message.channel.send("Error : " + err)
      })



    }



}