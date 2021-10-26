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

exports.genRandomPageRequestQueue = genRandomPageRequestQueue;