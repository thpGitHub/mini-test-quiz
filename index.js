const express = require('express')
const mongoose = require('mongoose');
const Quiz = require('./models/quiz');
const cors = require('cors');
require('dotenv').config();

const mongoURI = process.env.mongoURI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
mongoose.connection.once('open', () => {
  console.log('Connecté à la base de données MongoDB');
});


const app = express()

app.use(cors());

const PORT = 3000

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
}, express.json(), express.urlencoded({ extended: true }));


app.post('/', function (req, res) {
    console.log(req.body);
    res.send('hello world');
  })
// Read
app.get('/quiz', function (req, res) {
  Quiz.find()
    .then((quizzes) => {
      res.status(200).json(quizzes);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Une erreur est survenue lors de la récupération des quiz');
    });
});

// Create fake 
app.get('/quizz', function (req, res) {

  const newQuiz = new Quiz({
    nom: "Quiz 3",
    rounds: [
      {
        questions: "Question 1",
        reponses: ["Answer 1", "Answer 2"],
        corrects: [1]
      },
      {
        questions: "Question 2",
        reponses: ["Answer 3", "Answer 4"],
        corrects: [0]
      }
    ],
    categories: ["Category 1", "Category 2"]
  });
  

  newQuiz.save()
    .then((savedQuiz) => {
      console.log('Quiz saved:', savedQuiz);
      res.send('Quiz saved');
    })
    .catch((error) => {
      console.error('Error saving quiz:', error);
      res.status(500).send('Error saving quiz');
    });
}); 

// Create true
app.post('/create', function (req, res) {
  const create = req.body; 
  console.log('create', create);

  const { name, rounds, categories } = req.body;
  console.log('rounds', rounds);

  const newQuiz = new Quiz({
    name: name,
    rounds:rounds,
    categories:categories
  });
  
  newQuiz.save()
    .then((savedQuiz) => {
      console.log('Quiz saved:', savedQuiz);
      res.send('Quiz saved');
    })
    .catch((error) => {
      console.error('Error saving quiz:', error);
      res.status(500).send('Error saving quiz');
    });

})

app.put('/quiz/:id', function (req, res) {
  const quizId = req.params.id;
  const update = req.body; // Assuming the updated fields are sent in the request body

  Quiz.findByIdAndUpdate(quizId, update, { new: true })
    .then((updatedQuiz) => {
      if (!updatedQuiz) {
        return res.status(404).send('Quiz not found');
      }
      console.log('Quiz updated:', updatedQuiz);
      res.send('Quiz updated');
    })
    .catch((error) => {
      console.error('Error updating quiz:', error);
      res.status(500).send('Error updating quiz');
    });
});

app.delete('/quiz/:id', function (req, res) {
  const quizId = req.params.id;

  Quiz.findByIdAndDelete(quizId)
    .then((deletedQuiz) => {
      if (!deletedQuiz) {
        return res.status(404).send('Quiz not found');
      }
      console.log('Quiz deleted:', deletedQuiz);
      res.send('Quiz deleted');
    })
    .catch((error) => {
      console.error('Error deleting quiz:', error);
      res.status(500).send('Error deleting quiz');
    });
});


app.listen(PORT)  