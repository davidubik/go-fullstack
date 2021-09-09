const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Thing = require('./models/thing');
const thing = require('./models/thing');

mongoose.connect('mongodb+srv://David:Bladerunner2049@cluster0.5ekqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//middleware

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //Ajouter le middleware POST =>

  app.use(bodyParser.json());

  //ROOT POST
  app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

// Root dynamque pour récupéré un Objet via son Id

app.get('/api/stuff/:id' , (req, res, next) =>{
  Thing.findOne({_id: req.params.id}) // trouve l'objet par sont Id
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
   Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = app;