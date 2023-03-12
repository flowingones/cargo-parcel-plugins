import { assertEquals } from "std/testing/asserts.ts";
import { TwindPlugin } from "./plugin.ts";

const Plugin = await TwindPlugin();

const plugin = await Plugin.plugin();

Deno.test(TwindPlugin.name, async (t) => {
  await t.step("should use loaded config file", async () => {
    const Plugin = await TwindPlugin();
    const plugin = await Plugin.plugin();
    assertEquals(Plugin.name, "Twind Plugin");
    assertEquals(plugin.tasks?.afterRender?.length, 1);
  });
  await t.step("should use input config options", async () => {
    const Plugin = await TwindPlugin({
      preflight: { body: { color: "blue" } },
    });
    const plugin = await Plugin.plugin();
    assertEquals(Plugin.name, "Twind Plugin");
    assertEquals(plugin.tasks?.afterRender?.length, 1);
  });
});
