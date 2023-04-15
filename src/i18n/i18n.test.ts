import { assertEquals } from "std/testing/asserts.ts";
import { pathFrom, unnest } from "./i18n.ts";

Deno.test(pathFrom.name, async (t) => {
  await t.step("should return path", () => {
    const path = pathFrom("http://localhost/en/articles");
    assertEquals(path, "/en/articles");
  });
});

Deno.test(unnest.name, async (t) => {
  await t.step("should unnest key", () => {
    const path = unnest(
      "home.some".split("."),
      {
        home: {
          some: "thing",
        },
      },
      "",
    );
    assertEquals(path, "thing");
  });
});
