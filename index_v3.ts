import { checkbox, input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import Jimp from "jimp";
import fs from "fs";

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
/*
const ASCII_CHARS = [
  "@",
  "8",
  "0",
  "G",
  "C",
  "L",
  "f",
  "t",
  "1",
  "i",
  ";",
  ":",
  ",",
  ".",
  " ",
];*/
async function askForColor(): Promise<boolean> {
  const color = await confirm({
    message: chalk.green("Print in Color or B/W"),
    default: false,
  });
  return color;
}

async function askForImagePath(): Promise<string> {
  const imagePath = await input({
    message: chalk.green("Enter the image path or URL:"),
  });
  return imagePath;
}

async function askForSize(): Promise<number> {
  const size = await input({
    message: chalk.green("Enter the desired image size (e.g., 50):"),
    default: "50",
    validate: (value) =>
      new Promise((resolve) => {
        resolve(!Number.isNaN(Number(value)) || "You must provide a number");
      }),
  });
  return parseInt(size);
}

//TODO: hacer que el guardar en archivo no sea posible cuando se selecciono color 0 hacer que guarde el B/W
async function askForFile(): Promise<boolean> {
  const saveToFile = confirm({
    message: chalk.green("Save ASCII art to file?"),
    default: false,
  });
  return saveToFile;
}

async function convertToAscii() {
  try {
    const imagePath = await askForImagePath();
    const size = await askForSize();
    const saveToFile = await askForFile();
    const askColor = await askForColor();

    // Load the image
    const image = await Jimp.read(imagePath);

    // Resize the image to the specified size
    image.resize(size, size);

    // Iterate through the pixels and convert them to ASCII characters
    let asciiArt = "";
    let asciiArtForFile = "";
    for (let y = 0; y < image.bitmap.height; y++) {
      for (let x = 0; x < image.bitmap.height; x++) {
        for (let c = 0; c < 2; c++) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
          const greyScale = (pixel.r + pixel.g + pixel.b) / 3;
          const next =
            ASCII_CHARS[
              Math.floor(((ASCII_CHARS.length - 1) * greyScale) / 255)
            ];
          const color = chalk.rgb(pixel.r, pixel.g, pixel.b);
          askColor ? (asciiArt += color(next)) : (asciiArt += next);
          asciiArtForFile += next;
        }
      }
      asciiArt += "\n";
      asciiArtForFile += "\n";
    }

    // Print the ASCII art to the console
    console.log(asciiArt);

    if (saveToFile) {
      fs.writeFile("example.txt", asciiArtForFile, (err) => {
        if (err) {
          console.error(chalk.red("Error writing file:", err));
          return;
        }
        console.log(chalk.green("File written successfully!"));
      });
    }
  } catch (error) {
    console.error(chalk.red("Error converting image to ASCII art:", error));
  }
}

// Start the program
convertToAscii();
