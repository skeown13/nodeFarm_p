const fs = require("fs")
const http = require("http")
const url = require("url")

const slugify = require("slugify")

const replaceTemplate = require('./modules/replaceTemplate')

//////////////////////////////////////////////////
// FILES

// // Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8")
// console.log(textIn)
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on no longer using because i don't want to run it over and over again with each running...`
// fs.writeFileSync("./txt/output.txt", textOut)
// console.log("File written!")

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!")

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2)
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3) 
      
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("Your file has been written ;)")
//       })
//     })
//   })
// })

//////////////////////////////////////////////////////////

//SERVER
// Save the read at the beginning so that it is only read once and then called upon when needed. There is no need to read everytime that it is called. Can do the synchronis version because it is in top level code and only runs once upon first load.
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8")
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))
console.log(slugs)


const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true)

  //Overview Page
  if(pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" })

    // arrow function will implicitly return as there is no curly braces
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

    res.end(output)

  // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" })
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)

  // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" })
    res.end(data)

  // Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world"
    })
    res.end("<h1>Page not found!</h1>")
  }

  // res.end("Hello from the server!")
})

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000")
})