import { pool } from './db.js';

const createTables = async () => {
    try {
        console.log('Connecting to PostgreSQL to create tables...');
        
        // Projects Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                category VARCHAR(100) NOT NULL,
                year VARCHAR(10) NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(255) NOT NULL,
                link VARCHAR(255),
                preview VARCHAR(255),
                tech_stack TEXT[],
                github VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Projects table created or already exists');

        // Contacts Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Contacts table created or already exists');

        // Admins Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Admins table created or already exists');

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error.message);
        process.exit(1);
    }
};

createTables();
