/* Integrantes:
Alisson Carvalho Vasconcelos - 11511EMT016
Betania Assunção - 11411BSI243
João Pedro Abi-jaudi P. Ferreira - 11511EMT015
Lucas Pinheiro Moraes - 11721EMT001
*/

const express = require("express");
const cors = require("cors");
const router = require("./src/routes");
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/", router);

app.listen(port, () => {
  console.log(`Ouvindo na porta ${port}, para visualizar acesse: http://localhost:${port}`);
});
