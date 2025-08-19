const express = require('express');
const documentRoutes = require('./routes/documentRoutes.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();



app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/testapi', documentRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

