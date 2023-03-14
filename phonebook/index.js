const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json()); // JSON-parser for express. To takes JSON data from request.

morgan.token('body',req => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]

app.get('/',(resquest,response) => {
    response.send("<h1>Hello from phonebook</h1>");
})

app.get('/info',(request,response) => {
    const now = new Date();
    response.send(`<p>Phonebook has infor for 2 people</p> <p>${now}</p>`)
})

app.get("/api/persons",(request,response)=>{
    response.json(persons);
})

app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id);

    const person = persons.find(p => p.id === id);

    if(person) {
        return response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
})

app.post('/api/persons',(request,response) => {
    const body = request.body;
    console.log(body.name);
    if(!body.number || !body.name || !body){
        return response.status(400).json({
            error: 'content missing'
        })
    } else {
        const names = persons.map(p => p.name);

        if(names.includes(body.name)){
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
        

        const person = {
            name: body.name,
            number: body.number,
            id:  Math.floor(Math.random() * 20)
        }

        persons = persons.concat(person);
        response.json(person);
    }
})

const PORT = 3001;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})