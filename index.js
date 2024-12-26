import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors('*'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// app.use('/api-vi', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    status: '404 Not Found',
    message: 'Not Found',
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
