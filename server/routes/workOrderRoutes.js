// routes/manPowerRoutes.js
const express = require('express');
const db = require('../db');

const router = express.Router();




// router.post('/', (req, res) => {

//   console.log('Incoming data:', req.body);

//   const workOrder = req.body;

//   const sql =
//     'INSERT INTO tbWorkOrderDetails (JobNo, ServiceDescription, ServiceLineNo, UoM, ContractRate) VALUES ?';

//   const values = workOrder.map(item => [
//     item.JobNo,
//     item.ServiceDescription,
//     item.ServiceLineNo,
//     item.UoM,
//     item.ContractRate,
//   ]);

//   console.log('Values to be inserted:', values);

//   db.query(sql, [values], (err, result) => {
//     if (err) {
//       console.error('MySQL query error:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     console.log('Data inserted successfully');
//     res.status(201).json({ message: 'Data inserted successfully' });
//   });
// })




router.post('/', (req, res) => {
  const {
    ServiceDescription,
    ServiceLineNo,
    UoM,
    ContractRate,
  } = req.body;

  // Define the SQL query to insert a new item
  const sql = 'INSERT INTO tbWorkOrderDetails (ServiceDescription, ServiceLineNo, UoM, ContractRate) VALUES (?, ?, ?, ?)';

  // Execute the SQL query to insert the item data
  db.query(
    sql,
    [ServiceDescription, ServiceLineNo, UoM, ContractRate],
    (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Item data inserted:', result);
        res.status(201).json({ message: 'Item data inserted successfully' });
      }
    }
  );
});






// Get all job ManPower details
router.get('/', (req, res) => {
  // Define the SQL query to retrieve all job ManPower details
  // const sql = 'SELECT * FROM tbNewJobManPowerDetails';


  const sql = 'SELECT * FROM tbWorkOrderDetails';

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







//Get a single workorder details by ServiceLineNo 
router.get('/:WorkOrderNo', (req, res) => {
  const { WorkOrderNo } = req.params;

  // Define the SQL query to retrieve job data by JobNo
  const sql = 'SELECT * FROM tbWorkOrderDetails WHERE WorkOrderNo = ?';

  // Execute the SQL query to retrieve job data
  db.query(sql, [WorkOrderNo], (err, rows) => {
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


//Update a workorder by WorkOrderNo 
router.patch('/:WorkOrderNo', (req, res) => {
  try {
    const { WorkOrderNo } = req.params;
    const updatedJobData = req.body;

    // Check if the job with the specified WorkOrderNo exists
    const checkExistenceQuery = 'SELECT * FROM tbWorkOrderDetails WHERE WorkOrderNo = ?';
    db.query(checkExistenceQuery, [WorkOrderNo], (err, rows) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Work not found' });
      }

      // Update the job data
      const updateQuery = 'UPDATE tbWorkOrderDetails SET ? WHERE WorkOrderNo = ?';
      db.query(updateQuery, [updatedJobData, WorkOrderNo], (err, result) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Job data updated:', result);
          res.status(200).json({ message: 'Work details updated successfully' });
        }
      });
    });
  } catch (err) {
    console.error('Error handling job update:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// delete using WorkOrderNo
router.delete('/:WorkOrderNo', (req, res) => {
  const { WorkOrderNo } = req.params;

  // Define the SQL query to delete a customer by customerCode
  const sql = 'DELETE FROM tbWorkOrderDetails WHERE WorkOrderNo = ?';

  // Execute the SQL query to delete the customer
  db.query(sql, [WorkOrderNo], (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      console.log('WorkOrderNo deleted:', result);
      res.status(204).send(); // Send a 204 No Content response on successful deletion
    }
  });
});





module.exports = router;



