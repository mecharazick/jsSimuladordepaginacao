# jsSimuladordepaginacao

Esse projeto compreende um programa que simula o comportamento de da Unidade de Gestão de Memória de um Sistema Operacional.

Ele foi codificado utilizando Javascript ES6 e utilizando o Node.js como interpretador para a execução do código.
A versão utilizada do Node.js foi a v14.7.0 LTS, para permitir reprodução posterior do código.

# Como utilizar

Para executar os códigos basta ter a versão correta do Node.js e, com o terminal na pasta do projeto, baixar as dependências do mesmo que permitem seu uso utilizando.

```
npm install
```

Esse comando automaticamente lerá as dependências definidas no package.json e fará seu download na página do projeto.

Após isso, para se iniciar a execução do código basta fazer

```
npm start
```

Isso inicia a execução do código utilizando do nodemon, um demon que inicializa o código rapidamente e se mantém vigiando o código para reiniciá-lo em falhas ou mudanças.
# Dependências

As dependências utilizadas no projeto são o acima mencionado Nodemon, o express e o cors.
Tanto o express quanto o cors são utilizados para prover uma interface gráfica para o projeto, acessável pelo navegador. 
O express é utilizado para prover ferramentas robustas para servidores HTTP, sendo uma excelente solução para SPA's, web sites, hibridos ou APIs HTTP públicas.
Por isso ele foi selecionado e utilizado no projeto para inicializar um servidor HTTP no computador do usuário na porta 8080 e prover, ao ser acessado, páginas html construídas em ejs para chamar as funcionalidades do site.
O cors é uma dependência utilizada para configurar as políticas cors utilizadas pelo express.

# Estrutura

Para a parte funcional do projeto, temos que 
