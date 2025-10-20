const express = require('express');
let mysql = require('mysql2');
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

// GET method
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error executing query:0' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    })
})

// POST method
app.post('/api/users', (req, res) => {
  const { nama, nim, kelas} = req.body;

  if (!nama || !nim || !kelas) {
    return res.status(400).send('Please provide nama, nim, and kelas');
  }

  db.query(
    'INSERT INTO mahasiswa (nama, nim, kelas) VALUES (?, ?, ?)',
    [nama, nim, kelas],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User created' });
    }
  );
});

// PUT method
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { nama, nim, kelas } = req.body;

  if (!nama || !nim || !kelas) {
    return res.status(400).json({ message: 'nama, nim, kelas wajib diisi' });
  }

  db.query(
    'UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ? WHERE id = ?',
    [nama, nim, kelas, userId],          
    (err, result) => {            
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating user' });
      }
      if (result.affectedRows === 0) {   
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    }                                     
  );                                   
});                                       

// DELETE method
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM mahasiswa WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error saat menghapus user' });
        }
        res.json({message: 'User berhasil dihapus'});
    });
});