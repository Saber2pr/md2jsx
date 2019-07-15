import React from "react";
import Md2jsx from "./index";
import ReactDOM from "react-dom";
import theme from "./theme/atom-dark";

const md =
  "header\n\n\n# react-ts\n> react + ts + less + webpack.\n```typescript\nnpm i\nexport const App = (ss:number) => {\nnpm run build\n```\nfooter\n233\nheader\n\n\n# react-ts\n> react + ts + less + webpack.\n```javascript\nnpm i\nexport const App = (ss:number) => {\nnpm run build\n```\nfooter\n233";

export const App = () => {
  return <Md2jsx theme={theme}>{md}</Md2jsx>;
};

ReactDOM.render(<App />, document.getElementById("root"));
