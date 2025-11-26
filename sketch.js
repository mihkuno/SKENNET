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
    RED: [255, 0, 0],
    GREEN: [0, 255, 0],
    BLUE: [0, 0, 255]
  };

  // FIXED: inputs now match model definition (x, y)
  const inputs = {
    x: mouseX,
    y: mouseY
  };

  const drawCircle = () => {
    stroke(0);
    fill(...colors[targetColor]);
    circle(inputs.x, inputs.y, 80);
  };

  if (state === 'COLLECTION') {
    model.addData(inputs, { label: targetColor });
    drawCircle();
  }

  else if (state === 'PREDICTION') {
    model.classify(inputs, (err, results) => {
      if (err) {
        print(err);
        return;
      }

      targetColor = results[0].label; // predicted label
      drawCircle();
      print(results);
    });
  }
}
