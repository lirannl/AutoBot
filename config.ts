export interface Iconfig {
  prefix: string;
  token: string;
  reactionMirroringRoles: string[];
  dynoChannel: string;
  roleCategories: { [category: string]: string[] };
  guildID: string;
  roleCategoryManagerRoles: string[];
}

const configs: Iconfig = JSON.parse(await Deno.readTextFile("./config.json"));

/*export default Object.assign(configs, {
  set: (prop: string, value: any) => {
    console.log(`Writing ${value} to ${String(prop)}`);
    (configs as any)[prop] = value;
    Deno.writeTextFile("./config.json", JSON.stringify(configs));
  }
}) as Readonly<Iconfig & {set: (prop: string, value:any) => void}>;*/

export default new Proxy(configs, {
  set: function(configs: Iconfig, prop, value) {
    (configs as any)[prop] = value;
    Deno.writeTextFile("./config.json", JSON.stringify(configs));
    return true;
  },
});