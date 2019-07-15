# @saber2pr/md2jsx

> markdown-string to react component.

> supported language: typescript, javascript

```bash
npm i @saber2pr/md2jsx

yarn add @saber2pr/md2jsx
```

# what

````tsx
import React from "react";
import ReactDOM from "react-dom";

import Md2jsx from "@saber2pr/md2jsx";
import theme from "@saber2pr/md2jsx/lib/theme/atom-dark";

const md =
  "header\n\n\n# react-ts\n> react + ts + less + webpack.\n```typescript\nnpm i\nexport const App = (ss:number) => {\nnpm run build\n```\nfooter\n233\nheader\n\n\n# react-ts\n> react + ts + less + webpack.\n```javascript\nnpm i\nexport const App = (ss:number) => {\nnpm run build\n```\nfooter\n233";

export const App = () => <Md2jsx theme={theme}>{md}</Md2jsx>;

ReactDOM.render(<App />, document.getElementById("root"));
````

# dependencies

[`react-syntax-highlighter`](https://github.com/conorhastings/react-syntax-highlighter)

# dev

```bash
yarn install

yarn run dev

yarn run build
```

> Author

> saber2pr
