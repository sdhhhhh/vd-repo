// some of the code taken from aeongdesu & original emnity plugin by spinfal (most of the code is from spinfal)
import { registerCommand } from "@vendetta/commands"
import { logger } from "@vendetta";
import { findByProps } from "@vendetta/metro"
import Settings from "./settings";
import { storage } from '@vendetta/plugin';

const MessageActions = findByProps("sendMessage", "receiveMessage")

let commands = []
const ClydeUtils = findByProps("sendBotMessage")
const Locale = findByProps("Messages")

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
    }],
    applicationId: "-1",
    inputType: 1,
    type: 1,
    execute: async (args, ctx) => {
        try {
            //some code taken from emnity gotfemboys plugin by spinfal & was modified with the help of meqativ 
            const nsfw = args.find(arg => arg.name === "nsfw")?.value
            let response = await fetch("https://www.reddit.com/r/femboy.json").then(res => res.json());
            if (!ctx.channel.nsfw_ && nsfw && storage.nsfwwarn) {
                ClydeUtils.sendBotMessage(ctx.channel.id, "This channel is not marked as NSFW\n(You can disable this check in plugin settings)")
                return
            }
            if (nsfw) {response = await fetch("https://www.reddit.com/r/femboys.json").then(res => res.json());}
            response = response.data?.children?.[Math.floor(Math.random() * response.data?.children?.length)]?.data;
            let image = String(response?.url_overridden_by_dest ?? response?.url)  


            MessageActions.sendMessage(ctx.channel.id, {
                content: image
            })
            

        } catch (err) {
            logger.log(err);
            ClydeUtils.sendBotMessage(ctx.channel.id, "ERROR !!!!!!!!!!!! 😭😭😭 Check debug logs!! 🥺🥺🥺")
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