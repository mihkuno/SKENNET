

function setup() {
    createCanvas(windowWidth, windowHeight);

    let options = {
        inputs: ['xCoord','yCoord'],
        outputs: ['color'],
        task: 'classification'
    }

    model = ml5.neuralNetwork(options);
}

function mousePressed() {
    stroke(0);
    fill(180,0,0);
    circle(mouseX,mouseY,80);
}
