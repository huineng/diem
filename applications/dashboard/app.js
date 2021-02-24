const http = require('http');

const port = 8192;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Bizops\n');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}/`);
});