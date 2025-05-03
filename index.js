const http = require('http');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, 'data');

const server = http.createServer((request, response) => {
    if( request.url === "/jokes") {
        switch (request.method) {
            case 'GET':
                getAllJokes( response );
                break;
            case 'POST':
                addJoke( request );
                break;
        }
    }

});

function getAllJokes( response ) {
    const jokes = [];

    const jokeFileNames = fs.readdirSync( dataPath );
    
    for (const fileName of jokeFileNames) {
        const filePath = path.join( dataPath, fileName );

        const fileContent = fs.readFileSync( filePath, 'utf-8' );
        const fileObject = JSON.parse( fileContent );
        
        jokes.push( fileObject.content );
    }

    response.writeHead(200, {"Content-type": 'application/json'});
    response.end( JSON.stringify( jokes ) );
}

function addJoke ( request ) {
    let data = '';
    request.on("data", function(chunk) {
        data += chunk;
    });
    request.on("end", function() {
        const newJoke = JSON.parse( data );
        const fileName = Date.now();
        const filePath = path.join( dataPath, `${fileName}.json` );
        fs.writeFileSync( filePath, JSON.stringify( newJoke ) );
        console.log( data );
    })
}

server.listen(3000);

