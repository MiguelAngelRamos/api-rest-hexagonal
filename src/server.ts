import express from 'express';
import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import config from './config';
import { MysqlConnection } from './infrastructure/db/MysqlConnection';

const app = express();

//* Creamos el contenedor
const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});
//* Estamos registrando dentro del contenedor.
container.register({
  dbConfig: asValue(config.dbConfig),
  dbConnection: asClass(MysqlConnection).singleton()
});

app.use(scopePerRequest(container));
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server esta corriendo en: http://localhost:${PORT}`);
});