import { configDotenv } from "dotenv";
import databaseConnection from "./db/index.js";
import { app } from "./app.js";

configDotenv();

databaseConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening to the port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error" + error.message);
  });
