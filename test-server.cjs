const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello, World!' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
