import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'transactions.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeData() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });

    const initialData = {
      transactions: [],
      categories: {
        income: ['Salary', 'Freelance', 'Investment'],
        expense: ['Food', 'Transportation', 'Utilities', 'Entertainment']
      }
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}


// Helper functions
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { transactions: [], categories: { income: [], expense: [] } };
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// Routes

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = await readData();
    const newTransaction = {
      id: uuidv4(),
      type,
      category,
      amount: parseFloat(amount),
      description: description || '',
      date,
      createdAt: new Date().toISOString()
    };

    data.transactions.push(newTransaction);
    await writeData(data);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Add new category
app.post('/api/categories', async (req, res) => {
  try {
    const { type, name } = req.body;
    
    if (!type || !name || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type or missing name' });
    }

    const data = await readData();
    
    if (!data.categories[type].includes(name)) {
      data.categories[type].push(name);
      await writeData(data);
    }
    
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    
    const initialLength = data.transactions.length;
    data.transactions = data.transactions.filter(t => t.id !== id);
    
    if (data.transactions.length === initialLength) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await writeData(data);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Start server
async function startServer() {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();