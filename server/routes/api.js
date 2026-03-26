import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../lib/db.js';

const router = express.Router();

// Middleware to protect admin routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const result = await pool.query('SELECT id, username FROM admins WHERE id = $1', [decoded.id]);
            if (result.rows.length === 0) throw new Error('Not authorized');
            
            req.admin = result.rows[0];
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- ADMIN AUTH ROUTES ---
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const admin = result.rows[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
                return res.json({ id: admin.id, username: admin.username, token });
            }
        }
        res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create default admin if none exists (for dev purposes)
router.post('/admin/setup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length > 0) return res.status(400).json({ message: 'Admin already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const insertResult = await pool.query(
            'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- PROJECT ROUTES ---
// GET all projects
router.get('/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET single project by slug
router.get('/projects/:slug', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE slug = $1', [req.params.slug]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST new project (Protected)
router.post('/projects', protect, async (req, res) => {
    const { title, slug, category, year, description, image, link, preview, tech_stack, github } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO projects 
            (title, slug, category, year, description, image, link, preview, tech_stack, github) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, slug, category, year, description, image, link, preview, tech_stack, github]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// PUT update project (Protected)
router.put('/projects/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { title, slug, category, year, description, image, link, preview, tech_stack, github } = req.body;
    try {
        const result = await pool.query(
            `UPDATE projects 
            SET title = $1, slug = $2, category = $3, year = $4, description = $5, image = $6, link = $7, preview = $8, tech_stack = $9, github = $10 
            WHERE id = $11 RETURNING *`,
            [title, slug, category, year, description, image, link, preview, tech_stack, github, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE project (Protected)
router.delete('/projects/:id', protect, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- CONTACT ROUTES ---
// POST new contact message
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET all contact messages (Protected)
router.get('/contact', protect, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
