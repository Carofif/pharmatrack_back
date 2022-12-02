const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { server, upload } = require('./config');
const { generateRoutes } = require('./routes');

const app = express();

app.use(cors());

// enable files upload
app.use(fileUpload(upload.config));
app.use(express.static(upload.repositoryName));

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

generateRoutes(app);

app.listen(server.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on ${server.hostname}: ${server.port}`);
});
