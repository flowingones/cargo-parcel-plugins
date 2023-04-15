import { info, log } from "cargo/utils/mod.ts";

export interface I18nConfig {
  defaultLanguage?: string;
  pattern?: RegExp;
  languages: {
    [key: string]: Language;
  };
}

export interface Language {
  [key: string]: string | Language;
}

let i18nConfig = {
  defaultLanguage: "en",
  pattern: /^\/([a-z]{2})+\//i,
};
const languages: Map<string, Language> = new Map();
let requestScope: Request | undefined;

export function setup(config: I18nConfig) {
  const { languages: l, pattern, ...restConfig } = config;
  i18nConfig = { ...i18nConfig, ...restConfig };
  for (const lang in l) {
    log("I18n", `Language "${lang}" succesfully loaded!`);
    languages.set(lang, l[lang]);
  }
}

export function t(key: string): string {
  const url = requestScope?.url ?? window.location.href;
  const langCode = i18nConfig.pattern.exec(pathFrom(url))?.[1] ??
    i18nConfig.defaultLanguage;
  const language = languages.get(langCode);
  if (language) {
    const keys = key.split(".");
    return unnest([...keys], language, "") ?? key;
  }
  return key;
}

export function set(request: Request): void {
  requestScope = request;
}

export function reset() {
  requestScope = undefined;
}

export function pathFrom(url: string): string {
  const pathName = new URL(url).pathname;
  return pathName;
}

export function unnest(
  keys: string[],
  language: Language,
  path: string,
): string | undefined {
  const key = keys.shift();

  if (typeof key === "undefined") {
    info(
      "I18n",
      `Translation key is for undefined. This most likely happens if the translation values is not of type string`,
    );
    return undefined;
  }

  if (key in language) {
    const translation = language[key];
    if (typeof translation === "string") {
      if (keys.length) {
        info(
          "I18n",
          `Key "${path}${key}" does not seems to be a final value. More nesting expected ${path}${key}(.${
            keys.join(
              ".",
            )
          })`,
        );
      }
      return translation;
    }
    return unnest(keys, translation, `${path}${key}.`);
  }
  info("I18n", `Translation value to key "${path}${key}" not found`);
  return undefined;
}
