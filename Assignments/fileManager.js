const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const fileName = url.searchParams.get('file');
  const action = url.searchParams.get('action');

  if (!fileName || !action) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Error: Provide both ?file=<filename> and ?action=create|read|delete');
    return;
  }

  const filePath = path.join(__dirname, fileName);

  switch (action) {
    case 'create':
      fs.writeFile(filePath, 'Hello from Node Js! The File was created.', (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Error creating file: ${err.message}`);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`File "${fileName}" created successfully!`);
        }
      });
      break;

    case 'read':
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Error reading file: ${err.message}`);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`Content of "${fileName}":\n\n${data}`);
        }
      });
      break;

    case 'delete':
      fs.unlink(filePath, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Error deleting file: ${err.message}`);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`File "${fileName}" deleted successfully!`);
        }
      });
      break;

    default:
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid action. Use ?action=create|read|delete');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
