const { spawn } = require('child_process');

function installPythonLib(){
  const pip = spawn('pip', ['install', '-r', 'requirements.txt']);

  pip.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  pip.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  pip.on('close', (code) => {
    console.log(`Pip exited with code ${code}`);
  });
}

module.exports = installPythonLib