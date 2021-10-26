const MMU = require("./src/MMU");
const memoryManagmentUnit = new MMU({ ramSize: 4, pagesSize: 10 });

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

(function () {
  const pageRequestQ =
  genRandomPageRequestQueue(10);
  // [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
  console.log(pageRequestQ);
  // memoryManagmentUnit.fifo(pageRequestQ);
  // memoryManagmentUnit.otm(pageRequestQ);
  // memoryManagmentUnit.lru(pageRequestQ);
  // memoryManagmentUnit.sc(pageRequestQ);
  console.log(memoryManagmentUnit.pageFaults);
})();

//Função que gera uma lista aleatória de páginas para serem buscadas na memória
function genRandomPageRequestQueue(pageRequestQtt) {
  const minPage = 0;
  const maxPage = 9;
  let pageRequestQueue = new Array(pageRequestQtt);
  for (let i = 0; i < pageRequestQueue.length; i++) {
    pageRequestQueue[i] = Math.round(
      Math.random() * (maxPage - minPage) + minPage
    );
  }
  return pageRequestQueue;
}

// readline.question("Qual o tamanho de quadros?", (frames) => {
//   readline.close();
// });
