import dotenv from 'dotenv';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import test from 'node:test';


dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:${PORT}" , 
  }));


const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT), 
  ssl: { rejectUnauthorized: false }, 
});

app.use(express.json());


// app.post('/api/insert', async (req: Request, res: Response) => {
//     const { categoryNumber, budget, categoryColor, bgImageUrl, categoryName } = req.body;
  
//     try {
//       // Validate required fields
//       if (!categoryNumber || !budget || !categoryColor || !categoryName) {
//         return res.status(400).json({ error: 'Category number, budget, category color, and category name are required.' });
//       }
  
//       // Prepare the SQL query with bgImageUrl as optional
//       const insertQuery = `
//         INSERT INTO categories (category_number, budget, category_color, background_image, category_name)
//         VALUES ($1, $2, $3, $4, $5)
//         RETURNING *;
//       `;
  
//       // Insert the category data into the database, setting bgImageUrl to NULL if not provided
//       const values = [categoryNumber, budget, categoryColor, bgImageUrl || null, categoryName];
//       const result = await pool.query(insertQuery, values);
  
//       res.status(200).json({ message: 'Category added successfully!', data: result.rows[0] });
//     } catch (error) {
//       console.error('Error inserting data:', error);
//       res.status(500).json({ error: 'Server error while inserting data.' });
//     }
//   });
    
// app.get('/data', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT * FROM Category'); 
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     res.status(500).send('Server error');
//   }
// });

const PORT = process.env.PGPORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


