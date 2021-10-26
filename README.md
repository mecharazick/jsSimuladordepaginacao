# jsSimuladordepaginacao

Esse projeto compreende um programa que simula o comportamento de da Unidade de Gestão de Memória de um Sistema Operacional.

Ele foi codificado utilizando Javascript ES6 e utilizando o Node.js como interpretador para a execução do código.
A versão utilizada do Node.js foi a v14.7.0 LTS, para permitir reprodução posterior do código.

# Sumário

1 - [Como utilizar](https://github.com/mecharazick/jsSimuladordepaginacao#como-utilizar)
2 - [Dependências](https://github.com/mecharazick/jsSimuladordepaginacao#dependências)
3 - [Estrutura do projeto](https://github.com/mecharazick/jsSimuladordepaginacao#estrutura-do-projeto)
4 - [Estrutura do simulador](https://github.com/mecharazick/jsSimuladordepaginacao##estrutura-do-simulador)
4 - [Algoritmos de substituição de página](https://github.com/mecharazick/jsSimuladordepaginacao#algoritmos-de-substituição-de-página)
5 - [Referências](https://github.com/mecharazick/jsSimuladordepaginacao#referências)

# Como utilizar

Para executar os códigos basta ter a versão correta do Node.js e, com o terminal na pasta do projeto (A que engloba as pastas src e views e os arquivos index.js, package.json e etc), baixar as dependências dele, que permitem seu uso.

```
Ex: "E:/jsSimuladorDePaginacao"
```

Para baixar as dependências utilizar o comando:

```
npm install
```

Esse comando automaticamente lerá as dependências definidas no package.json e fará seu download na página do projeto.

Após isso, para se iniciar a execução do código basta utilizar o comando npm start

```
npm start
```

Isso inicia a execução do código utilizando do nodemon, um daemon que inicializa o código rapidamente e se mantém vigiando o código para reiniciá-lo em falhas ou mudanças.

Para matar o processo do nodemon, basta ir no terminal que está rodando ele e utilizar

```
Ctrl + C
```

# Dependências

As dependências utilizadas no projeto são o acima mencionado Nodemon, o express, o cors e o ejs.
Tanto o express quanto o cors são utilizados para prover uma interface gráfica para o projeto, acessável pelo navegador.
O express é utilizado para prover ferramentas robustas para servidores HTTP, sendo uma excelente solução para SPA's, web sites, hibridos ou APIs HTTP públicas.
Por isso ele foi selecionado e utilizado no projeto para inicializar um servidor HTTP no computador do usuário na porta 8080 e prover, ao ser acessado, páginas html construídas em ejs para chamar as funcionalidades do site.
O cors é uma dependência utilizada para configurar as políticas cors utilizadas pelo express.
O ejs é uma dependência utilizada para construir o conteuído estático utilizando ejs que é um híbrido de html e javascript.

# Estrutura do projeto

Esse projeto consiste da página principal que contém o arquivo central que inicializa o projeto (o "index.js"), os arquivos package.json que é utilizado pelo Node.js para identificar as configuraçõs do projeto e o arquivo .gitignore para impedir que as dependências do projeto, na pasta node_modules, sejam enviadas para o git pois consistem de arquivos facilmente baixados pelo Node.js e que ocupam espaço desnecessário no repositório.
Além disso, há 3 pastas: "node_modules" que armazena as dependências utilizadas pelo Node.js, a pasta "views" que contém a parte de conteúdo estático que é provida pelo express ao acessar as páginas http na rota do localhost que ele utiliza e por fim a pasta src que contém os scripts principais do projeto.
Em src há os scripts de funcionalidades do projeto, sendo eles o routes.js que configura as rotas http acessáveis e o que cada uma delas fará ao ser acessada, o MMU.js, o qual contém a definição da classe MMU e implementação dos algoritmos de substituição de página, e os scripts de utilidades em "utils", com a função de geração de seguência aleatória de referências de página, e os scripts de definição das classes PageTable e FrameTable em "Tables".
Cada script se comunica com o outro através das chamadas:

```
require("caminho relativo do script") //Essa função importa o que estiver sendo exportado no script requerido

module.exports //Objeto de conteúdo exportável por um sript, ao ser atribuída alguma informação a ele, essa
//informação poderá ser lida no script em que houver uma referência de require apontando para esse script.
```

# Estrutura do simulador

Para a parte funcional do projeto, temos 3 classes representando entidades do SO: a classe principal MMU que representa a unidade de gerenciamento de memória e contém métodos e atributos atribuídos ao MMU e por isso é nessa classe em que estão implementados os algoritmos de substituição de página; a classe PageTable que contém métodos e atributos atribuídos à tabela de páginas; e a classe FrameTable, que contém métodos e atributos atribuídos à tabela de quadros.

Das classes mais simples, que são a PageTable e a FrameTable, ambas possuem um atributo de mesmo nome que é um array que armazena dados de tipos quaisquer e seus indíces são utilizados para representar a identificação da página/quadro. Dessa forma, há a aproximação da abordagem de uma tabela.

Na PageTable, a primeira linha é utilizada para armazenar o endereço físico da memória em que estão armazenadas as páginas dadas pelos índices das colunas da tabela e a segunda linha contém uma string representando o bit de validade (Seus valores possíveis são "valid" ou "invalid").
Além disso, essa classe possui métodos para buscar o endereço físico/frame em que se encontra uma página, ao receber a identificação da página, para checar se uma página se encontra em memória e métodos para armazenar o endereço de uma página e modificar seu bit de validade e fazer o inverso, desalocando uma página e modificando seu bit de validade.

Na FrameTable, tal como na PageTable, os índices das linhas da tabela de frames são utilizados para representar o endereço do frame. Em sua única linha, é armazenado o bit de estado do quadro, ou seja, se ele está "ocupado" ou "vago", que são as strings usadas para representar esse estado.

# Algoritmos de substituição de página

Para a implementação dos algoritmos, foi utilizada uma estrutura idêntica em que se modifica apenas o algoritmo de determinação da página vítima.
A estrutura básica consiste de:

```
limpa dados e inicializa as tabelas de página, frame e memória
para cada página da fila de requisição faça{
    se(pagina_em_memoria){
        incrementa hit e modifica estrutura de página vítima quando pertinente
    } se não {
        incrementa pageFaults
        busca quadro livre
        se(diferente_de_quadro_livre /*Não tem quadro livre*/){

            determina página vítima

            busca o endereço da página vítima
            remove a página vítima da memória
            atualiza tabela de quadros
            atualiza tabela de páginas

            armazena endereço do novo quadro livre
        }
        armazena página no endereço livre
        atualiza tabela de quadros
        atualiza tabela de páginas
        passa para a próxima requisição
    }
}
```
Cada algoritmo individualmente utiliza uma política para determinação da página vítima:

O algoritmo do FIFO foi implementado utilizando um array para armazenar a ordem em que cada página foi colocada na memória e removendo as entradas de página das páginas vítima quando retiradas da memória.

O algoritmo LRU foi implementado utilizando um array como um stack, jogando para o topo da pilha a página em memória que fora referenciada mais recentemente e adotando como página vítima a página que fica no fundo da pilha(No caso, o começo do array) e removendo sua entrada da pilha quando essa página vítima fora removida da memória.

O algoritmo SC foi implementado utilizando um sistema semelhante ao do LRU, uma vez que ele é como se fosse uma versão melhorada do mesmo, dessa forma ele possui um ponteiro e uma lista de páginas em memória (feita utilizando uma matriz em que as colunas da primeira linha contém a página em memória e sua posição exata e na segunda linha os bits de "segunda chance da página"). Toda vez que uma página é referenciada e ela está na memória, é levantado seu bit de segunda chance. Quando é necessário escolher uma página vítima, o ponteiro percorre a lista de páginas em memória utilizando um algoritmo Round-Robin e escolhe a primeira página que ele encontrar que não tenha o bit de segunda chance levantado, abaixando os bits de segunda chance das páginas que ele apontar.

O algoritmo OTM é o mais interessante deles, pois requer a utilização de um comportamento impossível de ser realizado na vida real de um SO. Para ele, ao selecionar a página vítima é primeiro analisada a fila de requisição de página para ver qual a página em memória que levará mais tempo para ser requerida novamente. Essa página será marcada como vítima e removida da memória.
O interessante desse algoritmo é que na vida real é impossível saber quando uma página será requerida novamente, por isso esse é um algoritmo idealizado.

# Referências

{1} [Node.js](https://nodejs.org/en/about/)
{2} [express](https://expressjs.com)
{3} [cors](https://www.npmjs.com/package/cors)
{4} [nodemon](https://www.npmjs.com/package/nodemon)
{5} [ejs](https://ejs.co)
