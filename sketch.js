const COLORS = {
    RED: [255,0,0],
    GREEN: [0,255,0],
    BLUE: [0,0,255]
}

let model;
let state = 'COLLECTION'; // COLLECTION, TRAINING, PREDICTION
let targetColor = 'RED';

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(180);

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
            state = 'TRAINING'
            print('training started..');
            
            let options = {
                epochs: 200
            }

            model.normalizeData();

            const whileTraining = (epoch, loss)  => {
                print(epoch)
            }

            const finishedTraining = () => {
                print('training complete..');
                state = 'PREDICTION';
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
}

function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    }

    const createCircle = (color) => {
        stroke(0);
        fill(...COLORS[color]);
        circle(mouseX,mouseY,80);
    }

    if (state == 'COLLECTION') {
        
        let target = {
            label: targetColor
        }
        
        model.addData(inputs, target);
        createCircle(targetColor);

    } else if (state == 'PREDICTION') {
        
        model.classify(inputs, (error, results) => {
            if (error) return;
            
            targetColor = results[0].label;
            createCircle(targetColor);
            print(results);
        });
    }
}
