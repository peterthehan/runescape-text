# RuneScape Text

Convert text to a text image with [RuneScape](https://www.runescape.com/) chat effects.

<div>
  <img
    src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/glow1_wave_selling_rune_scimmy_15k.gif"
    title="Selling rune scimmy 15k"
    alt="Selling rune scimmy 15k"
  />
</div>

<details>
  <summary>More examples</summary>

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/92_is_half_of_99.png"
      title="92 is half of 99"
      alt="92 is half of 99"
    />
  </div>

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/flash1_scroll_free_armor_trimming.gif"
      title="Free armor trimming!"
      alt="Free armor trimming!"
    />
  </div>

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/patternkdomph_shake_fun_things_are_fun.gif"
      title="Fun things are fun."
      alt="Fun things are fun."
    />
  </div>

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/rainbow_the_quick_brown_fox_jumps_over_the_lazy_dog.png"
      title="The quick brown fox jumps over the lazy dog"
      alt="The quick brown fox jumps over the lazy dog"
    />
  </div>

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/flash3_slide_lorem_ipsum.gif"
      title="Lorem ipsum"
      alt="Lorem ipsum"
    />
  </div>
</details>

## Getting started

```
npm i runescape-text
```

> If you're on Windows and installation fails due to issues with `canvas`, follow the instructions at https://github.com/Automattic/node-canvas/wiki/Installation:-Windows to install the necessary dependencies. You can find installation instructions for other operating systems in the same wiki.

## Examples

```
npx runescape-text "glow3:wave:hello world"
```

```ts
import { writeFileSync } from "node:fs";

import getRuneScapeText from "runescape-text";

const message = "glow3:wave:hello world";
const options = { debug: true };
const { data, extension } = getRuneScapeText(message, options);

writeFileSync(`./runescape-text.${extension}`, Buffer.from(data));
```

## References

- Chat effect guides:
  - https://oldschool.runescape.wiki/w/Chat_Interface#Chat_effects
  - https://www.wikihow.com/Write-Text-Effects-on-Runescape
- Color chart reference for the `pattern` color effect:

  <div>
    <img
      src="https://raw.githubusercontent.com/peterthehan/runescape-text/master/assets/ColourChart.png"
      title="Pattern color chart"
      alt="Pattern color chart"
    />
  </div>
