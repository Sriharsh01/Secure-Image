const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');
const { createCanvas, loadImage } = require('canvas');

// Promisify readFile and writeFile functions
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Function to generate encryption key
function generateKey() {
    return crypto.randomBytes(32); // 256 bits key
}

// Function to encrypt image
async function encryptImage(inputImagePath, key) {
    // Read input image
    const imgData = await readFileAsync(inputImagePath);
    // Create cipher using AES algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
    // Encrypt image data
    let encryptedData = cipher.update(imgData);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return encryptedData;
}

// Function to decrypt image
async function decryptImage(encryptedData, key) {
    // Create decipher using AES algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
    // Decrypt encrypted data
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    return decryptedData;
}

// Example usage
(async () => {
    try {
        // Generate encryption key
        const key = generateKey();

        // Path to input image file
        const inputImagePath = 'C:\Users\ZOOM\Desktop\wallie\mobile-freeze.jpg';

        // Encrypt image
        const encryptedData = await encryptImage(inputImagePath, key);

        // Save encrypted image
        await writeFileAsync('encrypted_image.enc', encryptedData);

        // Decrypt image
        const decryptedData = await decryptImage(encryptedData, key);

        // Save decrypted image
        await writeFileAsync('decrypted_image.jpg', decryptedData);

        console.log('Encryption and decryption completed successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
})();
