const Embeds = require('./embed');

module.exports = {

    async cmd_clearChat(msg, args) {

        if (msg.deletable) {
            msg.delete();
        }
    
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            return Embeds.error(msg.channel, "You can't delete messages...");
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return Embeds.error(msg.channel, "Yeah... That's not a number? I also cant't delete 0 messages by teh way", '');
        }

        if (!msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return Embeds.error(msg.channel, "Sorry, I can't delete messages.", '');
        }

        let deleteAmount;

        if (parseInt(args[0] > 100)) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        msg.channel.bulkDelete(deleteAmount, true).then(deleted => Embeds.info(msg.channel, 'I deleted \`${deleted.size}\` messages.', '')).catch(err => Embeds.error(msg.channel, 'Something went wrong!', ''));

    }
}