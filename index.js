const http = require('http');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, 'data');

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    let url = request.url;
    let param
    if (request.url.includes('?')) {
        [url, param] = request.url.split('?')
        var id = param.split('=')[1];
    };



    switch (url) {
        case '/jokes':
            if (request.method === 'GET') getAllJokes(response);
            if (request.method === 'POST') addJoke(request, response);
            break;
        case '/joke':
            getJoke(response, id);
            break;
        case '/like':
            setLike(response, id);
            break;
        case '/dislike':
            setDislike(response, id);
            break;
        default:
            sendNotFound(response);
            break;
    }
});

function getJoke(response, id) {
    const jokePath = path.join(dataPath, `${id}.json`);
    const jokeContent = fs.readFileSync(jokePath, 'utf-8');
    const jokeObject = JSON.parse(jokeContent);

    const joke = [jokeObject.content];


    response.writeHead(200, { "Content-type": 'application/json' });
    response.end(JSON.stringify(joke));
}

function getAllJokes(response) {
    const jokes = [];

    const jokeFileNames = fs.readdirSync(dataPath);

    for (const fileName of jokeFileNames) {
        const filePath = path.join(dataPath, fileName);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const fileObject = JSON.parse(fileContent);

        jokes.push(fileObject);
    }

    response.writeHead(200, { "Content-type": 'application/json' });
    response.end(JSON.stringify(jokes));
}

function addJoke(request, response) {
    let data = '';
    request.on("data", function (chunk) {
        data += chunk;
    });
    request.on("end", function () {
        const joke = JSON.parse(data);
        joke.likes = 0;
        joke.dislikes = 0;
        const fileName = fs.readdirSync(dataPath).length + ".json";
        const filePath = path.join(dataPath, fileName);
        fs.writeFileSync(filePath, JSON.stringify(joke));
        response.writeHead(200, { "Content-type": 'application/json' });
        response.end(JSON.stringify(joke));
    })
}

function setLike(response, id) {

    const jokePath = path.join(dataPath, `${id}.json`);
    const jokeContent = fs.readFileSync(jokePath, 'utf-8');
    const jokeObject = JSON.parse(jokeContent);

    jokeObject.likes++;
    fs.writeFileSync(jokePath, JSON.stringify(jokeObject));

    response.writeHead(200);
    response.end("like has been added");
}

function setDislike(response, id) {

    const jokePath = path.join(dataPath, `${id}.json`);
    const jokeContent = fs.readFileSync(jokePath, 'utf-8');
    const jokeObject = JSON.parse(jokeContent);

    jokeObject.dislikes++;
    fs.writeFileSync(jokePath, JSON.stringify(jokeObject));

    response.writeHead(200);
    response.end("dislike has been added");
}

function sendNotFound(response) {
    response.writeHead(404, { "Content-type": 'text/plain' });
    response.end("Not Found");
}

server.listen(3000);

