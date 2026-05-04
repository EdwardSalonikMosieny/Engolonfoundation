const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = 8082;
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png"
};

const server = http.createServer((request, response) => {
  let urlPath = decodeURIComponent(request.url.split("?")[0]);
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";
  const filePath = path.join(root, urlPath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
