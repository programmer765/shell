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

const commands = ["echo", "type"]


const handleCommands = (line: string) => {

  line = line.trim();

  // Handle empty input
  if (line === "") return


  // Handle the "exit 0" command to exit the terminal
  if (line === "exit 0") {
    process.exit(0);
  }

  const command = line.split(" ")[0];

  // Handle "echo" command
  if(command === "echo") {

    // Extract the message after "echo "
    const message = line.slice(5).trim();
    
    console.log(message);
    return;
  }

  // Handle "type" command
  if(command === "type") {

    // Extract the command name after "type "
    const commandName = line.slice(5).trim();

    // Check if the command exists in the predefined commands list
    if (commands.includes(commandName)) {
      console.log(`${commandName} is a shell builtin`);
    } else {
      console.log(`${commandName}: not found`);
    }

    return
  }

  console.log(`${command}: command not found`);
}


rl.prompt();

rl.on("line", (line) => {
  
  handleCommands(line);

  rl.prompt();
});