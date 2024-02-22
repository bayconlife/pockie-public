import { getServerConfig } from '../resources/servers';
import { writeFile } from 'fs';

export default async function composeItemJson() {
  console.log(Object.keys(getServerConfig(99).Items.Items).length);

  const map: { [id: string]: any } = {};

  Object.entries(getServerConfig(99).Items.Items).forEach(([k, v]: [string, any]) => {
    map[k] = [v.src, v.value ?? 0, v.price ?? 1, v.type, []];
  });

  getServerConfig(99).Base.Codex.PetTracing.forEach((id: string) => {
    if (map[id] === undefined) {
      return;
    }

    map[id][4][0] = 1;
  });
  getServerConfig(99).Base.Codex.Tasks.forEach((id: string) => {
    if (map[id] === undefined) {
      return;
    }

    map[id][4][1] = 1;
  });
  getServerConfig(99).Base.Codex.TicketBoss.forEach((id: string) => {
    if (map[id] === undefined) {
      return;
    }

    map[id][4][2] = 1;
  });
  console.log(getServerConfig(99).Base.Codex);

  // console.log(map);

  writeFile('../pockie-ninja/public/json/items.json', JSON.stringify(map, null), (e) => {
    // console.log(e);
  });
}
