import { NotFoundException } from "cargo/http/exceptions/not-found-exception.ts";

export class LanguageNotSupportedException extends NotFoundException {
  constructor() {
    super("Language not supported");
  }
}

export class NoLanguageSpecifiedException extends NotFoundException {
  constructor() {
    super("Not language specified");
  }
}
