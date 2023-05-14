import { assertEquals } from "std/testing/asserts.ts";
import { setContext } from "parcel/cargo/context.ts";
import { I18n, t } from "./mod.ts";

I18n.setup({
  languages: {
    en: {
      section: {
        title: "Hello Section",
      },
      title: "Hello title",
    },
  },
});

Deno.test("I18n", async (test) => {
  await test.step("should return key", () => {
    setContext({ request: new Request("https://cargo.wtf/de") } as any);
    assertEquals(t("section.title"), "section.title");
    setContext(undefined);
  });

  await test.step("should return translated value in en", () => {
    setContext({ request: new Request("https://cargo.wtf/en") } as any);
    assertEquals(t("section.title"), "Hello Section");
    setContext(undefined);
  });
});
