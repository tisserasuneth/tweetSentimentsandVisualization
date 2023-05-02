const tf = require('@tensorflow/tfjs-node');
const remote = require('@huggingface/node-remote-models');

async function runInference() {
  const model = await tf.loadLayersModel(remote.hfTransformer('distilbert-base-uncased'));

  const inputText = 'This is a test sentence.';
  const inputTensor = tf.tensor([inputText]);
  
  const output = model.predict(inputTensor);
  const scores = output.squeeze().arraySync()[0];
  console.log(scores);
}

runInference().catch(console.error);
