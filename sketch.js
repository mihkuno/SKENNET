let model;
let state = 'COLLECTION'; // COLLECTION → TRAINING → PREDICTION
let targetColor = 'RED';

async function setup() {
  // TensorFlow backend
  await tf.setBackend('webgl');
  await tf.ready();

  createCanvas(windowWidth, windowHeight);
  background(180);

  // IMPORTANT: inputs must match the keys you use later (x, y)
  let options = {
    inputs: ['x','y'],
    outputs: ['color'],
    task: 'classification',
    debug: true
  };

  model = ml5.neuralNetwork(options);
}

function keyPressed() {
  switch (key) {
    case 'p':
      state = 'TRAINING';
      print('Training started...');

      const whileTraining = (epoch, logs) => {
        if (logs) print(`Epoch ${epoch} | Loss: ${logs.loss}`);
      };

      const finishedTraining = () => {
        print('Training complete!');
        state = 'PREDICTION';
      };

      model.normalizeData();

      let trainOptions = { epochs: 200 };
      model.train(trainOptions, whileTraining, finishedTraining);
      break;

    case '1':
      targetColor = 'RED';
      break;
    case '2':
      targetColor = 'GREEN';
      break;
    case '3':
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

    // --- FIX IS HERE: Change 'x' to 'xCoord' and 'y' to 'yCoord' ---
    const inputs = {
        xCoord: mouseX, // Must match the name in setup()
        yCoord: mouseY  // Must match the name in setup()
    }

    const createCircle = () => {
        stroke(0);
        // The fill color needs to be set based on the global targetColor
        // which might be set by key press or predicted by the model.
        fill(...colors[targetColor]);
        circle(inputs.xCoord, inputs.yCoord ,80);
    }
    
    // An optional improvement: Ensure the drawing only happens when collecting or predicting
    if (state == 'COLLECTION') {
        let target = {
            color: targetColor // Input expects keys 'xCoord', 'yCoord'. Target expects 'color'.
        }
        // console.log('Adding data:', inputs, target); // Optional debugging
        model.addData(inputs, target);
        createCircle(targetColor);
    } 
    
    else if (state == 'PREDICTION') {
        const outputs = (error, results) => {
            if (error) {
                print('Prediction Error:', error);
                return;
            }
            
            // The label key is 'color', not 'label', based on your model definition:
            // outputs: ['color']
            targetColor = results[0].label;
            
            // To be robust, use the raw prediction values instead of the global mouseX/mouseY
            // since you want to draw *where the click occurred*.
            createCircle(targetColor);
            print(results);
        }
        model.classify(inputs, outputs);
    }
}
