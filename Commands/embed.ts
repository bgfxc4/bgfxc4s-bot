import * as Discord from "discord.js";

const COLORS = {
    red: 0xe74c3c,
    yellow: 0xf1c40f,
    green: 0x2ecc71,
};

export function error(chan:Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel | undefined, cont:string, title:string, callback?: () => void) {
    var message:any;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.red);
    emb.setDescription(cont);
    if (title) {
        emb.setTitle(title);
    }
    chan?.send("", emb).then((m) => {
        message = m;
    }).then(callback)
	.catch(() => {
		error(chan, `Something went wrong sending the message.`, "");
	});
    return message;
}

export function info(chan:Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel | undefined, cont:string, title:string, callback?: () => void) {
    var message:any;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.yellow);
    emb.setDescription(cont);
    if (title) {
        emb.setTitle(title);
    }
    chan?.send("", emb).then((m) => {
        message = m;
    }).then(callback)
	.catch(() => {
		error(chan, `Something went wrong sending the message.`, "");
	});
    return message;
}

export function message(chan:Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel | undefined, cont:string, title:string, callback?: () => void) {
    var message:any;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.green);
    emb.setDescription(cont);
    if (title) {
        emb.setTitle(title);
    }
    chan?.send("", emb).then((m) => {
        message = m;
    }).then(callback)
	.catch(() => {
		error(chan, `Something went wrong sending the message.`, "");
	});
    return message;
}

export function message_with_link(chan:Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel | undefined, label:string, link:string, title:string) {
    var message:any;
    var emb = new Discord.MessageEmbed();
    emb.setColor(COLORS.green);
    emb.setDescription("[" + label + "](" + link + ")");
    if (title) {
        emb.setTitle(title);
    }
    chan?.send("", emb).then((m) => {
        message = m;
    });
    return message;
}
