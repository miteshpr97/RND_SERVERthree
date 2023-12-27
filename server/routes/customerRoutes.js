// routes/customerRoutes.js
const express = require('express');
const db = require('../db');

const router = express.Router();



router.post('/', (req, res) => {
  const {
    customerCode,
    customerName,
    address,
    city,
    pin,
    phone1,
    phone2,
    email,
    website,
    contactPerson,
  } = req.body;

  // Define the SQL query to insert a new customer
  const sql = 'INSERT INTO tbCustomersMaster (customerCode, customerName, address, city, pin, phone1, phone2, email, website, contactPerson) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  // Execute the SQL query to insert the customer data
  db.query(
    sql,
    [
      customerCode,
      customerName,
      address,
      city,
      pin,
      phone1,
      phone2,
      email,
      website,
      contactPerson,
    ],
    (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Customer data inserted:', result);
        res.status(201).json({ message: 'Customer data inserted successfully' });
      }
    }
  );
});




//Get all customers
// router.get('/', (req, res) => {
//   // Define the SQL query to retrieve all customers
//   const sql = 'SELECT * FROM tbCustomersMaster';

//   // Execute the SQL query to retrieve customer data
//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error('MySQL query error:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       console.log('Customer data retrieved:', rows);
//       res.status(200).json(rows); // Send the retrieved data as JSON response
//     }
//   });
// });



// get all customer data reverse method used
router.get('/', (req, res) => {
  // Define the SQL query to retrieve all customers
  const sql = 'SELECT * FROM tbCustomersMaster';

  // Execute the SQL query to retrieve customer data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Reverse the data
      const reversedRows = rows.reverse();
      console.log('Customer data retrieved and reversed:', reversedRows);
      res.status(200).json(reversedRows); // Send the reversed data as JSON response
    }
  });
});






// Update customer data by customerCode (PUT /:customerCode)
router.put('/:customerCode', (req, res) => {
  const { customerCode } = req.params;
  const updatedCustomerData = req.body;

  // Define the SQL query to update customer data by customerCode
  const sql = 'UPDATE tbCustomersMaster SET ? WHERE customerCode = ?';

  // Execute the SQL query to update customer data
  db.query(sql, [updatedCustomerData, customerCode], (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      console.log('Customer data updated:', result);
      res.status(200).json({ message: 'Customer data updated successfully' });
    }
  });
});



// All customer code get
router.get('/cutomercode', (req, res) => {
  // Define the SQL query to retrieve only the customercode column
  const sql = 'SELECT customerCode FROM tbCustomersMaster';

  // Execute the SQL query to retrieve customer data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Customer codes retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});





// lastCustomer customer code 
router.get('/lastCustomerCode', (req, res) => {
  // Define the SQL query to retrieve the last customerCode
  const sql = 'SELECT customerCode FROM tbCustomersMaster ORDER BY customerCode DESC LIMIT 1';

  // Execute the SQL query to retrieve the last customerCode
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: 'No customer codes found' });
      } else {
        const lastCustomerCode = rows[0].customerCode;
        console.log('Last CustomerCode retrieved:', lastCustomerCode);
        res.status(200).json({ customerCode: lastCustomerCode }); // Send the retrieved data as JSON response
      }
    }
  });
});




// GET CUsTOMER DETAILS USING CUSTOMER CODE 

router.get('/:customerCode', (req, res) => {
  const { customerCode } = req.params;

  // Define the SQL query to retrieve customer data by customerCode
  const sql = 'SELECT * FROM tbCustomersMaster WHERE customerCode = ?';

  // Execute the SQL query to retrieve customer data
  db.query(sql, [customerCode], (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      console.log('Customer data retrieved:', rows[0]);
      res.status(200).json(rows[0]); // Send the retrieved data as JSON response
    }
  });
});




// DELETE customer by customerCode
router.delete('/:customerCode', (req, res) => {
  const { customerCode } = req.params;

  // Define the SQL query to delete a customer by customerCode
  const sql = 'DELETE FROM tbCustomersMaster WHERE customerCode = ?';

  // Execute the SQL query to delete the customer
  db.query(sql, [customerCode], (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      console.log('Customer deleted:', result);
      res.status(204).send(); // Send a 204 No Content response on successful deletion
    }
  });
});





module.exports = router;














