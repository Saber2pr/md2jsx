/*
 * @Author: saber2pr
 * @Date: 2019-07-15 08:49:51
 * @Last Modified by: saber2pr
 * @Last Modified time: 2022-02-15 22:02:31
 */
import React, { Fragment, useEffect, useRef } from 'react'
import ClipboardJS from 'clipboard'

import SyntaxHighlighterCore from 'react-syntax-highlighter/dist/cjs/prism-light'
import createElement from 'react-syntax-highlighter/dist/cjs/create-element'
const SyntaxHighlighter = SyntaxHighlighterCore as typeof import('react-syntax-highlighter').PrismLight

import { REG } from '../../reg'
import { mergeCode } from '../../core'
import './style.less'

export interface Md2jsx {
  children: string
  theme: any
  basename?: string
}

export function Md2jsx({ children, theme, basename = '' }: Md2jsx) {
  const jsx: JSX.Element[] = []
  const lines = mergeCode(children.split(/\n|\r\n/))

  let codeIdx = 0

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]
    if (line.startsWith('```')) {
      renderCode({ jsx, i, line, theme, blockIndex: codeIdx })
      codeIdx++
    } else if (line.startsWith('#')) {
      renderHeader({ jsx, i, line })
    } else if (line.startsWith('>')) {
      renderComment({ jsx, i, line })
    } else if (REG.imgtype.test(line)) {
      renderImg({ jsx, i, line })
    } else if (REG.atype_url.test(line)) {
      renderAnchor({ jsx, i, line, basename })
    } else if (line.startsWith('---') || line.startsWith('***')) {
      renderHR({ jsx, i, line })
    } else {
      jsx.push(
        <p
          key={i}
          dangerouslySetInnerHTML={{
            __html: line.replace(/\t/g, '&nbsp;&nbsp;'),
          }}
        />
      )
    }
  }

  codeIdx = 0

  return <>{jsx}</>
}

type RenderLine = {
  line: string
  jsx: JSX.Element[]
  i: number
}

export namespace Md2jsx {
  export const registerLanguage = (name: string, meta: any) =>
    SyntaxHighlighter.registerLanguage(name, meta)
}

const getText = token => {
  const children = token?.children
  if (Array.isArray(children)) {
    return children.map(node => {
      if (node.type === 'text') {
        return node.value
      }
      return ''
    }).join('')
  }
  return ''
}

const getStartPos = (token: string) => {
  const pref = token.match(/^( +)/);
  if (pref) {
    return pref[1].length;
  }
  return 0;
};

const rowRenderer = (blockIndex: number, lang: string) => ({ rows, stylesheet, useInlineStyles }) => {
  return rows.map((node, i) => {
    const tokens = Array.isArray(node.children) ? node.children : []
    let currentIndex = 0
    node.children = tokens.map(token => {
      const properties = token.properties ?? {}
      const text = getText(token)
      if (/ /.test(text)) {
      } else {
        const tokenWord = text.trim()
        if (tokenWord && tokenWord !== '.') {
          properties[`data-${blockIndex}-${lang}-token`] = `${tokenWord}-${i}-${currentIndex + getStartPos(text)}`
        }
      }
      token.properties = properties
      currentIndex += text.length
      return token
    })
    return createElement({
      node,
      stylesheet,
      useInlineStyles,
      key: `code-segement${i}`
    })
  }
  );
}

const renderCode = ({ line, jsx, theme, i, blockIndex }: RenderLine & { theme; blockIndex: number }) => {
  const match = REG.codetype.exec(line)?.[0] || ''
  const codetype = match.slice(3)
  const code = line.slice(codetype.length + 4, line.length - 4)

  const Code = () => {
    const id = 'MD2JSX-Code-' + i
    return (
      <div className="MD2JSX-Code">
        <div
          title="复制到剪贴板"
          className="Paste"
          ref={el => {
            if (el) {
              new ClipboardJS(el)
            }
          }}
          data-clipboard-target={'#' + id}
        >
          <i className="iconfont icon-fuzhi" />
        </div>
        <div id={id}>
          <SyntaxHighlighter language={codetype} style={theme} renderer={rowRenderer(blockIndex, codetype)} >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }

  jsx.push(<Code key={i} />)
}

const renderHeader = ({ line, jsx, i }: RenderLine) => {
  let count = 0
  let text = ''
  for (const ch of line) {
    if (ch === '#') {
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
        color: 'gray',
        borderLeft: '0.2rem solid #d0d0d0',
        paddingLeft: '0.5rem',
      }}
    >
      {line.slice(2)}
    </p>
  )
}

const renderImg = ({ jsx, i, line }: RenderLine) => {
  const meta = line.match(REG.imgtype)[0]
  const title = meta.match(REG.imgtype_title)[0].replace(/\[|\]/g, '')
  const url = meta.match(REG.imgtype_url)[0].replace(/\(|\)/g, '')
  jsx.push(<img key={i} src={url} alt={title} style={{ maxWidth: '100%' }} />)
}

const renderAnchor = ({ jsx, i, line, basename = '' }: RenderLine & {
  basename?: string
}) => {
  const meta = line.match(REG.atype_url)[0]
  const title = meta.match(REG.imgtype_title)[0].replace(/\[|\]/g, '')
  const url = meta.match(REG.imgtype_url)[0].replace(/\(|\)/g, '')
  jsx.push(
    <div key={url + title + i}>
      <a href={basename + url} title={url}>
        {title}
      </a>
    </div>
  )
}

const renderHR = ({ jsx, i, line }: RenderLine) => {
  jsx.push(<hr key={i} />)
}
