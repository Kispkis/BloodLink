require('dotenv').config();
const express = require('express');
const cors = require('cors');
const v1Routes = require('./routes/v1');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1', v1Routes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`BloodLink API running at http://localhost:${port}`));
