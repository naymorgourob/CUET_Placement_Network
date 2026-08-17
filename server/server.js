import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const { default: app, connectDatabase } = await import('./src/app.js');

const PORT = process.env.PORT || 5002;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
