const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

let corsOptions = {
  origin: '*',
  credential: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/',
  express.static(path.join(__dirname, 'public/dist', 'outbody.html')),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist', 'outbody.html'));
});

app.listen(port, () => {
  console.log(port, '=> server open!');
});
