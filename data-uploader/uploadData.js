const admin = require("firebase-admin");
const fs = require("fs");

// ตั้งค่า Firebase Admin SDK
const serviceAccount = require("./fooddeliveryapp-d843e-firebase-adminsdk-ofmfd-7189a35f16.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ฟังก์ชันอัปโหลดข้อมูลจากไฟล์ JSON ไปยัง Firestore
const uploadJSONToFirestore = async (filePath, collectionName) => {
  try {
    // อ่านไฟล์ JSON
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // ใช้ Batch สำหรับอัปโหลดหลายรายการพร้อมกัน
    const batch = db.batch();

    data.forEach((item) => {
      const docRef = db.collection(collectionName).doc(); // สร้าง Document ID อัตโนมัติ
      batch.set(docRef, item);
    });

    // Commit ข้อมูล
    await batch.commit();
    console.log(`Uploaded ${filePath} to collection ${collectionName}`);
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
  }
};

// เรียกใช้ฟังก์ชันสำหรับแต่ละไฟล์
const main = async () => {
  console.log("Starting upload...");

  await uploadJSONToFirestore("../data/users.json", "users");
  await uploadJSONToFirestore("../data/restaurants.json", "restaurants");
  await uploadJSONToFirestore("../data/menuitems.json", "menuItems");
  await uploadJSONToFirestore("../data/orders.json", "orders");

  console.log("All data uploaded successfully!");
};

main();
