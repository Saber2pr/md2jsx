import React from "react"
import Md2jsx from "./index"
import ReactDOM from "react-dom"
import theme from "./theme/atom-dark"
import tsx from "./languages/tsx"
import hs from "./languages/haskell"

Md2jsx.registerLanguage("tsx", tsx)
Md2jsx.registerLanguage("hs", hs)

fetch("/test.md")
  .then(res => res.text())
  .then(md =>
    ReactDOM.render(
      <Md2jsx theme={theme}>{md}</Md2jsx>,
      document.getElementById("root")
    )
  )
