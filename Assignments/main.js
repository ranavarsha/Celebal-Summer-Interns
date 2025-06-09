const fs = require('fs').promises; 

async function runFileOperations() {
  try {
    await fs.mkdir('myFolder', { recursive: true });

    await fs.writeFile('myFolder/message.txt', 'Hi from async/await!');

    const content = await fs.readFile('myFolder/message.txt', 'utf8');
    console.log('File content:', content);
  } catch (err) {
    console.error('Error during file operations:', err);
  }
}

runFileOperations();
