// some of the code taken from aeongdesu & original emnity plugin by spinfal (most of the code is from spinfal)
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta";
import { findByProps } from "@vendetta/metro"
import Settings from "./settings";
import { storage } from '@vendetta/plugin';

const MessageActions = findByProps("sendMessage", "receiveMessage")
const Channels = findByProps('getLastSelectedChannelId')
const BotMessage = findByProps('createBotMessage')
const Avatars = findByProps("BOT_AVATARS")

function sendReply(channelID, content, embed) {
    const channel = channelID ?? Channels?.getChannelId?.();
    const msg = BotMessage.createBotMessage({ channelId: channel, content: '', embeds: embed});
    msg.author.username = 'Astolfo';
    msg.author.avatar = 'Astolfo';
    Avatars.BOT_AVATARS.Astolfo = 'https://i.pinimg.com/736x/50/77/1f/50771f45b1c015cfbb8b0853ba7b8521.jpg';
  
    if (typeof content === 'string') {
      msg.content = content;
    } else {
      Object.assign(msg, content);
    }
  
    MessageActions.receiveMessage(channel, msg);
}


let commands = []

commands.push(registerCommand({
    name: "femboy",
    displayName: "femboy",
    description: "Get an image of a femboy",
    displayDescription: "Get an image of a femboy",
    options: [{
        name: "nsfw",
        displayName: "nsfw",
        description: "Get the result from r/femboys instead of r/femboy (NSFW)",
        displayDescription: "Get the result from r/femboys instead of r/femboy (NSFW)",
        required: false,
        type: 5
    },{
        name: "silent",
        displayName: "silent",
        description: "Makes it so only you can see the message.",
        displayDescription: "Makes it so only you can see the message.",
        required: false,
        type: 5
    }],
    applicationId: "-1",
    inputType: 1,
    type: 1,
    execute: async (args, ctx) => {
        try {
            //some code taken from emnity gotfemboys plugin by spinfal & was modified with the help of meqativ 
            const nsfw = args.find(arg => arg.name === "nsfw")?.value
            const silent = args.find(arg => arg.name === "silent")?.value
            let response = await fetch("https://www.reddit.com/r/femboy.json").then(res => res.json());
            if (!ctx.channel.nsfw_ && nsfw && storage.nsfwwarn && !(silent ?? true)) {
                sendReply(ctx.channel.id, "This channel is not marked as NSFW\n(You can disable this check in plugin settings)", [])
                return
            }
            if (nsfw) {response = await fetch("https://www.reddit.com/r/femboys.json").then(res => res.json());}
            response = response.data?.children?.[Math.floor(Math.random() * response.data?.children?.length)]?.data;
            let image = String(response?.url_overridden_by_dest ?? response?.url)  
            
            // embed from the emnity gotfemboys plugin by spinfal
            const embed = {
                type: "rich",
                title: response?.title,
                url: `https://reddit.com${response?.permalink}`,
                image: {
                  proxy_url: response?.url_overridden_by_dest.replace(/.gifv$/g,".gif") ?? response?.url.replace(/.gifv$/g,".gif"),
                  url: response?.url_overridden_by_dest?.replace(/.gifv$/g,".gif") ?? response?.url?.replace(/.gifv$/g,".gif"),
                  width: response?.preview?.images?.[0]?.source?.width,
                  height: response?.preview?.images?.[0]?.source?.height
                },
                footer: {
                  text: `Posted by u/${response?.author} in r/${response?.subreddit}`
                },
                color: "0xff0069"
              }

            if (silent ?? true) {
                sendReply(ctx.channel.id, "", [embed])
            } else {
                MessageActions.sendMessage(ctx.channel.id, {
                    content: image
                })
            }
            

        } catch (err) {
            logger.log(err);
            sendReply(ctx.channel.id, "ERROR !!!!!!!!!!!! 😭😭😭 Check debug logs!! 🥺🥺🥺",[])
        }
    }
}))

export const settings = Settings;

export const onLoad = () => {
    storage.nsfwwarn ??= true
}
 
export const onUnload = () => {
    for (const unregisterCommands of commands) unregisterCommands()
}