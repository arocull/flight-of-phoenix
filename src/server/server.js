import fs from 'fs';
import express from 'express';
import parser from 'body-parser';
import http from 'http';

const clientDir = './src/client';

const port = 8443;
const REALTIME = true; // For debugging, reloads files every time they are requested

const basePage = fs.readFileSync(clientDir + '/index.html', 'utf8');

// Create web app
const app = express();
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
// app.use(express.static(clientDir));



// Set up main page functionality
/*app.all('/', (request, response) => {
    console.log("Recieved request with url ", request.url);
    // console.log(request);

    if (REALTIME) {
        response.send(fs.readFileSync(clientDir + '/index.html', 'utf8'));
    } else {
        response.send(basePage);
    }
});*/


// Host server
const server = http.createServer(function (request, response) {
    console.log("Recieved request with url ", request.url);
    // console.log(request);

    if (REALTIME) {
        response.send(fs.readFileSync(clientDir + '/index.html', 'utf8'));
    } else {
        response.send(basePage);
    }
});

server.listen(port);
console.log("HI");