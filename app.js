const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3023;

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection configuration
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432, // Default PostgreSQL port
});
// Connect to the PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database', err));

// Route to fetch survey questions
app.get('/frameworks', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM Frameworks');
      const frameworks = result.rows;
      res.json(frameworks);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Error retrieving frameworks' });
    }
});

// Route to fetch survey questions based on framework ID
// Assuming you already have an instance of Express app and connected to the database

app.get('/survey-questions/:frameworkId', async (req, res) => {
    const { frameworkId } = req.params;
    try {
        const query = `
            SELECT id, question_text, question_type, option_id 
            FROM SurveyQuestions 
            WHERE framework_id = $1;
        `;
        const result = await client.query(query, [frameworkId]);
        const surveyQuestions = result.rows;
        res.json(surveyQuestions);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Error retrieving survey questions' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
