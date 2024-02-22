import app from 'express';
import cors from 'cors';

const a = app();

a.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

export default a;
