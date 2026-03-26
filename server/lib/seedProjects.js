import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const projects = [
    {
        title: "Oscillinx",
        slug: "oscillinx",
        category: "LLM / SaaS",
        year: "2025",
        description: "An advanced Large Language Model (LLM) platform providing powerful natural language processing and intelligent conversational capabilities.",
        image: "linear-gradient(to bottom right, #1a1a1a, #000)",
        link: "https://oscillinx.in",
        preview: "https://i.ibb.co/PZx8xCxX/image.png",
        tech_stack: ["React", "Node.js", "LLM", "SaaS"],
        github: ""
    },
    {
        title: "DecorMind",
        slug: "decormind",
        category: "AI Room Designer / SaaS",
        year: "2025",
        description: "An immersive furniture discovery platform featuring 3D product configurations and mood-based filtering.",
        image: "linear-gradient(to bottom right, #1a1a1a, #000)",
        link: "https://decormindai.vercel.app",
        preview: "https://i.ibb.co/DgMF4HSg/screencapture-decormindai-vercel-app-2026-01-12-15-15-38.png",
        tech_stack: ["Next.js", "AI", "Vercel"],
        github: ""
    },
    {
        title: "DineStack",
        slug: "dinestack",
        category: "Restaurant Management / SaaS",
        year: "2026",
        description: "A comprehensive restaurant management platform featuring QR table ordering, real-time analytics, and seamless integration across web and desktop.",
        image: "linear-gradient(to bottom right, #000, #1a1a1a)",
        link: "https://dinestack.in",
        preview: "https://i.ibb.co/67pnn6Sw/image.png",
        tech_stack: ["React", "Node.js", "PostgreSQL", "Desktop"],
        github: ""
    }
];

async function seed() {
    try {
        for (const p of projects) {
            // Check if project already exists by slug
            const existing = await pool.query('SELECT id FROM projects WHERE slug = $1', [p.slug]);
            if (existing.rows.length > 0) {
                console.log(`Project "${p.title}" already exists, skipping.`);
                continue;
            }

            await pool.query(
                `INSERT INTO projects (title, slug, category, year, description, image, link, preview, tech_stack, github)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [p.title, p.slug, p.category, p.year, p.description, p.image, p.link, p.preview, p.tech_stack, p.github]
            );
            console.log(`Inserted: ${p.title}`);
        }
        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await pool.end();
    }
}

seed();
