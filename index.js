const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = './users.json';

// Middlewares
app.use(cors());
app.use(express.json());
// Sirve archivos estáticos (imágenes, CSS) desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '.'))); 

// Funciones de Base de Datos
const readDatabase = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// --- RUTAS ---

// RUTA RAÍZ CORREGIDA: Sirve el HTML y responde al Test
app.get('/', (req, res) => {
    // Si la petición viene de un test o pide JSON, responde el mensaje
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ message: "Servidor en ejecucion" });
    }
    // Para el navegador normal, envía tu interfaz HTML
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/users', (req, res) => {
    res.json(readDatabase());
});

// NUEVA RUTA: Necesaria para que el test "Debe buscar el usuario creado" pase (Evita el 404)
app.get('/users/:id', (req, res) => {
    const users = readDatabase();
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: user });
});

app.post('/users', (req, res) => {
    const users = readDatabase();
    const newUser = req.body;

    if (users.some(u => u.id === newUser.id)) {
        return res.status(400).json({ error: 'El ID ya existe' });
    }
    if (users.some(u => u.email === newUser.email)) {
        return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    users.push(newUser);
    writeDatabase(users);
    res.status(201).json({ user: newUser });
});

app.put('/users/:id', (req, res) => {
    const users = readDatabase();
    const id = req.params.id;
    const updatedData = req.body;
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    const emailConflict = users.some(u => u.email === updatedData.email && u.id !== id);
    if (emailConflict) {
        return res.status(400).json({ error: 'El correo ya pertenece a otro usuario' });
    }

    users[index] = { ...users[index], ...updatedData };
    writeDatabase(users);
    res.json({ user: users[index] });
});

app.delete('/users/:id', (req, res) => {
    let users = readDatabase();
    const filtered = users.filter(u => u.id !== req.params.id);
    writeDatabase(filtered);
    res.json({ message: 'Eliminado correctamente' });
});

// --- INICIO ---
module.exports = app;

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
