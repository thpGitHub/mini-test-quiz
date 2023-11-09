const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    name: String,
    rounds: [{
        // questions: String, required: true, unique: true,
        questions: String,
        reponses: [String],
        corrects: [Number]
    }],
    categories: [String],
})

module.exports = mongoose.model("Quiz", quizSchema) || mongoose.models("Quiz", quizSchema)
// for Docker
// module.exports = mongoose.model("quiz_bdd_in_docker", quizSchema) || mongoose.models("quiz_bdd_in_docker", quizSchema)