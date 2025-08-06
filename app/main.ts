import { createInterface } from "readline";
import { existsSync } from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});


const builtinCommands = ["echo", "exit", "type"]
const isWindows = process.platform === "win32";
const paths = process.env.PATH?.split(isWindows ? ";" : ":") || [];

const type = (command: string) => {
  // Check if the command exists in the predefined commands list
  if (builtinCommands.includes(command)) {

    console.log(`${command} is a shell builtin`);

  } else {

    // Check if the command exists in the filesystem
    for (const path of paths) {

      // Construct the file path based on the operating system
      const filePath = 
        isWindows ? 
        `${path}\\${command}` // Use backslash for Windows paths
        :
        `${path}/${command}`; // Use forward slash for Unix-like paths

      // Check if the file exists at the specified path
      if (existsSync(filePath)) {
        console.log(`${command}: is ${filePath}`);
        return;
      }
    }
    console.log(`${command}: not found`);
  }
};

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

    type(commandName);
    return
  }

  console.log(`${command}: command not found`);
}


rl.prompt();

rl.on("line", (line) => {
  
  handleCommands(line);

  rl.prompt();
});