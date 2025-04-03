import { resolve } from 'path';
import express from 'express';
import { handler } from '../build/handler.js';

const app = express();

// Serve the uploads directory as static files
app.use('/uploads', express.static(resolve('./uploads')));

app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
