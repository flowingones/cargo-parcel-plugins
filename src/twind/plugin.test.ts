import { assertEquals } from "std/testing/asserts.ts";
import { TwindPlugin } from "./plugin.ts";

const Plugin = await TwindPlugin();

const plugin = await Plugin.plugin();

Deno.test(TwindPlugin.name, async (t) => {
  await t.step('should have name "Cargo Label Plugin"', () => {
    assertEquals(Plugin.name, "Twind Plugin");
  });
  await t.step("should have 1 afterRender task definded", () => {
    assertEquals(plugin.tasks?.afterRender?.length, 1);
  });
});