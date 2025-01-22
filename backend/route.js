const express = require('express');
const axios = require('axios');
const Transaction = require('./Transaction');
const router = express.Router();

router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get(process.env.THIRD_PARTY_API_URL);
    const transactions = response.data;

    // Clear existing data
    await Transaction.deleteMany();

    // Seed new data
    await Transaction.insertMany(transactions);
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

router.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
  
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
  
    const filter = {
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
      ],
    };
  
    try {
      const transactions = await Transaction.find(filter)
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
      res.status(200).json(transactions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });
  
  router.get('/statistics', async (req, res) => {
    const { month } = req.query;
  
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
  
    try {
      const transactions = await Transaction.find({
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      });
  
      const totalSales = transactions.reduce((sum, t) => sum + (t.sold ? t.price : 0), 0);
      const soldItems = transactions.filter((t) => t.sold).length;
      const notSoldItems = transactions.length - soldItems;
  
      res.status(200).json({ totalSales, soldItems, notSoldItems });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });
  
  router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
  
    const startOfMonth = new Date(`2024-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
  
    try {
      const transactions = await Transaction.find({
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      });
  
      const ranges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901+': 0,
      };
  
      transactions.forEach((t) => {
        if (t.price <= 100) ranges['0-100']++;
        else if (t.price <= 200) ranges['101-200']++;
        else if (t.price <= 300) ranges['201-300']++;
        else if (t.price <= 400) ranges['301-400']++;
        else if (t.price <= 500) ranges['401-500']++;
        else if (t.price <= 600) ranges['501-600']++;
        else if (t.price <= 700) ranges['601-700']++;
        else if (t.price <= 800) ranges['701-800']++;
        else if (t.price <= 900) ranges['801-900']++;
        else ranges['901+']++;
      });
  
      res.status(200).json(ranges);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
  });


module.exports = router;
