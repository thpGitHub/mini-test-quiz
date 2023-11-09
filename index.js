const express = require('express');
const mongoose = require('mongoose');
const Quiz = require('./models/quiz');
const User = require('./models/userModel');
const cors = require('cors');
require('dotenv').config();


//const mongoURI = process.env.mongoURI;

// with docker compose we can use the name of the service as the host name (mongo_data) and the port (27017)
// const mongoURI = 'mongodb://mongo_data:27017/quiz_bdd_in_docker';
// const mongoURI = 'mongodb://localhost:27017/quiz_bdd_in_docker';
// const mongoURI = 'mongodb://127.0.0.1:27017/quiz_bdd_in_docker';
const mongoURI = 'mongodb://mongo:27017/quiz_bdd_in_docker';

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

// const PORT = 3000
const PORT = process.env.PORT || 3000
// const PORT = process.env.PORT || 2368

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
}, express.json(), express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
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

// Create User fake
app.get("/user", function (req, res) {
  const newUser = new User({
    email: "johndoe@example.com",
    password: "password123",
  });

  newUser.save()
    .then((savedUser) => {
      console.log("User saved:", savedUser);
      res.send("User saved");
    })
    .catch((error) => {
      console.error("Error saving user:", error);
      res.status(500).send("Error saving user");
    });
});

// Create fake 
app.get('/quizz', function (req, res) {

  const newQuiz = new Quiz({
    name: "Quelle est la Capitale",
    rounds: [
      {
        questions: "De l'Inde ?",
        reponses: ["Calcutta", "New Delhi"],
        corrects: [1]
      },
      {
        questions: "Du Portugal ?",
        reponses: ["Lisbonne", "Madrid"],
        corrects: [1]
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
  console.log('quizID', quizId);

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

// Login route
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log('user', user);
      if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await user.comparePassword(password);
      console.log('isPasswordValid', isPasswordValid);
      if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = user.generateToken();
      console.log('token', token);
      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: "Login failed" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = await user.generateToken(); // Generate and save the token
    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      res.status(400).json({ error: "Email already exists" });
    } else {
      // Other error
      res.status(500).json({ error: "Registration failed" });
    }
  }
});

// Function to check if the token has expired
function isTokenExpired() {
  const expirationTime = localStorage.getItem("expirationTime");
  if (!expirationTime) {
    return true; // Expiration time not found
  }
  const currentTime = new Date().getTime();
  return currentTime > parseInt(expirationTime);
}

// app.listen(PORT)  
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
