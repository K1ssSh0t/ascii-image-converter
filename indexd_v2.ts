import Jimp from "jimp";
import fs from "fs";
import readline from "readline";
import chalk from "chalk";

const ASCII_CHARS = [
  " ",
  ".",
  ",",
  ":",
  ";",
  "i",
  "1",
  "t",
  "f",
  "L",
  "C",
  "G",
  "0",
  "8",
  "@",
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askForImagePath() {
  return new Promise((resolve) => {
    rl.question(
      chalk.blueBright("Enter the image path or URL: "),
      (imagePath) => {
        resolve(imagePath);
      }
    );
  });
}

async function askForSize() {
  return new Promise((resolve) => {
    rl.question(
      chalk.blueBright("Enter the desired image size (e.g., 50): "),
      (size) => {
        resolve(parseInt(size, 10));
      }
    );
  });
}

async function askForFile() {
  return new Promise((resolve) => {
    rl.question(
      chalk.blueBright("Save ASCII art to file? (y/n): "),
      (answer) => {
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
}

async function convertToAscii() {
  try {
    const imagePath: string | unknown = await askForImagePath();
    const size: number | unknown = await askForSize();
    const saveToFile: boolean | unknown = await askForFile();

    // Load the image
    const image = await Jimp.read(imagePath as string);

    // Resize the image to the specified size
    image.resize(size as number, size as number);

    image.greyscale();

    // Iterate through the pixels and convert them to ASCII characters
    let asciiArt = "";
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.height; x++) {
        for (let c = 0; c < 2; c++) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
          const greyScale = (pixel.r + pixel.g + pixel.b) / 3;
          asciiArt +=
            ASCII_CHARS[
              Math.floor(((ASCII_CHARS.length - 1) * greyScale) / 255)
            ];
        }
      }
      asciiArt += "\n";
    }

    // Print the ASCII art to the console
    console.log(asciiArt);

    if (saveToFile) {
      fs.writeFile("example.txt", asciiArt, (err) => {
        if (err) {
          console.error(chalk.red("Error writing file:"), err);
          return;
        }
        console.log(chalk.greenBright("File written successfully!"));
      });
    }
  } catch (error) {
    console.error(chalk.red("Error converting image to ASCII art:"), error);
  } finally {
    rl.close();
  }
}

// Start the program
convertToAscii();
