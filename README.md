<h1 align="center">FlappyBird AI </h1>
<p align="center">The game made to play against an artificial inteligence!
 </p>

<p align="center">
 <a href="#contexto-geral">Game Context</a> •
 <a href="#objetivo">Objective</a> •
 <a href="#pre-requisitos">Prerequisites</a> •
 <a href="#rodando-a-api">Running the game</a> •
</p>

## 📝 [Game Context](#contexto-geral)
The game was created entirely in JavaScript, HTML and CSS in order to practice my skills with these technologies and learn artificial intelligence.
The objective of the game is to pass through the pipes without touching them, the first player to touch the pipes loses.
The artificial intelligence was developed using only JavaScript, without any auxiliary library, a neural network was created with 4 input data (Y position of the bird, distance from the nearest pipe, position of the top opening of the pipe and the bottom opening), 6 neurons with a hidden layer, the ReLu activation function is used at the input of the hidden layer and at the output Sigmoid. To train the neural network and adjust the weights a genetic algorithm was used, each generation trains 50 individuals up to a maximum of 100 generations.

## ✅ [Prerequisites](#pre-requisitos)
In this application, some technologies were used, each of them had a significant importance
in the project, namely:

- **JS**: Programming language used to write the entire application. I chose this language because
working with her currently is what interests me the most;

- [**NODE**](https://nodejs.org/en): As an asynchronous event-driven JavaScript runtime;


- [**HTML**](https://www.docker.com/): Used to render the game;


- [**CSS**](https://www.mongodb.com/home): Used to style the game;

## 🎲 [Running the game](#rodando-a-api)
To run the game, just download the files and open the flappy.html document
