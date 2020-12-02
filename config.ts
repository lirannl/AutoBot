export interface config {
  prefix: string;
  token: string;
  botID: string;
  reactionMirroringRoles: string[];
  dynoChannel: string;
  roleCategories: {[category: string]: string[]};
  guildID: string;
}

const configs: config = JSON.parse(await Deno.readTextFile("./config.json"));

export default new Proxy(configs, {
  set(configs: config, prop, value) {
    (configs as any)[prop] = value;
    Deno.writeTextFile("./config.json", JSON.stringify(configs));
    return true;
  },
});