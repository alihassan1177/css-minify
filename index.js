const fs = require("fs/promises")

const htmlFilePath = "./index.html"
const inputCssPath = "./input.css"

async function main() {
  const html = await fs.readFile(htmlFilePath, { encoding: "utf8" })
  const linesOfHtml = html.split("\n")
  //console.log(html)

  const allClasses = []
  linesOfHtml.forEach((line) => {
    if (line.trim().length != 0) {
      const classes = findClasses(line)
      if (classes.length > 0) {
        const classNames = classes[0].split(" ")
        classNames.forEach((className) => {
          allClasses.push(className)
        })
      }
    }
  })
  const uniqueClasses = new Set(allClasses)
  await createOutput(uniqueClasses)
}

async function createOutput(classes) {
  const inputCss = await fs.readFile(inputCssPath, { encoding: "utf8" })

  const outputCssString = []
  classes.forEach((className) => {
    if(inputCss.includes(className)){
      const classNameIdx = inputCss.indexOf(className) - 1
      const openingBracesIdx = inputCss.indexOf("{", classNameIdx)
      const closingBracesIdx = inputCss.indexOf("}", openingBracesIdx)
      const classBlock = inputCss.slice(classNameIdx, closingBracesIdx + 1)
      outputCssString.push(classBlock)
    }
  })
  const output = outputCssString.join("\n")
  await fs.writeFile(Date.now() + ".css", output)
}

function findClasses(str) {
  const classes = []
  if (str.trim().includes("class")) {
    const cutAtClass = str.slice(str.indexOf("class"))
    const classStr = cutAtClass.slice(7, cutAtClass.indexOf('"', 7))

    classes.push(classStr)
  }

  return classes
}

main()
