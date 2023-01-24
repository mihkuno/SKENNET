let model;
let targetColor = [255,0,0];

function setup() {
    createCanvas(windowWidth, windowHeight);

    let options = {
        inputs: ['xCoord','yCoord'],
        outputs: ['color'],
        task: 'classification'
    }

    model = ml5.neuralNetwork(options);
}

function keyPressed() {
    switch(key) {
        case '1': //r
            targetColor = [255, 0, 0];
            print('RED');
            break;
        case '2': //g
            targetColor = [0, 255, 0];
            print('GREEN');
            break;
        case '3': //b
            targetColor = [0, 0, 255];
            print('BLUE');
            break;
    }
}

function mousePressed() {
    stroke(0);
    fill(...targetColor);
    circle(mouseX,mouseY,80);
}