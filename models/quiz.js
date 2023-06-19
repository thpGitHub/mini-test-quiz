const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    nom: String,
    rounds: [{
        // questions: String, required: true, unique: true,
        questions: String,
        reponses: [String],
        corrects: [Number]
    }],
    categories: [String],
})

module.exports = mongoose.model("Quiz", quizSchema) || mongoose.models("Quiz", quizSchema)
// module.exports = mongoose.model("Quiz", quizSchema)