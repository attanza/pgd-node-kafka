import "reflect-metadata";
import "dotenv/config";
import { App } from "./app";
import { validateEnv } from "./utils/validateEnv";
validateEnv();
const app = new App();
app.start(10000);
