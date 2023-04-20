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

    this.LuckyOpen = () =>{
        const topHeight = Math.random() * (height - openness)
        const bottonHeight = height - openness - topHeight
        this.topBarrier.setAltura(topHeight)
        this.bottonBarrier.setAltura(bottonHeight)
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

    this.animate = () => {
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

function FlappyBird(){
    let points = 0
    const gamearea = document.querySelector("[wm-flappy]")
    const height = gamearea.clientHeight
    const width = gamearea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400,() => progress.updatePoints(++points))
    const bird = new Bird(height)

    gamearea.appendChild(progress.element)
    gamearea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gamearea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate()
            bird.animate()
            if(HasCollided(bird,barriers)){
                clearInterval(timer)
            }
        }, 20);
    } 
}
new FlappyBird().start()
