import express from "express";
import { setupApp } from "./setup-app";
import { connectToDb } from "./db";

// создание приложения
const app = express();
setupApp(app);

// порт приложения
const PORT = process.env.PORT || 5001;

const start = async () => {
  const isConnected = await connectToDb();

  if (!isConnected) {
    console.error("Application can't start");
    process.exit(1);
  }

  // запуск приложения
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

start();
