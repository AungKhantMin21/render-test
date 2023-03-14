const express = require('express');
const cors = require('cors');
const app = express();

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json()); // JSON-parser for express. To takes JSON data from request.
app.use(requestLogger);
app.use(cors());

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/',(request,response) => {
    response.send('<h1>Hello world</h1>');
});

app.get('/api/notes',(request,response) => {
    response.json(notes);
});

app.get('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id);  // cause id from url is "string" data type.
    const note = notes.find(note => note.id === id);
    
    //error handling section.  if we find note return note. else return 404 status.
    if(note){
        response.json(note);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id);  // cause id from url is "string" data type.
    notes = notes.filter(note => note.id !== id);
    
    response.status(204).end();
})


const generateId = () => {
    let maxId = notes.length > 0 
    ? Math.max(...notes.map(n=>n.id)) // Math.max return max value of the numbers passed.  note.map return an array.  ...note.map transformed array into sets of individual numbers (1,2,3)
    : 0
    return maxId + 1;
}

app.post('/api/notes',(request,response) => {
    const body = request.body;

    if(!body){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    };
    
    notes = notes.concat(note);
    
    response.json(note);
})


  
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})
