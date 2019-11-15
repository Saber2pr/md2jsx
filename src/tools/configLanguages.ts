import { readdir, writeFile } from "fs"
import { promisify } from "util"
import { parse } from "path"

promisify(readdir)(
  "./node_modules/react-syntax-highlighter/dist/esm/languages/prism"
)
  .then(files =>
    files.map(file => {
      const name = parse(file).name
      return {
        name: "./src/languages/" + name + ".ts",
        content: `export { default } from "react-syntax-highlighter/dist/esm/languages/prism/${name}";`
      }
    })
  )
  .then(files =>
    Promise.all(
      files.map(({ content, name }) => promisify(writeFile)(name, content))
    )
  )
