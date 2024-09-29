const fs = require("fs");
const path = require("path");

// Define the folder path containing the SVG files
const folderPath = path.join(__dirname, "icons"); // Path to the 'icons' folder
const outputFilePath = path.join(__dirname, "heroicons.js"); // Output heroicons.js file
const categoriesFilePath = path.join(__dirname, "categories.txt"); // File to write categories

// Category mapping based on file names (example)
const categoryMapping = {
  arrows: ["arrow", "chevron", "caret"],
  logos: ["wordpress", "logo"],
  devices: ["phone", "tablet", "monitor"],
  editor: ["pencil", "edit", "eraser"],
  media: ["video", "audio", "music"],
};

// Function to guess category based on file name
const guessCategory = (fileName) => {
  const lowerName = fileName.toLowerCase();
  for (const category in categoryMapping) {
    if (categoryMapping[category].some((keyword) => lowerName.includes(keyword))) {
      return category;
    }
  }
  return "general"; // Default category if no match
};

// Initialize the import statements and heroicons array
let imports = "";
let heroiconsArray = "const heroicons = [\n";
let categoriesFound = new Set(); // To track unique categories

// Read all the files in the directory
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading the directory", err);
    return;
  }

  // Filter the SVG files
  const svgFiles = files.filter((file) => path.extname(file) === ".js");

  // Loop through each SVG file to build import statements and heroicons array
  svgFiles.forEach((file) => {
    const baseName = path.basename(file, ".js");
    const varName = baseName.replace(/-/g, "_"); // Convert hyphens to underscores for valid JS variable names

    // Add import statement
    imports += `import { ${varName} } from './heroicons/${baseName}';\n`;

    // Guess category
    const category = guessCategory(baseName);

    // Add the found category to the set
    categoriesFound.add(category);

    // Add to heroicons array
    heroiconsArray += `  {
    name: "${varName}",
    title: "${varName.replace(/_/g, " ")}",
    icon: ${varName},
    categories: ["${category}"],
  },\n`;
  });

  // Close the heroicons array
  heroiconsArray += "];\n\n";

  // Write to the output file (heroicons.js)
  const outputContent = `/**
 * Auto-generated heroicons import and data file
 */
${imports}
${heroiconsArray}

export default heroicons;
`;

  fs.writeFile(outputFilePath, outputContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing the heroicons.js file", err);
    } else {
      console.log("heroicons.js file has been created successfully.");
    }
  });

  // Write the unique categories to a file or console
  const categoriesList = Array.from(categoriesFound).join("\n");

  // Option 1: Write to categories.txt
  fs.writeFile(categoriesFilePath, categoriesList, "utf8", (err) => {
    if (err) {
      console.error("Error writing the categories.txt file", err);
    } else {
      console.log("Categories have been written to categories.txt");
    }
  });

  // Option 2: Print categories to the console
  console.log("Categories found:");
  console.log(categoriesList);
});
