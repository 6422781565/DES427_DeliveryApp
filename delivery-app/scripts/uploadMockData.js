const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');

// สร้างโฟลเดอร์ถ้ายังไม่มี
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

const convertCsvToJson = async (inputFile, outputFile) => {
  try {
    // ตรวจสอบและสร้างโฟลเดอร์
    ensureDirectoryExistence(outputFile);

    const jsonArray = await csv().fromFile(inputFile);
    fs.writeFileSync(outputFile, JSON.stringify(jsonArray, null, 2));
    console.log(`${inputFile} has been converted to ${outputFile}`);
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
  }
};

convertCsvToJson('./delivery-app/data/Restaurants1.csv', './data/restaurants.json');
convertCsvToJson('./delivery-app/data/MenuItems1.csv', './data/menuItems.json');
convertCsvToJson('./delivery-app/data/Users1.csv', './data/users.json');
convertCsvToJson('./delivery-app/data/Orders1.csv', './data/orders.json');
