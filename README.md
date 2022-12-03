# Cargo Parcel – Plugins

Cargo Parcel provides the possibility to extend the functionality with plugins.
At the moment the following plugins are available:

- TwindPlugin - Integration of css-in-js solution with support for various
  presets. [Details about Twind](https://twind.style)

## Twind Plugin

### Installation

Add dependencies to the import_map.json of your Cargo project.

```json
{
  "imports": {
    "parcel_plugins/": "https://deno.land/x/cargo_parcel_plugins/",
    "@twind/core": "https://esm.sh/@twind/core@1.0.1",
    "@twind/preset-autoprefix": "https://esm.sh/@twind/preset-autoprefix@1.0.1",
    "@twind/preset-tailwind": "https://esm.sh/@twind/preset-tailwind@1.0.1"
  }
}
```

Create the twind configuration under `/config/twind.ts`

```ts
import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
});
```

Add the `TwindPlugin` to the Cargo Parcel configuration in `/config/parcel.ts`
and pass in the twind configuration.

```ts
...
import { TwindPlugin } from "parcel_plugins/twind/mod.ts";
import twindConfig from "config/twind.ts";
...

export default {
  // ...
  plugins: [
    TwindPlugin(twindConfig),
  ],
  // ...
};
```
