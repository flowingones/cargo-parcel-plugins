import { info } from "cargo/utils/mod.ts";
import { Route } from "parcel/cargo/mod.ts";

export interface I18nConfig {
  defaultLanguage?: string;
  languages: {
    [key: string]: Language;
  };
}

export interface Language {
  [key: string]: string | Language;
}

let _config = {
  defaultLanguage: "en",
  pattern: /^\/([a-z]{2})?(?:\/|$)/i,
};
const _languages: Map<string, Language> = new Map();

function setup(config: I18nConfig): void {
  const { languages: l, ...restConfig } = config;
  _config = { ..._config, ...restConfig };
  for (const lang in l) {
    _languages.set(lang, l[lang]);
  }
}

function getActiveLang(): string {
  return langFrom(Route.url()) ??
    _config.defaultLanguage;
}

function langFrom(url: URL): string | undefined {
  return _config.pattern.exec(url.pathname)?.[1];
}

function getLanguages(): string[] {
  return Array.from(_languages.keys());
}

function unnest(
  keys: string[],
  language: Language,
  path: string,
): string | undefined {
  const key = keys.shift();

  if (typeof key === "undefined") {
    info(
      "I18n",
      `Translation key is for undefined. This most likely happens if the translation values is not of type "string"`,
    );
    return undefined;
  }

  if (key in language) {
    const translation = language[key];
    if (typeof translation === "string") {
      if (keys.length) {
        info(
          "I18n",
          `Key "${path}${key}" does not seems to be a final translation value. More nesting expected ${path}${key}(.${
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

function replaceParams(label: string, params?: Record<string, string>): string {
  if (!params) {
    return label;
  }
  return Object.entries(params).reduce((label, [key, value]) => {
    return label.replace(new RegExp(`{{${key}}}`, "g"), value);
  }, label);
}

export function t(key: string, params?: Record<string, string>): string {
  const language = _languages.get(getActiveLang());
  if (language) {
    const keys = key.split(".");
    if (params) {
      return replaceParams(unnest([...keys], language, "") ?? key, params);
    }
    return unnest([...keys], language, "") ?? key;
  }
  return key;
}

export const I18n = {
  setup,
  getActiveLang,
  getLanguages,
  langFrom,
};
