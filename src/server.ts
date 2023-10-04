import express from 'express';
import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import config from './config';

const app = express();

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  dbConfig: asValue(config.dbConfig)
});

app.use(scopePerRequest(container));
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server esta corriendo en: http://localhost:${PORT}`);
});