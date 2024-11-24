const admin = require("firebase-admin");
const fs = require("fs");

// ตั้งค่า Firebase Admin SDK
const serviceAccount = require("./fooddeliveryapp-d843e-firebase-adminsdk-ofmfd-7189a35f16.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ฟังก์ชันลบข้อมูลในคอลเล็กชัน
const clearCollection = async (collectionName) => {
  try {
    const querySnapshot = await db.collection(collectionName).get();
    const batch = db.batch();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleared all documents in ${collectionName}`);
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
  }
};

// ฟังก์ชันอัปโหลดข้อมูลจากไฟล์ JSON ไปยัง Firestore
const uploadJSONToFirestore = async (filePath, collectionName, idField) => {
  try {
    // อ่านไฟล์ JSON
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // ใช้ Batch สำหรับอัปโหลดหลายรายการพร้อมกัน
    const batch = db.batch();

    data.forEach((item) => {
      const docRef = db.collection(collectionName).doc(String(item[idField])); // ใช้ฟิลด์ ID ที่กำหนดเป็น Document ID
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

  // ลบข้อมูลเก่า (ลบเฉพาะที่ต้องการ)
  await clearCollection("users");
  await clearCollection("restaurants");
  await clearCollection("menuItems");
  await clearCollection("orders");

  // อัปโหลดข้อมูลใหม่
  await uploadJSONToFirestore("../data/users.json", "users", "UserID");
  await uploadJSONToFirestore("../data/Updated_Restaurants.json", "restaurants", "RestaurantID");
  await uploadJSONToFirestore("../data/MenuItems_Pretty.json", "menuItems", "MenuItemID");
  await uploadJSONToFirestore("../data/orders.json", "orders", "OrderID");

  console.log("All data uploaded successfully!");
};

// รันฟังก์ชันหลัก
main();
