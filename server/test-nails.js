const {
    generateNails,
    getLinePixels
} = require("./src/utils/stringArt");

const nails = generateNails(300, 149);

const nailA = nails[0];
const nailB = nails[150];

const linePixels = getLinePixels(nailA, nailB, 300);

console.log("Nail A:", nailA);
console.log("Nail B:", nailB);
console.log("Number of pixels:", linePixels.length);
console.log("First 5 pixels:", linePixels.slice(0, 5));
console.log("Last 5 pixels:", linePixels.slice(-5));