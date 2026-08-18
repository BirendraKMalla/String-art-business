const {
    createCanvas,
    generateNails,
    getLinePixels,
    drawLine
} = require("./src/utils/stringArt");

const size = 300;

const current = createCanvas(size);

const nails = generateNails(300, 149);

const nailA = nails[0];
const nailB = nails[150];

const linePixels = getLinePixels(nailA, nailB, size);

console.log("Before drawing:");
console.log("First pixel:", current[linePixels[0].y * size + linePixels[0].x]);

drawLine(linePixels, current, size);

console.log("After drawing:");
console.log("First pixel:", current[linePixels[0].y * size + linePixels[0].x]);