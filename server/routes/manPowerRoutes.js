// routes/manPowerRoutes.js
const express = require('express');
const db = require('../db');

const router = express.Router();



router.post('/', (req, res) => {
  const manPowerData = req.body; // Assuming req.body is an array of objects

  // Define the SQL query to insert multiple job ManPower details
  const sql =
    'INSERT INTO tbNewJobManPowerDetails (JobNo, ManPowerQty, TaskDate, BuyCost) VALUES ?';

  // Convert the array of objects into a 2D array of values
  const values = manPowerData.map((item) => [
    item.JobNo,
    item.ManPowerQty,
    item.TaskDate,
    item.BuyCost,
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Job ManPower details inserted:', result);
      res
        .status(201)
        .json({ message: 'Job ManPower details inserted successfully' });
    }
  });
});




// Get all job ManPower details
router.get('/', (req, res) => {
  // Define the SQL query to retrieve all job ManPower details
  // const sql = 'SELECT * FROM tbNewJobManPowerDetails';


  const sql = 'SELECT * FROM tbNewJobManPowerDetails';

  // Execute the SQL query to retrieve ManPower detail data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Job ManPower details retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});

module.exports = router;
