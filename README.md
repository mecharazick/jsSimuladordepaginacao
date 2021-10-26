# jsSimuladordepaginacao

Esse projeto compreende um programa que simula o comportamento de da Unidade de Gestão de Memória de um Sistema Operacional.

Ele foi codificado utilizando Javascript ES6 e utilizando o Node.js como interpretador para a execução do código.
A versão utilizada do Node.js foi a v14.7.0 LTS, para permitir reprodução posterior do código.

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
# Dependências

As dependências utilizadas no projeto são o acima mencionado Nodemon, o express, o cors e o ejs.
Tanto o express quanto o cors são utilizados para prover uma interface gráfica para o projeto, acessável pelo navegador. 
O express é utilizado para prover ferramentas robustas para servidores HTTP, sendo uma excelente solução para SPA's, web sites, hibridos ou APIs HTTP públicas.
Por isso ele foi selecionado e utilizado no projeto para inicializar um servidor HTTP no computador do usuário na porta 8080 e prover, ao ser acessado, páginas html construídas em ejs para chamar as funcionalidades do site.
O cors é uma dependência utilizada para configurar as políticas cors utilizadas pelo express.
O ejs é uma dependência utilizada para construir o conteuído estático utilizando ejs que é um híbrido de html e javascript.
# Estrutura

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