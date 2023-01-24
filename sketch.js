const COLORS = {
    RED: [255,0,0],
    GREEN: [0,255,0],
    BLUE: [0,0,255]
}

let model;
let state = 'COLLECTION'; // COLLECTION & PREDICTION
let targetColor = 'RED';

function setup() {
    createCanvas(windowWidth, windowHeight);

    let options = {
        inputs: ['xCoord','yCoord'],
        outputs: ['color'],
        task: 'classification',
        debug: 'true'
    }

    model = ml5.neuralNetwork(options);
}

function keyPressed() {

    switch(key) {
        case 'p':
            print('training started..');
            model.normalizeData();
            let options = {
                epochs: 200
            }
            model.train(options, 
                        whileTraining, 
                        finishedTraining);
            break;
        case '1': //r
            targetColor = 'RED';
            break;
        case '2': //g
            targetColor = 'GREEN';
            break;
        case '3': //b
            targetColor = 'BLUE';
            break;
    }
    print(targetColor);
}

function whileTraining(epoch, loss) {
    print(epoch)
}

function finishedTraining() {
    print('training complete..')
}

function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    }

    let target = {
        label: targetColor
    }

    model.addData(inputs, target);

    stroke(0);
    fill(...COLORS[targetColor]);
    circle(mouseX,mouseY,80);
}