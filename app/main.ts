import { createInterface } from "readline";
import { existsSync } from "fs";
import { execFileSync } from "child_process";
import { parse } from "shell-quote";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});


const builtinCommands = ["echo", "exit", "type", "pwd"]
const isWindows = process.platform === "win32";
const ENVpath = process.env.PATH?.split(isWindows ? ";" : ":")[0] || "";
const homePath = process.env.HOME || process.env.USERPROFILE || "";
const paths = ENVpath.length > 0 ? ENVpath.split(isWindows ? "\\" : "/") : [];
// console.log(ENVpath);




// Function to check if a file exists in the system paths
// Returns an object with a boolean indicating if the file was found and the file path
const isFilePresent = (fileName: string) : { found: boolean, filePath: string } => {
  let currPath = ""

  // Check if the command exists in the filesystem
  for (const path of paths) {

    // Construct the file path based on the operating system
    const filePath = currPath.length > 0 ? 
      `${currPath}${isWindows ? `\\${path}\\${fileName}.exe` : `/${path}/${fileName}`}` 
      : 
      `${isWindows ? `${path}\\${fileName}.exe` : `${path}/${fileName}`}`;

    // console.log(`Checking ${filePath}.....`);
    // Check if the file exists at the specified path
    if (existsSync(filePath))  return { found: true, filePath: filePath };

    currPath += currPath.length > 0 ? 
      `${isWindows ? `\\${path}` : `/${path}`}` 
      : 
      `${isWindows ? `${path}` : `${path}`}`;
  }
  return { found: false, filePath: "" };
}




// Function to handle the "type" command
// It checks if the command is a shell builtin or if it exists in the filesystem
// If it exists, it prints the file path; otherwise, it indicates that the command was not found
const type = (command: string) => {
  // Check if the command exists in the predefined commands list
  if (builtinCommands.includes(command)) {

    console.log(`${command} is a shell builtin`);

  } else {

    const result = isFilePresent(command);

    if(result.found === true) {
      console.log(`${command}: is ${result.filePath}`);
    } else {
      console.error(`${command}: not found`);
    }
  }
};




// Function to handle commands entered in the terminal
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

    const args = line.slice(5).trim();
    const parsed = parse(args);
    const message = parsed.length > 0 ? parsed.join(" ") : "";

    console.log(message);
    return;
  }




  // Handle "type" command
  if(command === "type") {

    // Extract the command name after "type "
    const commandMsg = line.slice(5).trim();

    type(commandMsg);
    return
  }




  // Handle "pwd" command
  if(command === "pwd") {
    console.log(process.cwd());
    return;
  }




  // Handle "cd" command
  if(command === "cd") {

    // get the directory name
    const dir = line.slice(3).trim();

    // change to home directory
    if(dir === "~") {
      process.chdir(homePath);
    } else if (dir) {       // change to specified directory
      try {
        process.chdir(dir);
      } catch (error) {
        console.error(`cd: ${dir}: No such file or directory`);
      }
    }

    return;
  }




  if (builtinCommands.includes(command) === false) {
  // execute an exe file
    // const exeFileName = isWindows ? `${command}.exe` : `./${command}`;
    const isexeFilePresent = isFilePresent(command);

    // Check if the file exists in the current directory or as an executable
    if (isexeFilePresent.found === true) {
      const exeFilePath = isexeFilePresent.filePath;

      // Log the file path being executed
      // console.log(`Executing ${exeFilePath}`);

      try {

        const args = line.split(" ").slice(1);

        // Execute the file synchronously and inherit stdio`
        execFileSync(exeFilePath, args, { stdio: "inherit" });

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
    else {
      console.error(`${command}: command not found`);
      return;
    }
  }


  // If the command is not recognized, print a "not found" message
  console.error(`${command}: command not found`);
}







// Start the readline interface and prompt for input
rl.prompt();

rl.on("line", (line) => {
  
  handleCommands(line);

  rl.prompt();
});