const { isInsideCircle } = require("./src/utils/stringArt");

const center = 150;
const radius = 150;

console.log(
    "Center:",
    isInsideCircle(150, 150, center, radius)
);

console.log(
    "Top:",
    isInsideCircle(150, 0, center, radius)
);

console.log(
    "Corner:",
    isInsideCircle(0, 0, center, radius)
);