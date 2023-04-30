import { Label, Labels } from "label/label.ts";
import { assemble, get } from "assemble/assemble.ts";

export function config(options: Labels) {
  assemble({
    token: "labels",
    value: { labels: options },
  });
  assemble({ class: Label, dependencies: ["labels"] });
  assemble({ token: "config", value: get(Label) });
}
