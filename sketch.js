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
            
            const whileTraining = (epoch, loss)  => {
                print(epoch)
            }

            const finishedTraining = () => {
                print('training complete..');
                state = 'PREDICTION';
            }
            
            let options = {
                epochs: 200
            }

            model.normalizeData();

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

    const colors = {
        RED: [255,0,0],
        GREEN: [0,255,0],
        BLUE: [0,0,255]
    }

    const inputs = {
        x: mouseX,
        y: mouseY
    }

    const createCircle = () => {
        stroke(0);
        fill(...colors[targetColor]);
        circle(inputs.x, inputs.y ,80);
    }

    if (state == 'COLLECTION') {
        let target = {
            label: targetColor
        }
        model.addData(inputs, target);
        createCircle(targetColor);
    } 
    
    else if (state == 'PREDICTION') {
        const outputs = (error, results) => {
            if (error) return;
            
            targetColor = results[0].label;
            createCircle(targetColor);
            print(results);
        }
        model.classify(inputs, outputs);
    }
}
