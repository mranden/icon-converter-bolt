const fs = require("fs");
const path = require("path");

// Define the folder path containing the SVG files
const folderPath = path.join(__dirname, "icons"); // Path to the 'icons' folder

// Read all the files in the directory
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading the directory", err);
    return;
  }

  // Filter the SVG files
  const svgFiles = files.filter((file) => path.extname(file) === ".svg");

  // Loop through each SVG file
  svgFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);

    // Read the content of the SVG file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the SVG file", err);
        return;
      }

      // Get the base name (without extension) for the new JS file and convert hyphens to underscores
      let baseName = path.basename(file, ".svg").replace(/-/g, "_");

      // Convert the SVG content into a JS string template
      const jsContent = `export const ${baseName} = \`${data}\`;\n`;

      // Define the new .js file path
      const newFilePath = path.join(folderPath, `${baseName}.js`);

      // Write the content to the new JS file
      fs.writeFile(newFilePath, jsContent, "utf8", (err) => {
        if (err) {
          console.error("Error writing the JS file", err);
        } else {
          console.log(`Converted ${file} to ${baseName}.js`);

          // After the JS file is written, delete the original SVG file
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting the SVG file", err);
            } else {
              console.log(`Deleted ${file}`);
            }
          });
        }
      });
    });
  });
});
