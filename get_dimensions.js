const fs = require('fs');
const path = require('path');

const files = [
    'd:\\1. LUCCAS\\aplicativos ai\\catalogo-mont\\public\\hero-cheese\\pao_left.png',
    'd:\\1. LUCCAS\\aplicativos ai\\catalogo-mont\\public\\hero-cheese\\pao_right.png',
    'd:\\1. LUCCAS\\aplicativos ai\\catalogo-mont\\public\\hero-cheese\\cheese.png'
];

async function getImageDimensions(filePath) {
    // Basic PNG header parsing
    // Signature: 8 bytes
    // IHDR chunk: 4 bytes length, 4 bytes type (IHDR), 4 bytes width, 4 bytes height

    try {
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(24);
        fs.readSync(fd, buffer, 0, 24, 0);
        fs.closeSync(fd);

        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);

        console.log(`${path.basename(filePath)}: ${width}x${height}`);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
}

files.forEach(getImageDimensions);
