import app from './index.js';

const PORT = Number(process.env.PORT || 8000);

app.listen(PORT, () => {
  console.log(`bff-service running on http://localhost:${PORT}`);
});