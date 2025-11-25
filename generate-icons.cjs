const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'src/assets/icon.png'); // your source icon
const resDir = path.join(__dirname, 'android/app/src/main/res');

const sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
};

// simple background color PNG (solid color)
const bgColor = { r: 255, g: 255, b: 255, alpha: 1 }; // white background

// create folders if they don’t exist
for (const folder of Object.keys(sizes)) {
    const folderPath = path.join(resDir, folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
}

// generate icons
for (const [folder, size] of Object.entries(sizes)) {
    const folderPath = path.join(resDir, folder);

    const outputs = [
        'ic_launcher.png',
        'ic_launcher_round.png',
        'ic_launcher_foreground.png'
    ];

    outputs.forEach(fileName => {
        const outputPath = path.join(folderPath, fileName);

        sharp(source)
            .resize(size, size)
            .toFile(outputPath)
            .then(() => console.log(`Generated ${outputPath}`))
            .catch(err => console.error(err));
    });

    // generate simple background PNG for adaptive icons
    const bgPath = path.join(folderPath, 'ic_launcher_background.png');
    sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: bgColor
        }
    })
        .png()
        .toFile(bgPath)
        .then(() => console.log(`Generated ${bgPath}`))
        .catch(err => console.error(err));
}
