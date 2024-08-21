import { Command, Option } from "commander";
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

async function convertToAscii(
  imagePath: string,
  size: number,
  saveToFile: boolean
) {
  try {
    // Load the image
    const image = await Jimp.read(imagePath);

    // Resize the image to the specified size
    image.resize(size, size);

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

const program = new Command();

//TODO:ADD COLOR COMAND

program

  .version("0.0.1")
  .description(
    chalk.bold("Program for print it a ASCII image from a given path")
  )
  .addOption(
    new Option(
      "-i, --image <path>",
      "Path or URL to the image"
    ).makeOptionMandatory()
  )
  .option("-s, --size <number>", "Desired image size", "50")
  .option("-f, --file <boolean>", "Save ASCII art to file", false)
  .action((options) => {
    const imagePath = options.image;
    const size = parseInt(options.size, 10);
    const saveToFile: boolean = options.file;
    convertToAscii(imagePath, size || 50, saveToFile || false);
  })
  .parse(process.argv);

//if (!program.args.length) program.help();
