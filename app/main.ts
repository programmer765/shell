import { createInterface } from "readline";
import { existsSync } from "fs";
import { execFileSync } from "child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});


const builtinCommands = ["echo", "exit", "type"]
const isWindows = process.platform === "win32";
const ENVpath = process.env.PATH?.split(isWindows ? ";" : ":")[0] || "";
const paths = ENVpath.length > 0 ? ENVpath.split(isWindows ? "\\" : "/") : [];
// console.log(paths);

const type = (command: string) => {
  // Check if the command exists in the predefined commands list
  if (builtinCommands.includes(command)) {

    console.log(`${command} is a shell builtin`);

  } else {

    let currPath = ""

    // Check if the command exists in the filesystem
    for (const path of paths) {

      // Construct the file path based on the operating system
      const filePath = currPath.length > 0 ? 
        `${currPath}${isWindows ? `\\${path}\\${command}.exe` : `/${path}/${command}`}` 
        : 
        `${isWindows ? `${path}\\${command}.exe` : `${path}/${command}`}`;

      // console.log(`Checking ${filePath}.....`);
      // Check if the file exists at the specified path
      if (existsSync(filePath)) {
        console.log(`${command}: is ${filePath}`);
        return;
      }

      currPath += currPath.length > 0 ? 
        `${isWindows ? `\\${path}` : `/${path}`}` 
        : 
        `${isWindows ? `${path}` : `${path}`}`;
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

  // execute an exe file
  const exeFilePath = isWindows ? `${command}.exe` : `./${command}`;

  // Check if the file exists in the current directory or as an executable
  if (existsSync(exeFilePath)) {
    console.log(`Executing ${exeFilePath}`);

    try {
      // Execute the file synchronously and inherit stdio
      execFileSync(exeFilePath, { stdio: "inherit" });

    } catch (error) {
      if( error instanceof Error) {
        // Log the error message if execution fails
        console.error(`Error executing ${exeFilePath}: ${error.message}`);
      } else {
        console.error(`Error executing ${exeFilePath}: ${error}`);
      }
    }

    return;
  }



  console.log(`${command}: command not found`);
}


rl.prompt();

rl.on("line", (line) => {
  
  handleCommands(line);

  rl.prompt();
});