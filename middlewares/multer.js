import multer from "multer";
// image file to upload krne ke li emulter use hota hai
const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");