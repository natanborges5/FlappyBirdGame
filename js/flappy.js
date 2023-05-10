function newElement(tagName, className){
    const element = document.createElement(tagName)
    element.className = className
    return element
}
function Barrier(reverse = false){
    this.element = newElement("div","barrier")
    const border = newElement("div", "border-barrier")
    const body = newElement("div","body-barrier")
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)
    this.setAltura = altura => body.style.height = `${altura}px`
}

function PairOfBarriers(height,openness,position){
    this.element = newElement("div","pair-of-barriers")

    this.topBarrier = new Barrier(true)
    this.bottonBarrier = new Barrier(false)

    this.element.appendChild(this.topBarrier.element)
    this.element.appendChild(this.bottonBarrier.element)
    this.passageBottom = 0
    this.LuckyOpen = () =>{
        const topHeight = Math.random() * (height - openness)
        const bottonHeight = height - openness - topHeight
        this.topBarrier.setAltura(topHeight)
        this.bottonBarrier.setAltura(bottonHeight)
        this.passageBottom = bottonHeight
    }
    this.getPosition = () => parseInt(this.element.style.left.split("px")[0])
    this.setPosition = position => this.element.style.left = `${position}px`
    this.getWidth = () => this.element.clientWidth
    
    this.LuckyOpen()
    this.setPosition(position)
}

function Barriers(height, width, openness, space, notifyPoints){
    this.pairs = [
        new PairOfBarriers(height, openness, width),
        new PairOfBarriers(height, openness, width + space),
        new PairOfBarriers(height, openness, width + space * 2),
        new PairOfBarriers(height, openness, width + space * 3)
    ]
    const barrierVelocity = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setPosition(pair.getPosition() - barrierVelocity)
            if(pair.getPosition() < -pair.getWidth()){
                pair.setPosition(pair.getPosition() + space * this.pairs.length)
                pair.LuckyOpen()
            }
            const mid = width / 2
            const midCrossed = pair.getPosition() + barrierVelocity >= mid && pair.getPosition() < mid
            if(midCrossed) notifyPoints()
        })
    }
}
function Bird(gameHeight){
    let fly = false
    this.element = new newElement("img", "bird")
    this.element.src = "imgs/passaro.png"

    this.getYPosition = () => parseInt(this.element.style.bottom.split("px")[0])
    this.setYposition = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false
    
    this.animate = (flyOrNot) => {
        if(flyOrNot > 0.5){
            fly = true
        }else{
            fly = false
        }
        const newY = this.getYPosition() + (fly ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight
        if(newY <= 0){
            this.setYposition(0)
        }else if (newY >= maxHeight){
            this.setYposition(maxHeight)
        }else{
            this.setYposition(newY)
        }
    }
    this.setYposition(gameHeight / 2)
}

function Progress(){
    this.element = new newElement("span","progress")
    this.updatePoints = point =>{
        this.element.innerHTML = point
    }
    this.updatePoints(0)
}
function Overlapping(elementA, elementB){
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}
function HasCollided(bird, barrier){
    let collided = false
    barrier.pairs.forEach(pair => {
        if(!collided){
            const topBarrier = pair.topBarrier.element
            const bottonBarrier = pair.bottonBarrier.element
            collided = Overlapping(bird.element, topBarrier) || Overlapping(bird.element, bottonBarrier)
        }
    })
    return collided
}
function NeuralNetwork(){
    function softmax(arr) {
        const expArr = arr.map((x) => Math.exp(x));
        const expSum = expArr.reduce((acc, val) => acc + val);
        return expArr.map((x) => x / expSum);
      }
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x / 1000));
    }
    function relu(x) {
        return Math.max(0, x);
      }
    function hiddenLayer(inputs, hiddenWeights) {
        let hiddenOutputs = [];
        for (let i = 0; i < hiddenWeights.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputs.length; j++) {
                sum += inputs[j] * hiddenWeights[i][j];//[j];
            }
            hiddenOutputs.push(relu(sum));
        }
        return hiddenOutputs;
    }        
    function outputLayer(hiddenOutputs, outputWeights) {
        const outputLayerValues = [];
        for (let i = 0; i < outputWeights.length; i++) {
            let sum = 0;
            for (let j = 0; j < hiddenOutputs.length; j++) {
                sum += hiddenOutputs[j] * outputWeights[i][j];
            }
            outputLayerValues.push(sum);
        }
        return sigmoid(outputLayerValues);
    }
    this.UseNn = (inputs, hiddenWeights, outputWeights) =>{
        const hidden = hiddenLayer(inputs, hiddenWeights)
        return outputLayer(hidden, outputWeights) 
    }
    
}
function Genetic(){
    function generatePopulation(size, inputSize, hiddenSize, outputSize) {
        let population = [];
        for (let i = 0; i < size; i++) {
            let weights = {
                hidden: [],
                output: []
            };
            for (let j = 0; j < hiddenSize; j++) {
                let hiddenWeights = [];
                for (let k = 0; k < inputSize; k++) {
                    hiddenWeights.push(Math.random() * (1 - -1) + -1,);
                }
                weights.hidden.push(hiddenWeights);
            }
            for (let j = 0; j < outputSize; j++) {
                let outputWeights = [];
                for (let k = 0; k < hiddenSize; k++) {
                    outputWeights.push(Math.random() * (1 - -1) + -1,);
                }
                weights.output.push(outputWeights);
            }
            population.push(weights);
        }
        return population;
    }
    
    function fitness(individual, inputs, expectedOutputs) {
        let sumSquaredError = 0;
        for (let i = 0; i < inputs.length; i++) {
            let hiddenOutputs = hiddenLayer(inputs[i], individual);
            let output = outputLayer(hiddenOutputs, individual);
            let error = expectedOutputs[i] - output;
            sumSquaredError += error * error;
        }
        return 1 / (1 + Math.sqrt(sumSquaredError / inputs.length));
    }
    function selectParents(population, fitnessFunction) {
        let fitnessSum = 0;
        for (let i = 0; i < population.length; i++) {
            fitnessSum += fitnessFunction(population[i]);
        }
        let parents = [];
        for (let i = 0; i < 2; i++) {
            let randomFitness = Math.random() * fitnessSum;
            let currentSum = 0;
            for (let j = 0; j < population.length; j++) {
                currentSum += fitnessFunction(population[j]);
                if (currentSum > randomFitness) {
                    parents.push(population[j]);
                    break;
                }
            }
        }
        return parents;
    }
    function crossover(parents) {
        let child = {
            hidden: [],
            output: []
        };
        for (let i = 0; i < parents[0].hidden.length; i++) {
            let hiddenWeights = [];
            for (let j = 0; j < parents[0].hidden[i].length; j++) {
                let parentIndex = Math.floor(Math.random() * 2);
                hiddenWeights.push(parents[parentIndex].hidden[i][j]);
            }
            child.hidden.push(hiddenWeights)
        }
        for (let i = 0; i < parents[0].output.length; i++) {
            let outputWeights = [];
            for (let j = 0; j < parents[0].output[i].length; j++) {
                let parentIndex = Math.floor(Math.random() * 2);
                outputWeights.push(parents[parentIndex].output[i][j]);
            }
            child.output.push(outputWeights)
        }
        return child;
    }
    this.trainGenetic = async () => {
        const population = generatePopulation(10, 2, 6, 1)
        const game = new FlappyBirdForTraining(population)
        const result = await game.start()
        console.log("Finalizou!!")

    }
    
    
}

function FlappyBirdForTraining(population){
    let points = 0
    const gamearea = document.querySelector("[wm-flappy]")
    const height = gamearea.clientHeight
    const width = gamearea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400,() => progress.updatePoints(++points))

    this.BirdAndWeights = []
    population.forEach(pair => {
        const pop = {
            bird: new Bird(height),
            weights: {
                hidden: pair.hidden,
                output: pair.output
            },
            alive: true,
            fitness: 0
        }
        gamearea.appendChild(pop.bird.element)
        this.BirdAndWeights.push(pop)
    })

    const neuralNetwork = new NeuralNetwork()
    let actualBarrier = 0
    gamearea.appendChild(progress.element)
    barriers.pairs.forEach(pair => gamearea.appendChild(pair.element))
    this.NextBarrier = () => {
        const mid = width / 2
        barriers.pairs.forEach(function callback(pair,index){
            if(pair.getPosition() + 3 >= mid && pair.getPosition() < mid){
                if(actualBarrier == 3){
                    actualBarrier = 0
                }else{
                    actualBarrier++
                }
            }
        })
    }
    this.endGame = () => {
        const bar = document.querySelectorAll(".pair-of-barriers")
        bar.forEach(b => b.remove())
        document.querySelector(".bird").remove()
        document.querySelector(".progress").remove()
        //new FlappyBird(bestScore).start()
    }
    this.start = () => {
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                for(let i = 0; i < this.BirdAndWeights.length; i++){
                    let pop = this.BirdAndWeights[i]
                    if(this.IsAllDead(this.BirdAndWeights)){
                        clearInterval(timer)
                        this.endGame()
                        resolve(this.BirdAndWeights)
                        break
                    }
                    if(pop.alive == false) continue
                    const bird = pop.bird
                    barriers.animate()
                    this.NextBarrier()
                    const inputs = [
                        bird.getYPosition(),
                        parseFloat(barriers.pairs[actualBarrier].passageBottom.toFixed()) 
                    ]
                    const outputnn = neuralNetwork.UseNn(inputs, pop.weights.hidden, pop.weights.output)
                    console.log(outputnn)
                    bird.animate(outputnn)
                    if(actualBarrier == 2) pop.fitness += 200
                    pop.fitness++
                    if(HasCollided(bird,barriers)){
                        pop.alive = false
                    }
                }
            }, 20);
        })
        
        console.log("passou aq")
        
    }
    this.IsAllDead = (arr) =>{
        let counter = 0
        arr.forEach(a => {
            if(a.alive == false) counter++
        })
        if(counter == arr.length){
            return true
        }else false
    }
}
function FlappyBird(bestScore){
    let hiddenWeights = [
        [           
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
        ],
        [           
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
        ]
    ]
    let outputWeights = [
        [
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1,
            Math.random() * (1 - -1) + -1
        ]
    ];
    let points = 0
    const gamearea = document.querySelector("[wm-flappy]")
    const height = gamearea.clientHeight
    const width = gamearea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400,() => progress.updatePoints(++points))
    const bird = new Bird(height)
    const neuralNetwork = new NeuralNetwork()
    let actualBarrier = 0
    gamearea.appendChild(progress.element)
    gamearea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gamearea.appendChild(pair.element))

    this.endGame = () => {
        bestScore = bestScore > points ? bestScore : points
        document.querySelector("#totalScore").innerHTML = `Total Score: ${points}`
        document.querySelector("#bestScore").innerHTML = `Best Score ${bestScore}`
        document.querySelector(".endgame").style.visibility = "visible" 
        document.querySelector("#replay-button").onclick = function(){
            const bar = document.querySelectorAll(".pair-of-barriers")
            bar.forEach(b => b.remove())
            document.querySelector(".bird").remove()
            document.querySelector(".progress").remove()
            document.querySelector(".endgame").style.visibility = "hidden" 
            new FlappyBird(bestScore).start()
        }
    }
    this.NextBarrier = () => {
        const mid = width / 2
        barriers.pairs.forEach(function callback(pair,index){
            if(pair.getPosition() + 3 >= mid && pair.getPosition() < mid){
                if(actualBarrier == 3){
                    actualBarrier = 0
                }else{
                    actualBarrier++
                }
            }
        })
    }
    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate()
            this.NextBarrier()
            const inputs = [
                bird.getYPosition(),
                parseFloat(barriers.pairs[actualBarrier].passageBottom.toFixed()) 
            ]
            const outputnn = neuralNetwork.UseNn(inputs,hiddenWeights,outputWeights)
            console.log(outputnn)
            bird.animate(outputnn)

            // if(HasCollided(bird,barriers)){
            //     clearInterval(timer)
            //     this.endGame()
            // }
        }, 20);
    } 
}
function FlappyMenu(){
    document.querySelector("#singleplayer-button").onclick = function(){
        new FlappyBird(0).start()
        document.querySelector(".gamemenu").style.visibility = "hidden" 
    }
    document.querySelector("#multiplayer-button").onclick = function(){
        new FlappyBird(0).start()
        document.querySelector(".gamemenu").style.visibility = "hidden" 
    }
    document.querySelector("#trainia-button").onclick = function(){
        new Genetic().trainGenetic()
        document.querySelector(".gamemenu").style.visibility = "hidden" 
    }
}
new FlappyMenu()

