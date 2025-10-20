const express = require('express');
let mysql = require('mysql2/promise');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mahasiswa',
    port : 3307
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');    
})

// Method get
app.get('api/users', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error executing query:0' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    })
})

// Method post