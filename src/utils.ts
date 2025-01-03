import { KaboomCtx } from "kaboom";
import { scale } from "./constant";

export async function makeMap(k: KaboomCtx, name: string) {
  const mapData = await (await fetch(`./${name}.json`)).json();

  const map = k.make([k.sprite(name), k.scale(scale), k.pos(0)]);

  const spawnPoints: { [key: string]: { x: number; y: number }[] } = {};

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          collider.name !== "exit" ? k.body({ isStatic: true }) : null,
          k.pos(collider.x, collider.y),
          collider.name !== "exit" ? "platform" : "exit",
        ]);
      }
      continue;
    }
    if (layer.name === "spawnpoints") {
      for (const spawnpt of layer.objects) {
        if (spawnPoints[spawnpt.name]) {
          spawnPoints[spawnpt.name].push({
            x: spawnpt.x,
            y: spawnpt.y,
          });
          continue;
        }
        spawnPoints[spawnpt.name] = [{ x: spawnpt.x, y: spawnpt.y }];
      }
    }
  }

  return { map, spawnPoints };
}
