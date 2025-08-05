import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});



const terminalFunction = () => {

  rl.question("$ ", (answer) => {
    console.log(`${answer}: command not found`);
    // Recursively call the function to keep prompting for input
    terminalFunction();
    // rl.close();
  });
}

terminalFunction();
