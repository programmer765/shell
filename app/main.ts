import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});



// const terminalFunction = () => {

//   rl.question("$ ", (answer) => {

//     if(answer.trim() === "exit 0") {
//       process.exit(0)
//     }

//     console.log(`${answer}: command not found`);
//     // Recursively call the function to keep prompting for input
//     terminalFunction();
//     // rl.close();
//   });
// }

// terminalFunction();

rl.prompt();

rl.on("line", (line) => {

  line = line.trim();

  if (line === "") {
    rl.prompt();
    return;
  }
  // Handle the "exit 0" command to exit the terminal
  if (line === "exit 0") {
    process.exit(0);
  }

  const command = line.split(" ")[0];

  // Handle echo command

  if(command === "echo") {
    const message = line.slice(5).trim();
    console.log(message);
    rl.prompt();
    return;
  }



  console.log(`${line}: command not found`);

  rl.prompt();
});