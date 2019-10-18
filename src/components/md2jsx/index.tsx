/*
 * @Author: saber2pr
 * @Date: 2019-07-15 08:49:51
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-08-30 14:59:28
 */
import React, { Fragment } from "react"

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light"
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript"

import { REG } from "../../reg"
import { mergeCode } from "../../core"

export interface Md2jsx {
  children: string
  theme: any
}

export const Md2jsx = ({ children, theme }: Md2jsx) => {
  const jsx: JSX.Element[] = []
  const lines = mergeCode(children.split("\n"))

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]
    if (line.startsWith("```")) {
      renderCode({ jsx, i, line, theme })
    } else if (line.startsWith("#")) {
      renderHeader({ jsx, i, line })
    } else if (line.startsWith(">")) {
      renderComment({ jsx, i, line })
    } else if (REG.imgtype.test(line)) {
      renderImg({ jsx, i, line })
    } else if (REG.atype_url.test(line)) {
      renderAnchor({ jsx, i, line })
    } else if (line.startsWith("---") || line.startsWith("***")) {
      renderHR({ jsx, i, line })
    } else {
      jsx.push(<p key={i}>{line}</p>)
    }
  }

  return <>{jsx}</>
}

type RenderLine = {
  line: string
  jsx: JSX.Element[]
  i: number
}

const renderCode = ({ line, jsx, theme, i }: RenderLine & { theme }) => {
  const codetype = REG.codetype.exec(line)[0].slice(3)
  const code = line.slice(codetype.length + 4, line.length - 4)
  SyntaxHighlighter.registerLanguage(codetype, ts)
  jsx.push(
    <SyntaxHighlighter key={i} language={codetype} style={theme}>
      {code}
    </SyntaxHighlighter>
  )
}

const renderHeader = ({ line, jsx, i }: RenderLine) => {
  let count = 0
  let text = ""
  for (const ch of line) {
    if (ch === "#") {
      count++
    } else {
      text += ch
    }
  }
  jsx.push(
    <Fragment key={i}>{React.createElement(`h${count}`, null, text)}</Fragment>
  )
}

const renderComment = ({ jsx, i, line }: RenderLine) => {
  jsx.push(
    <p
      key={i}
      style={{
        color: "gray",
        borderLeft: "0.2rem solid #d0d0d0",
        paddingLeft: "0.5rem"
      }}
    >
      {line.slice(2)}
    </p>
  )
}

const renderImg = ({ jsx, i, line }: RenderLine) => {
  const meta = line.match(REG.imgtype)[0]
  const title = meta.match(REG.imgtype_title)[0].replace(/\[|\]/g, "")
  const url = meta.match(REG.imgtype_url)[0].replace(/\(|\)/g, "")
  jsx.push(<img key={i} src={url} alt={title} style={{ maxWidth: "100%" }} />)
}

const renderAnchor = ({ jsx, i, line }: RenderLine) => {
  const meta = line.match(REG.atype_url)[0]
  const title = meta.match(REG.imgtype_title)[0].replace(/\[|\]/g, "")
  const url = meta.match(REG.imgtype_url)[0].replace(/\(|\)/g, "")
  jsx.push(
    <div key={url + title + i}>
      <a href={url} title={url}>
        {title}
      </a>
    </div>
  )
}

const renderHR = ({ jsx, i, line }: RenderLine) => {
  jsx.push(<hr key={i} />)
}
