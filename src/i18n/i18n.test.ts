import { assertEquals } from "std/testing/asserts.ts";
import { setRequest } from "parcel/cargo/route.ts";
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
    setRequest(new Request("https://cargo.wtf/de"));
    assertEquals(t("section.title"), "section.title");
    setRequest(undefined);
  });

  await test.step("should return translated value in en", () => {
    setRequest(new Request("https://cargo.wtf/en"));
    assertEquals(t("section.title"), "Hello Section");
    setRequest(undefined);
  });
});
