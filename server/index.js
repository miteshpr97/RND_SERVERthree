// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const customerRoutes = require('./routes/customerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const logistics = require('./routes/logistics');
const manPowerRoutes = require('./routes/manPowerRoutes');
const specialPackageRoutes = require('./routes/specialPackageRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes')
const transporterRoutes = require('./routes/transporterRoutes')
const vehicleDetailsRoutes = require('./routes/vehicleDetailsRoutes')


const mhe = require('./routes/mhe');

const app = express();
const port = process.env.PORT || 3306;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Use customer routes
app.use('/api/customers', customerRoutes);

// Use job routes
app.use('/api/new_jobs', jobRoutes);


// Use logictics routes
app.use('/api/logistics', logistics);


//use MHE Routes

app.use('/api/mhe', mhe);


// use manPower routes
app.use('/api/manPower', manPowerRoutes);



// use specialpackage routes
app.use('/api/special', specialPackageRoutes);

//use workOrderRoutes 
app.use('/api/workOrder', workOrderRoutes );


 app.use('/api/transport', transporterRoutes );

 app.use('/api/vehicle', vehicleDetailsRoutes );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



