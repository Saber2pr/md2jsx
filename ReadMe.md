# @saber2pr/md2jsx

> markdown-string to react component.

```bash
npm i @saber2pr/md2jsx

yarn add @saber2pr/md2jsx
```

# Example

````tsx
import React from "react"
import ReactDOM from "react-dom"

import Md2jsx from "@saber2pr/md2jsx"
import theme from "@saber2pr/md2jsx/lib/theme/atom-dark"

import tsx from "@saber2pr/md2jsx/lib/languages/tsx"
import hs from "@saber2pr/md2jsx/lib/languages/haskell"

Md2jsx.registerLanguage("tsx", tsx)
Md2jsx.registerLanguage("hs", hs)

const md =
  "header\n\n\n# react-ts\n> react + ts + less + webpack.\n```typescript\nnpm i\nexport const App = (ss:number) => {\n\nnpm run build\n```\nfooter\n233\nheader\n\n\n# react-ts\n> react + ts + less + webpack.\n```tsx\nnpm i\nexport const App = (ss:number) => <input onClick={() => {}} />\nnpm run build\n```\nhaskell\n```hs\nJust 233 >>= print\n```\nfooter\n***\n233\n![loading](http://localhost:8080/dom-cssom.webp)\n114514\n[saber2pr](https://saber2pr.top)\n[saber2pr2](https://saber2pr.top)\nlala"

export const App = () => {
  return <Md2jsx theme={theme}>{md}</Md2jsx>
}

ReactDOM.render(<App />, document.getElementById("root"))
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
