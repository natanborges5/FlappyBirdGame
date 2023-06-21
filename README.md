<h1 align="center">FlappyBird AI </h1>
<p align="center">The game made to play against an artificial inteligence!
 </p>

<p align="center">
 <a href="#contexto-geral">Game Context</a> •
 <a href="#arvore-de-pastas">Tree Folder</a> •
 <a href="#objetivo">Objective</a> •
 <a href="#pre-requisitos">Pré-requisitos</a> •
 <a href="#rodando-a-api">Rodando a aplicação</a> •
</p>

## 📝 [Game Context](#contexto-geral)
O jogo foi criado todo em JavaScript, HTML e CSS com o objetivo de praticar as minhas habilidades com essas tecnologias e aprender inteligencia artificial.

A Loja Micro Service nasceu como uma necessidade da Pet Friends com a intenção de permitir gerenciar Lojas e mostrar as ofertas de produtos.
Com base nisso, a Pet Friends seguiu com a seguinte estrutura:

<img width="663" alt="image" src="https://user-images.githubusercontent.com/43764175/207766798-04b4a2ad-4e63-4443-b092-714e3ba80caa.png">


Tendo os serviços de:
- Assinatura
- Pedido
- Pagamento
- Loja
- Produto
- Cliente

Cada serviço ficou com um desenvolvedor(a) responsável e também a comunicação entre os serviços foi gerenciada
pelas pessoas responsáveis pelo mesmo.

O serviço de Loja consulta apenas o serviço de Produtos a partir de consultas HTTP.

**Nesta documentação focaremos exclusivamente no serviço de Loja.**

## 🌳 [Árvore de pastas](#arvore-de-pastas)

<img width="663" alt="image" src="https://user-images.githubusercontent.com/57094854/208120156-ca67245d-9bc4-4eec-8e1a-3a943e74c2a6.png">

## 📎 [Objetivo](#objetivo)
Esta aplicação tem como principal objetivo disponibilizar todo o contexto referente a Loja. 
Além disso, consulta o micro serviço de Produtos para mostrar a oferta de produtos referente a cada Loja.

Responsabilidades do serviço de assinatura:
- Criar uma Loja;
- Ofertar Produtos;
- Listar todas as Lojas;
- Editar Lojas;

## ✅ [Pré-requisitos](#pre-requisitos)
Nessa aplicação foram utilizadas algumas tecnologias, cada uma delas teve uma importância significativa
no projeto, sendo elas:

- **C#**: Linguagem de programação utilizada para escrever toda a aplicação. Escolhi essa linguagem por
trabalhar com ela atualmente e a que mais me interessa;


- [**.NET**](https://dotnet.microsoft.com/pt-br/): .NET funciona de forma rapida e produtiva para micro serviços;


- [**Docker**](https://www.docker.com/): Utilizado para colocar a aplicação em um container e subir pra nuvem;


- [**MongoDB Atlas**](https://www.mongodb.com/home): Banco de dados na nuvem escolhido para a aplicação por ser de facil configuração
 e não pesar na maquina virtual. 


- [**RabbitMQ**](https://www.rabbitmq.com/): Serviço de mensageria implementado na aplicação, porém não está sendo usado no momento.

Logo, para conseguir rodar com êxito essa aplicação, é necessário ter todas as ferramentas.

## 🎲 [Rodando a aplicação](#rodando-a-api)

### Docker
```bash
# Para iniciar o container é necessario estar na pasta:
$ \GRUPO-ALFA-INFNET-MICROSERVICOS\LojaMicroServiceAT-ALFA>

# Após entrar na pasta é necessario realizar o docker compose up da imagem com o seguinte comando:
$ docker compose up .

# Após inicializar o composer, acesse a porta da API:
$ http://localhost:3064/swagger/index.html
```

**Por conta de ter um workflow e uma pipeline sendo rodada pelo GitHub Actions, quando essa aplicação é 
atualizada uma imagem do docker é criada no Docker Hub. Você consegue ver as versões da imagem 
[aqui](https://hub.docker.com/repository/docker/natanborrges/storeserviceat).**
