const PageTable = require("./Tables/PageTable");
const FrameTable = require("./Tables/FrameTable");

class MMU {
  constructor(properties) {
    this.properties = {
      ramSize: properties?.ramSize || 1,
      pagesSize: properties?.pagesSize || 10,
    };
    this.hits = { fifo: 0, lru: 0, otm: 0, wsm: 0, sc: 0 };
    this.pageFaults = { fifo: 0, lru: 0, otm: 0, wsm: 0, sc: 0 };
    this.pageTable = new PageTable(this.properties.pagesSize);
    this.frameTable = new FrameTable(this.properties.ramSize);
    this.physicalMemory = new Array(this.properties.ramSize);
  }
  //função para inicializar as tabelas zeradas
  initEnvironment() {
    this.pageTable = new PageTable(this.properties.pagesSize);
    this.frameTable = new FrameTable(this.properties.ramSize);
    this.physicalMemory = new Array(this.properties.ramSize);
  }
  //Métodos para aplicação dos algoritmos de substituição de página
  fifo(pageRequestQueue) {
    this.initEnvironment();
    // A instância de Array definida abaixo serve para armazenar a ordem em que
    let pageRequestMapper = new Array();
    for (let i = 0; i < pageRequestQueue.length; i++) {
      if (this.pageTable.checkIfPageInMemory(pageRequestQueue[i])) {
        this.hits["fifo"] += 1;
        //Caso a página já esteja na memória, passa para a próxima requisição de página na fila
        continue;
      } else {
        this.pageFaults["fifo"] += 1;
        pageRequestMapper.push(pageRequestQueue[i]);
        let freeFrame = this.frameTable.getFreeSlot();
        if (freeFrame === -1) {
          // Essa parte da função recupera qual a página vítima entrou na memória a mais tempo, de forma
          // a permitir que ela seja removida pelo algoritmo.
          const oldestPage = pageRequestMapper[0];
          pageRequestMapper.shift();

          //Removendo a página vítima da memória
          const pageFrame = this.pageTable.getPageFrame(oldestPage);
          this.physicalMemory[pageFrame] = null;
          this.frameTable.setFreeFrame(pageFrame);
          this.pageTable.removeFrame(oldestPage);

          //Setando posição livre da memória
          freeFrame = pageFrame;
        }

        //Alocando processo na memória
        this.physicalMemory[freeFrame] = pageRequestQueue[i];
        this.frameTable.setOnUseFrame(freeFrame); //Atualizando tabela de frames livres
        this.pageTable.setFrame(pageRequestQueue[i], freeFrame); //Atualizando referência de páginas

        continue; //Dá continuidade ao processo
      }
    }
    return { pageHits: this.hits["fifo"], pageFaults: this.pageFaults["fifo"] };
  }
  otm(pageRequestQueue) {
    this.initEnvironment();
    for (let i = 0; i < pageRequestQueue.length; i++) {
      if (this.pageTable.checkIfPageInMemory(pageRequestQueue[i])) {
        this.hits["otm"] += 1;
        //Caso a página já esteja na memória, passa para a próxima requisição de página na fila
        continue;
      } else {
        this.pageFaults["otm"] += 1;
        let freeFrame = this.frameTable.getFreeSlot();
        if (freeFrame === -1) {
          let requestedPagesUsageCounter = [];
          //Definindo e buscando a página vítima
          //Busca a página na memória
          const inMemoryPages = this.pageTable
            .getTable()
            .map((item, index) => {
              return [index, ...item];
            })
            .filter((item) => {
              return item[2] === "valid";
            });

          //Separa o futuro da fila
          const remainingQueue = pageRequestQueue.slice(
            i + 1,
            pageRequestQueue.length
          );
          //Armazena cada página que está na memória junto com a distância até a próxima chamada da mesma
          requestedPagesUsageCounter = inMemoryPages.map((item) => {
            return [item[0], remainingQueue.indexOf(item[0])];
          });
          //Sorteia as páginas na memória em ordem decrescente de quanto falta para ser chamada novamente
          requestedPagesUsageCounter.sort((a, b) => {
            return b[1] - a[1];
          });
          //Define que a página ótima é a primeira, sendo ela a página que mais demorará a ser chamada
          //novamente

          const optimalPage =
            requestedPagesUsageCounter[1][1] !== -1
              ? requestedPagesUsageCounter[0][0]
              : requestedPagesUsageCounter[1][0];

          //Removendo a página vítima da memória
          const pageFrame = this.pageTable.getPageFrame(optimalPage);
          this.physicalMemory[pageFrame] = null;
          this.frameTable.setFreeFrame(pageFrame);
          this.pageTable.removeFrame(optimalPage);

          //Setando posição livre da memória
          freeFrame = pageFrame;
        }

        //Alocando processo na memória
        this.physicalMemory[freeFrame] = pageRequestQueue[i];
        this.frameTable.setOnUseFrame(freeFrame); //Atualizando tabela de frames livres
        this.pageTable.setFrame(pageRequestQueue[i], freeFrame); //Atualizando referência de páginas
        continue; //Dá continuidade ao processo
      }
    }
    return { pageHits: this.hits["otm"], pageFaults: this.pageFaults["otm"] };
  }

  lru(pageRequestQueue) {
    this.initEnvironment();
    //Define a pilha de páginas em memória, para indicar a ordem em que estão sendo requisitadas
    let stack = [];
    for (let i = 0; i < pageRequestQueue.length; i++) {
      if (this.pageTable.checkIfPageInMemory(pageRequestQueue[i])) {
        this.hits["lru"] += 1;
        stack = manipStack(stack, pageRequestQueue[i]);
        //Caso a página já esteja na memória, passa para a próxima requisição de página na fila
        continue;
      } else {
        this.pageFaults["lru"] += 1;
        let freeFrame = this.frameTable.getFreeSlot();
        if (freeFrame === -1) {
          //Definindo e buscando a página vítima
          //Remove a entrada da página vítima da pilha de uso
          const leastUsedPage = stack.shift();
          //Removendo a página vítima da memória
          const pageFrame = this.pageTable.getPageFrame(leastUsedPage);
          this.physicalMemory[pageFrame] = null;
          this.frameTable.setFreeFrame(pageFrame);
          this.pageTable.removeFrame(leastUsedPage);

          //Setando posição livre da memória
          freeFrame = pageFrame;
        }

        //Alocando processo na memória
        this.physicalMemory[freeFrame] = pageRequestQueue[i];
        this.frameTable.setOnUseFrame(freeFrame); //Atualizando tabela de frames livres
        this.pageTable.setFrame(pageRequestQueue[i], freeFrame); //Atualizando referência de páginas
        stack = manipStack(stack, pageRequestQueue[i]);
        continue; //Dá continuidade ao processo
      }
    }
    return { pageHits: this.hits["lru"], pageFaults: this.pageFaults["lru"] };
    function manipStack(stack, page) {
      let filteredStack = stack.filter((item) => {
        return item !== page;
      });
      filteredStack.push(page);
      return filteredStack;
    }
  }
  sc(pageRequestQueue) {
    this.initEnvironment();
    let pageReferenceTable = [];
    let pointer = 0;
    for (let i = 0; i < pageRequestQueue.length; i++) {
      if (this.pageTable.checkIfPageInMemory(pageRequestQueue[i])) {
        this.hits["sc"] += 1;
        pageReferenceTable = pageReferenceTable.map((item) => {
          if (item.page === pageRequestQueue[i]) item.refBit = 1;
          return item;
        });
        //Caso a página já esteja na memória, passa para a próxima requisição de página na fila
        continue;
      } else {
        this.pageFaults["sc"] += 1;
        let freeFrame = this.frameTable.getFreeSlot();
        if (freeFrame === -1) {
          let scPage;
          while (pointer < pageReferenceTable.length) {
            if (pageReferenceTable[pointer].refBit === 0) {
              scPage = pageReferenceTable[pointer].page;
              pointer =
                pointer === pageReferenceTable.length - 1 ? 0 : pointer + 1;
              break;
            }
            pageReferenceTable[pointer].refBit = 0;
            pointer =
              pointer === pageReferenceTable.length - 1 ? 0 : pointer + 1;
          }
          //Removendo a página vítima da memória
          const pageFrame = this.pageTable.getPageFrame(scPage);
          this.physicalMemory[pageFrame] = null;
          this.frameTable.setFreeFrame(pageFrame);
          this.pageTable.removeFrame(scPage);

          //Setando posição livre da memória
          freeFrame = pageFrame;
        }

        //Alocando processo na memória
        this.physicalMemory[freeFrame] = pageRequestQueue[i];
        this.frameTable.setOnUseFrame(freeFrame); //Atualizando tabela de frames livres
        this.pageTable.setFrame(pageRequestQueue[i], freeFrame); //Atualizando referência de páginas
        pageReferenceTable[freeFrame] = {
          page: pageRequestQueue[i],
          refBit: 0,
        };
        continue; //Dá continuidade ao processo
      }
    }
    return { pageHits: this.hits["sc"], pageFaults: this.pageFaults["sc"] };
  }
  wsm(pageRequestQueue) {}
}

module.exports = MMU;
