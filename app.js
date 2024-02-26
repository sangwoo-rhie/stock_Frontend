import express, { urlencoded, json } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: 'http://52.79.115.32:3000',
    credentials: true,
  }),
);

app.use(urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public/dist')));
app.use(json());

// 맨 처음 랜딩페이지 (localhost:3001)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/dist', 'login.html'));
});

app.listen(PORT, () => {
  console.log(PORT, '=> server open!');
});

// 백엔드 : npm run start
// 프론트엔드 : node app.js
