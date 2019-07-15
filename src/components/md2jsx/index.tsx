/*
 * @Author: saber2pr
 * @Date: 2019-07-15 08:49:51
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-07-15 09:23:01
 */
import React, { Fragment } from "react";

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";

import { REG } from "../../reg";
import { mergeCode } from "../../core";

export interface Md2jsx {
  children: string;
  theme: any;
}

export const Md2jsx = ({ children, theme }: Md2jsx) => {
  const jsx: JSX.Element[] = [];
  const lines = mergeCode(children.split("\n"));

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const codetype = REG.codetype.exec(line)[0].slice(3);
      const code = line.slice(codetype.length + 4, line.length - 4);
      SyntaxHighlighter.registerLanguage(codetype, ts);
      jsx.push(
        <SyntaxHighlighter key={i} language={codetype} style={theme}>
          {code}
        </SyntaxHighlighter>
      );
    } else if (line.startsWith("#")) {
      let count = 0;
      let text = "";
      for (const ch of line) {
        if (ch === "#") {
          count++;
        } else {
          text += ch;
        }
      }
      jsx.push(
        <Fragment key={i}>
          {React.createElement(`h${count}`, null, text)}
        </Fragment>
      );
    } else if (line.startsWith(">")) {
      jsx.push(
        <p key={i} style={{ color: "gray" }}>
          {line.slice(2)}
        </p>
      );
    } else {
      jsx.push(<p key={i}>{line}</p>);
    }
  }

  return <>{jsx}</>;
};
