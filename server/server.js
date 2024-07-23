import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

// Limite de taux
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par 'window' (ici, 15 minutes)
});
app.use(limiter);

// Configuration de la base de données MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'limaykongo',
    database: 'crud'
});

// Test de la connexion à la base de données
db.getConnection()
    .then(() => console.log('Connecté à la base de données MySQL.'))
    .catch(err => console.error('Erreur de connexion à la base de données:', err));

// Fonction de validation manuelle
const validateInput = (nom, prenom, age) => {
    const errors = [];
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    const ageRegex = /^[0-9]{1,3}$/;

    if (!nameRegex.test(nom)) {
        errors.push('Le nom est invalide. Il doit contenir entre 2 et 50 caractères alphabétiques.');
    }
    if (!nameRegex.test(prenom)) {
        errors.push('Le prénom est invalide. Il doit contenir entre 2 et 50 caractères alphabétiques.');
    }
    if (!ageRegex.test(age)) {
        errors.push('L\'âge est invalide. Il doit être un nombre entre 0 et 999.');
    }

    return errors;
};

// Route de création avec validation manuelle
app.post('/crudTest', async (req, res) => {
    const { nom, prenom, age } = req.body;

    // Validation manuelle des champs
    const errors = validateInput(nom, prenom, age);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const [result] = await db.query('INSERT INTO crudTest (nom, prenom, age) VALUES (?, ?, ?)', [nom, prenom, age]);
        res.status(201).send('Données ajoutées avec succès');
    } catch (err) {
        console.error('Erreur lors de l\'ajout des données:', err);
        res.status(500).send('Erreur lors de l\'ajout des données');
    }
});

// Route pour obtenir les données
app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM crudTest');
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

// Route pour obtenir une donnée spécifique par ID
app.get('/read/:id', async (req, res) => {
    const sql = "SELECT * FROM crudTest WHERE id = ?";
    const id = req.params.id;

    try {
        const [rows] = await db.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Donnée non trouvée" });
        }
        return res.json(rows[0]); // Renvoie seulement l'objet trouvé
    } catch (err) {
        console.error('Erreur lors de la requête SQL:', err);
        return res.status(500).json({ message: "Erreur dans le serveur" });
    }
});

// Route de mise à jour avec validation manuelle
app.put('/update/:id', async (req, res) => {
    const { nom, prenom, age } = req.body;
    const { id } = req.params;

    // Validation manuelle des champs
    const errors = validateInput(nom, prenom, age);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const [result] = await db.query('UPDATE crudTest SET nom = ?, prenom = ?, age = ? WHERE id = ?', [nom, prenom, age, id]);
        res.send('Données mises à jour avec succès');
    } catch (err) {
        console.error('Erreur lors de la mise à jour des données:', err);
        res.status(500).send('Erreur lors de la mise à jour des données');
    }
});

// Route de suppression
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM crudTest WHERE id = ?', [id]);
        res.send('Données supprimées avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression des données:', err);
        res.status(500).send('Erreur lors de la suppression des données');
    }
});

// Route de suppression ensemble
app.delete('/deleteAll/', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM crudTest');
        res.send('Toutes les données ont été supprimées avec succès');
    } catch (err) {
        console.error('Erreur lors de la suppression des données:', err);
        res.status(500).send('Erreur lors de la suppression des données');
    }
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server actif sur le port ${PORT}`);
});
