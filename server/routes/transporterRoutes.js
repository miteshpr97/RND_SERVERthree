// routes/transporterRoutes.js
const express = require('express');
const db = require('../db');

const router = express.Router();


router.post('/', (req, res) => {
  const {
    Transporter_id,
    Name,
    Contact_Person,
    Phone_Number,
    Address
  } = req.body;

  // Define the SQL query to insert a new item
  const sql = 'INSERT INTO tbTransporterJOB (Transporter_id, Name, Contact_Person, Phone_Number, Address) VALUES (?, ?, ?, ?, ?)';

  // Execute the SQL query to insert the item data
  db.query(
    sql,
    [Transporter_id, Name, Contact_Person, Phone_Number, Address],
    (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('transportation data inserted:', result);
        res.status(201).json({ message: 'Transportation data inserted successfully' });
      }
    }
  );
});



// Get all job ManPower details
router.get('/', (req, res) => {

  const sql = 'SELECT * FROM tbTransporterJOB';

  // Execute the SQL query to retrieve ManPower detail data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Transportation details retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});



router.get('/:Transporter_id', (req, res) => {
  const { Transporter_id } = req.params;

  // Define the SQL query to retrieve job data by JobNo
  const sql = 'SELECT * FROM tbTransporterJOB WHERE Transporter_id = ?';

  // Execute the SQL query to retrieve job data
  db.query(sql, [Transporter_id], (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'WorkOrderNo not found' });
    } else {
      console.log('WorkOrderNo data retrieved:', rows[0]);
      res.status(200).json(rows[0]); // Send the retrieved data as JSON response
    }
  });
});





//Update a workorder details by Transporter id` 

router.patch('/:Transporter_id', (req, res) => {
    try {
      const { Transporter_id } = req.params;
      const updatedJobData = req.body;
  
      // Check if the job with the specified Transporter_id exists
      const checkExistenceQuery = 'SELECT * FROM tbTransporterJOB WHERE Transporter_id = ?';
      db.query(checkExistenceQuery, [Transporter_id], (err, rows) => {
        if (err) {
          console.error('MySQL query error:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Work not found' });
        }
  
        // Update the job data
        const updateQuery = 'UPDATE tbTransporterJOB SET ? WHERE Transporter_id = ?';
        db.query(updateQuery, [updatedJobData, Transporter_id], (err, result) => {
          if (err) {
            console.error('MySQL query error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Job data updated:', result);
            res.status(200).json({ message: 'Job details updated successfully' });
          }
        });
      });
    } catch (err) {
      console.error('Error handling job update:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // delete using Transporter_id
  
  router.delete('/:Transporter_id', (req, res) => {
    const { Transporter_id } = req.params;
  
    // Define the SQL query to delete a customer by customerCode
    const sql = 'DELETE FROM tbTransporterJOB WHERE Transporter_id = ?';
  
    // Execute the SQL query to delete the customer
    db.query(sql, [Transporter_id], (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        console.log('Transporter_id deleted:', result);
        res.status(200).json({ message: 'Job details deleted successfully' }); 
      }
    });
  })





module.exports = router;