
// Import necessary modules
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();



// Define the route to handle job creation
router.post('/', (req, res) => {
  try {
    // Validate the request body to ensure required fields are present
    const requiredFields = [
      'customerCode',
      'JobNo',
      'JobsStartDate',
      'JobExpectedCompleteDate',
      'JobSummary',
      'GatePassType',
      'GatePassNumber',
      'LoadReturnDate',
      'JobRequestedBy',
      'ResearcherName',
      'JobTransactionType',
      'PickupLocation',
      'DeliveryLocation',
      'Weight',
      'packageType',
    ];

    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Set JobStatus to 'pending'
    const JobsStatus = '1';// New Job which is ready for plan = 1

    // Generate a unique UserCode
    const uniqueUserCode = uuidv4();

    // Capture the real-time JobCreationDateTime
    const JobCreationDateTime = new Date().toISOString();

    // Define the SQL query to insert a new job
    const sql = 'INSERT INTO tbNewJobs SET ?';

    // Job data to be inserted
    const jobData = {
      ...req.body,
      JobsStatus,
      UserCode: uniqueUserCode,
      JobCreationDateTime,
    };

    // Execute the SQL query to insert the job data
    db.query(sql, jobData, (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Job data inserted:', result);
        res.status(201).json({ message: 'Job data inserted successfully' });
      }
    });
  } catch (err) {
    console.error('Error handling job creation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// all newJobs get
router.get('/', (req, res) => {
  // Define the SQL query to retrieve all jobs
  const sql = 'SELECT * FROM tbNewJobs';

  // Execute the SQL query to retrieve job data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Reverse the data
      const reversedRows = rows.reverse();
      console.log('Job data retrieved and reversed:', reversedRows);
      res.status(200).json(reversedRows); // Send the reversed data as JSON response
    }
  });
});



// Define a GET route to retrieve the last JobNo value
router.get('/last-job-no', (req, res) => {
  try {
    // Define the SQL query to retrieve the last JobNo value
    const sql = 'SELECT JobNo FROM tbNewJobs ORDER BY JobNo DESC LIMIT 1';

    // Execute the SQL query to retrieve the last JobNo value
    db.query(sql, (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'No JobNo found' });
        } else {
          // Return the last JobNo value as JSON
          res.status(200).json({ JobNo: results[0].JobNo });
        }
      }
    });
  } catch (err) {
    console.error('Error handling last JobNo retrieval:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





//Get all jobs  where job status is 1
router.get('/jobStatusOne', (req, res) => {
  // Define the SQL query to retrieve all jobs
  const sql = 'SELECT * FROM tbNewJobs where JobsStatus = 1';

  // Execute the SQL query to retrieve job data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Job data retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});






//Get where Job status is 2
router.get('/jobStatusTwo', (req, res) => {
  // Define the SQL query to retrieve all jobs
  const sql = 'SELECT * FROM tbNewJobs where JobsStatus = 2';

  // Execute the SQL query to retrieve job data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Job data retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});


//GET WHERE JOB STATUS 3
router.get('/jobStatusThree', (req, res) => {
  // Define the SQL query to retrieve all jobs
  const sql = 'SELECT * FROM tbNewJobs where JobsStatus = 3';

  // Execute the SQL query to retrieve job data
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Job data retrieved:', rows);
      res.status(200).json(rows); // Send the retrieved data as JSON response
    }
  });
});



//Get a job by JobNo view single job no get all data 
router.get('/:JobNo', (req, res) => {
  const { JobNo } = req.params;

  // Define the SQL query to retrieve job data by JobNo
  const sql = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';

  // Execute the SQL query to retrieve job data
  db.query(sql, [JobNo], (err, rows) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Job not found' });
    } else {
      console.log('Job data retrieved:', rows[0]);
      res.status(200).json(rows[0]); // Send the retrieved data as JSON response
    }
  });
});


//Update a job by JobNo  for view JOb Only
router.put('/:JobNo', (req, res) => {
  try {
    const { JobNo } = req.params;
    const updatedJobData = req.body;

    // Check if the job with the specified JobNo exists
    const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
    db.query(checkExistenceQuery, [JobNo], (err, rows) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Update the job data
      const updateQuery = 'UPDATE tbNewJobs SET ? WHERE JobNo = ?';
      db.query(updateQuery, [updatedJobData, JobNo], (err, result) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Job data updated:', result);
          res.status(200).json({ message: 'Job data updated successfully' });
        }
      });
    });
  } catch (err) {
    console.error('Error handling job update:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//  when job ready to plan then job status chnges and updated




router.put('/update/:JobNo', (req, res) => {
  try {
    const { JobNo } = req.params;
    const updatedJobData = req.body;
    const JobsPlanDate = new Date().toISOString(); // Get current timestamp in ISO format

    // Check if the job with the specified JobNo exists
    const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
    db.query(checkExistenceQuery, [JobNo], (err, rows) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Update the job data, including setting JobsStatus to 2 and adding JobsPlanDate
      const updateQuery = 'UPDATE tbNewJobs SET JobsStatus = ?, JobsPlanDate = ? WHERE JobNo = ?';
      db.query(updateQuery, ['2', JobsPlanDate, JobNo], (err, result) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Job data updated:', result);
          res.status(200).json({ message: 'Job data updated successfully' });
        }
      });
    });
  } catch (err) {
    console.error('Error handling job update:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// router.put('/update/:JobNo', (req, res) => {
//   try {
//     const { JobNo } = req.params;
//     const updatedJobData = req.body;

//     // Get the current timestamp in ISO format in Indian Standard Time (IST)
//     const JobsPlanDate = moment().tz('Asia/Kolkata').format();

//     // Check if the job with the specified JobNo exists
//     const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
//     db.query(checkExistenceQuery, [JobNo], (err, rows) => {
//       if (err) {
//         console.error('MySQL query error:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'Job not found' });
//       }

//       // Update the job data, including setting JobsStatus to 2 and adding JobsPlanDate
//       const updateQuery = 'UPDATE tbNewJobs SET JobsStatus = ?, JobsPlanDate = ? WHERE JobNo = ?';
//       db.query(updateQuery, ['2', JobsPlanDate, JobNo], (err, result) => {
//         if (err) {
//           console.error('MySQL query error:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           console.log('Job data updated:', result);
//           res.status(200).json({ message: 'Job data updated successfully' });
//         }
//       });
//     });
//   } catch (err) {
//     console.error('Error handling job update:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });







// for closed jobs when close button clicked  updated  to jobstatus 3
router.put('/closed/:JobNo', (req, res) => {
  try {
    const { JobNo } = req.params;
    const updatedJobData = req.body;

    // Check if the job with the specified JobNo exists
    const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
    db.query(checkExistenceQuery, [JobNo], (err, rows) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Update the job data, including setting JobsStatus to 3
      const updateQuery = 'UPDATE tbNewJobs SET ? WHERE JobNo = ?';
      updatedJobData.JobsStatus = '3'; // Setting JobsStatus to 3
      db.query(updateQuery, [updatedJobData, JobNo], (err, result) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Job data updated:', result);
          res.status(200).json({ message: 'Job data updated successfully' });
        }
      });
    });
  } catch (err) {
    console.error('Error handling job update:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// router.put('/closed/:JobNo', (req, res) => {
//   try {
//     const { JobNo } = req.params;
//     const updatedJobData = req.body;

//     // Check if the job with the specified JobNo exists
//     const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
//     db.query(checkExistenceQuery, [JobNo], (err, rows) => {
//       if (err) {
//         console.error('MySQL query error:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'Job not found' });
//       }

//       // Update the job data, including setting JobsStatus to 3 and updating JobsClosingDate
//       const updateQuery = 'UPDATE tbNewJobs SET JobsStatus = ?, JobsClosingDate = CURRENT_DATE() WHERE JobNo = ?';
//       const values = ['3', JobNo];
//       db.query(updateQuery, values, (err, result) => {
//         if (err) {
//           console.error('MySQL query error:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           console.log('Job data updated:', result);
//           res.status(200).json({ message: 'Job data updated successfully' });
//         }
//       });
//     });
//   } catch (err) {
//     console.error('Error handling job update:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// router.put('/closed/:JobNo', (req, res) => {
//   try {
//     const { JobNo } = req.params;
//     const updatedJobData = req.body;

//     // Check if the job with the specified JobNo exists
//     const checkExistenceQuery = 'SELECT * FROM tbNewJobs WHERE JobNo = ?';
//     db.query(checkExistenceQuery, [JobNo], (err, rows) => {
//       if (err) {
//         console.error('MySQL query error:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'Job not found' });
//       }

//       // Get the current date in the "dd/mm/yyyy" format
//       const currentDate = new Date().toLocaleDateString('en-GB');

//       // Update the job data, including setting JobsStatus to 3 and updating JobsClosingDate
//       const updateQuery = 'UPDATE tbNewJobs SET JobsStatus = ?, JobsClosingDate = ? WHERE JobNo = ?';
//       const values = ['3', currentDate, JobNo];
//       db.query(updateQuery, values, (err, result) => {
//         if (err) {
//           console.error('MySQL query error:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           console.log('Job data updated:', result);
//           res.status(200).json({ message: 'Job data updated successfully' });
//         }
//       });
//     });
//   } catch (err) {
//     console.error('Error handling job update:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




// using Jobno delete 
router.delete('/:JobNo', (req, res) => {
  const { JobNo } = req.params;

  // Define the SQL query to delete a customer by customerCode
  const sql = 'DELETE FROM tbNewJobs WHERE JobNo = ?';

  // Execute the SQL query to delete the customer
  db.query(sql, [JobNo], (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      console.log('JobNo deleted:', result);
      res.status(204).send(); // Send a 204 No Content response on successful deletion
    }
  });
});




// use for count inside to inside , inside to outside, outside to inside, outside to outside   for use dashboard screen

//for count inside to inside
router.get('/inside/count', (req, res) => {
  const jobTransactionType = 'Inside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = 'SELECT COUNT(*) AS count FROM tbNewJobs WHERE JobTransactionType = ?';
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const count = results[0].count;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//for count inside to outside
router.get('/outside/count', (req, res) => {
  const jobTransactionType = 'Inside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = 'SELECT COUNT(*) AS count FROM tbNewJobs WHERE JobTransactionType = ?';
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const count = results[0].count;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//for count  outside to inside
router.get('/outsideToinside/count', (req, res) => {
  const jobTransactionType = 'Outside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = 'SELECT COUNT(*) AS count FROM tbNewJobs WHERE JobTransactionType = ?';
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const count = results[0].count;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});

// for count outside to outside
router.get('/outsideToOutside/count', (req, res) => {
  const jobTransactionType = 'Outside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = 'SELECT COUNT(*) AS count FROM tbNewJobs WHERE JobTransactionType = ?';
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const count = results[0].count;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});







// for plan page show count

// for inside to inside
router.get('/plan/insidetoinside', (req, res) => {
  const jobTransactionType = 'Inside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '1'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//inside to outside
router.get('/plan/insidetoutside', (req, res) => {
  const jobTransactionType = 'Inside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '1'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//outside to inside  for plan
router.get('/plan/outsidetoinside', (req, res) => {
  const jobTransactionType = 'Outside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '1'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


// outside to outside for plan

router.get('/plan/outsideToutside', (req, res) => {
  const jobTransactionType = 'Outside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '1'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});





// for close page show count



// for inside to inside
router.get('/close/insidetoinside', (req, res) => {
  const jobTransactionType = 'Inside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '2'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//inside to outside
router.get('/close/insidetoutside', (req, res) => {
  const jobTransactionType = 'Inside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '2'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//outside to inside  for plan
router.get('/close/outsidetoinside', (req, res) => {
  const jobTransactionType = 'Outside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '2'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


// outside to outside for plan

router.get('/close/outsideToutside', (req, res) => {
  const jobTransactionType = 'Outside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '2'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


////   For finish job count show

// for inside to inside
router.get('/finish/insidetoinside', (req, res) => {
  const jobTransactionType = 'Inside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '3'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//inside to outside
router.get('/finish/insidetoutside', (req, res) => {
  const jobTransactionType = 'Inside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '3'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


//outside to inside  for plan
router.get('/finish/outsidetoinside', (req, res) => {
  const jobTransactionType = 'Outside To Inside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '3'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});


// outside to outside for plan

router.get('/finish/outsideToutside', (req, res) => {
  const jobTransactionType = 'Outside To Outside'; // Specify the JobTransactionType value

  // Define the SQL query to count rows with the specified JobTransactionType
  const sql = `
    SELECT
      JobTransactionType,
      COUNT(*) AS TransactionCount
    FROM
      tbNewJobs
    WHERE
      JobsStatus = '3'
      AND JobTransactionType = ?
    GROUP BY
      JobTransactionType;
  `;
  const params = [jobTransactionType];

  // Execute the SQL query to retrieve the count
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Use results[0].TransactionCount to access the count value
      const count = results[0] ? results[0].TransactionCount : 0;
      console.log(`Count of rows with JobTransactionType '${jobTransactionType}':`, count);
      res.status(200).json({ count }); // Send the count as a JSON response
    }
  });
});







router.get('/plan/jobTransactions', (req, res, next) => {
  const sql = `
    SELECT
        JobTransactionType,
        COUNT(*) AS TransactionCount
    FROM
        tbNewJobs
    WHERE
        JobsStatus = '1'
        AND JobTransactionType IN ('Inside To Inside', 'Inside To Outside', 'Outside To Inside', 'Outside To Outside')
    GROUP BY
        JobTransactionType;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      next(err); // Pass the error to the error handling middleware
      return;
    }

    res.json(results);
  });
});




router.get('/closed/jobTransactions', (req, res) => {
  const sql = `
    SELECT
        JobTransactionType,
        COUNT(*) AS TransactionCount
    FROM
        tbNewJobs
    WHERE
        JobsStatus = '2'
        AND JobTransactionType IN ('Inside To Inside', 'Inside To Outside', 'Outside To Inside', 'Outside To Outside')
    GROUP BY
        JobTransactionType;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    res.json(results);
  });
});






router.get('/finish/jobTransactions', (req, res) => {
  const sql = `
    SELECT
        JobTransactionType,
        COUNT(*) AS TransactionCount
    FROM
        tbNewJobs
    WHERE
        JobsStatus = '3'
        AND JobTransactionType IN ('Inside To Inside', 'Inside To Outside', 'Outside To Inside', 'Outside To Outside')
    GROUP BY
        JobTransactionType;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }

    res.json(results);
  });
});







// Export the router
module.exports = router;
















