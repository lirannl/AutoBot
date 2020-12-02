import { Command } from "./command.ts";

export default (await Promise.all(Array.from(Deno.readDirSync("./handlers/commands"))
.filter(entry => !["index.ts", "command.ts"].includes(entry.name))
.map(file=>
    import(`./${file.name}`).then(mod=>[file.name, mod.default] as [string, Command])
    ))).reduce((acc, curr) => Object.assign({}, acc, {[curr[0].split(".")[0]]: curr[1]}), {} as {[name: string]: Command});