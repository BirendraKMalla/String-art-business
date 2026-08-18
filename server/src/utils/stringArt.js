const sharp = require("sharp");

/*
 * String-art generator based on the algorithm used by StringAr.
 *
 * Important:
 * lineWeight is NOT physical line thickness.
 * It represents how much darkness one string contributes
 * to every pixel it crosses.
 */

// ============================================================
// 1. GENERATE NAIL COORDINATES
// ============================================================

function generateNails(count, size) {
    const coords = new Int16Array(count * 2);

    const center = size / 2;
    const radius = size / 2 - 0.5;

    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;

        coords[i * 2] =
            Math.floor(
                center + radius * Math.cos(angle)
            );

        coords[i * 2 + 1] =
            Math.floor(
                center + radius * Math.sin(angle)
            );
    }

    return coords;
}


// ============================================================
// 2. CIRCULAR DISTANCE BETWEEN NAILS
// ============================================================

function circularDistance(fromPin, toPin, nPins) {
    const diff =
        (toPin - fromPin + nPins) % nPins;

    return Math.min(
        diff,
        nPins - diff
    );
}


// ============================================================
// 3. NUMBER OF PIXELS IN A LINE
// ============================================================

function getLinePointCount(
    x0,
    y0,
    x1,
    y1
) {
    return (
        Math.max(
            Math.abs(x1 - x0),
            Math.abs(y1 - y0)
        ) + 1
    );
}


// ============================================================
// 4. WRITE BRESENHAM LINE PIXELS
// ============================================================

function writeLineIndices({
    x0,
    y0,
    x1,
    y1,
    size,
    output,
    offset
}) {
    const stepX =
        x0 < x1 ? 1 : -1;

    const stepY =
        y0 < y1 ? 1 : -1;

    const deltaX =
        Math.abs(x1 - x0);

    const deltaY =
        -Math.abs(y1 - y0);

    let lineError =
        deltaX + deltaY;

    let cursor = offset;

    while (true) {

        output[cursor++] =
            y0 * size + x0;

        if (
            x0 === x1 &&
            y0 === y1
        ) {
            break;
        }

        const doubledError =
            2 * lineError;

        if (
            doubledError >= deltaY
        ) {
            lineError += deltaY;
            x0 += stepX;
        }

        if (
            doubledError <= deltaX
        ) {
            lineError += deltaX;
            y0 += stepY;
        }
    }
}


// ============================================================
// 5. PRECALCULATE ALL POSSIBLE LINES
// ============================================================

function buildLineCache({
    size,
    coords,
    nailCount,
    minDistance
}) {

    /*
     * We use a flattened 2D array:
     *
     * pairIndex = fromPin * nailCount + toPin
     */

    const pairCount =
        nailCount * nailCount;

    const lengths =
        new Uint16Array(pairCount);

    const offsets =
        new Uint32Array(pairCount);

    let totalPoints = 0;


    // --------------------------------------------------------
    // FIRST PASS
    // Find how many pixels every line needs.
    // --------------------------------------------------------

    for (
        let fromPin = 0;
        fromPin < nailCount;
        fromPin++
    ) {

        const x0 =
            coords[fromPin * 2];

        const y0 =
            coords[fromPin * 2 + 1];


        for (
            let toPin = fromPin + 1;
            toPin < nailCount;
            toPin++
        ) {

            if (
                circularDistance(
                    fromPin,
                    toPin,
                    nailCount
                ) < minDistance
            ) {
                continue;
            }


            const x1 =
                coords[toPin * 2];

            const y1 =
                coords[toPin * 2 + 1];


            const points =
                getLinePointCount(
                    x0,
                    y0,
                    x1,
                    y1
                );


            const forwardIndex =
                fromPin * nailCount +
                toPin;

            const reverseIndex =
                toPin * nailCount +
                fromPin;


            lengths[forwardIndex] =
                points;

            lengths[reverseIndex] =
                points;


            offsets[forwardIndex] =
                totalPoints;

            offsets[reverseIndex] =
                totalPoints;


            totalPoints += points;
        }
    }


    console.log(
        `Precomputed line pixels: ${totalPoints.toLocaleString()}`
    );


    // --------------------------------------------------------
    // Allocate one large array.
    // --------------------------------------------------------

    const indices =
        new Uint32Array(totalPoints);


    // --------------------------------------------------------
    // SECOND PASS
    // Actually write every line's pixels.
    // --------------------------------------------------------

    for (
        let fromPin = 0;
        fromPin < nailCount;
        fromPin++
    ) {

        const x0 =
            coords[fromPin * 2];

        const y0 =
            coords[fromPin * 2 + 1];


        for (
            let toPin = fromPin + 1;
            toPin < nailCount;
            toPin++
        ) {

            const pairIndex =
                fromPin * nailCount +
                toPin;

            const points =
                lengths[pairIndex];

            if (!points) {
                continue;
            }


            const x1 =
                coords[toPin * 2];

            const y1 =
                coords[toPin * 2 + 1];


            writeLineIndices({
                x0,
                y0,
                x1,
                y1,
                size,
                output: indices,
                offset: offsets[pairIndex]
            });
        }
    }


    return {
        lengths,
        offsets,
        indices
    };
}


// ============================================================
// 6. RECENT NAIL HISTORY
// ============================================================

function lastPinsHas(
    lastPins,
    start,
    count,
    value
) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        if (
            lastPins[
                (start + i) %
                lastPins.length
            ] === value
        ) {
            return true;
        }
    }

    return false;
}


function lastPinsPush(
    lastPins,
    state,
    value
) {

    if (
        state.count <
        lastPins.length
    ) {

        lastPins[
            (state.start + state.count) %
            lastPins.length
        ] = value;

        state.count++;

        return;
    }


    lastPins[state.start] =
        value;

    state.start =
        (state.start + 1) %
        lastPins.length;
}


// ============================================================
// 7. PREPARE IMAGE
// ============================================================

async function prepareImage(
    imagePath,
    size
) {

    const {
        data
    } = await sharp(imagePath)
        .resize(size, size, {
            fit: "cover"
        })
        .grayscale()
        .raw()
        .toBuffer({
            resolveWithObject: true
        });


    return new Uint8Array(data);
}


// ============================================================
// 8. STRING ART ALGORITHM
// ============================================================

function makeStringArt(
    target,
    size,
    nailCount = 288,
    maxLines = 4000,
    options = {}
) {

    const {
        minDistance = 10,

        /*
         * This matches the meaning used by StringAr.
         */
        lineWeight = 40,

        /*
         * StringAr starts at pin 0.
         */
        startPin = 0,

        /*
         * Stop when no candidate improves
         * the image anymore.
         */
        stopAtBestQuality = false,

        /*
         * Print progress every N lines.
         */
        progressInterval = 100
    } = options;


    console.log(
        "\n=== String Art Generation ==="
    );

    console.log(
        "Resolution:",
        `${size}x${size}`
    );

    console.log(
        "Nails:",
        nailCount
    );

    console.log(
        "Maximum lines:",
        maxLines
    );

    console.log(
        "Minimum distance:",
        minDistance
    );

    console.log(
        "Line weight:",
        lineWeight
    );


    // --------------------------------------------------------
    // Generate nails
    // --------------------------------------------------------

    const coords =
        generateNails(
            nailCount,
            size
        );


    // --------------------------------------------------------
    // Precalculate every usable line.
    // --------------------------------------------------------

    console.log(
        "\nPrecalculating lines..."
    );

    const cache =
        buildLineCache({
            size,
            coords,
            nailCount,
            minDistance
        });


    console.log(
        "Line cache ready."
    );


    // --------------------------------------------------------
    // Convert target image into desired darkness.
    //
    // white  = 0 darkness
    // black  = 255 darkness
    // --------------------------------------------------------

    const residualDarkness =
        new Int32Array(
            target.length
        );


    for (
        let i = 0;
        i < target.length;
        i++
    ) {

        residualDarkness[i] =
            255 - target[i];
    }


    // --------------------------------------------------------
    // StringAr scoring constants.
    //
    // reduction =
    //
    //     2 * weight * residual
    //     - weight²
    //
    // This is derived from:
    //
    //     R² - (R - W)²
    // --------------------------------------------------------

    const doubleLineWeight =
        2 * lineWeight;

    const lineWeightSquared =
        lineWeight * lineWeight;


    // --------------------------------------------------------
    // Nail sequence
    // --------------------------------------------------------

    const sequence = [];

    let currentPin =
        startPin;

    sequence.push(
        currentPin
    );


    // --------------------------------------------------------
    // Recent nail history.
    //
    // Same 20-pin history as StringAr.
    // --------------------------------------------------------

    const lastPins =
        new Uint16Array(20);

    const lastPinsState = {
        start: 0,
        count: 0
    };


    // --------------------------------------------------------
    // Generate lines.
    // --------------------------------------------------------

    const startTime =
        Date.now();


    for (
        let lineIndex = 0;
        lineIndex < maxLines;
        lineIndex++
    ) {

        let bestPin = -1;

        let bestErrorReduction =
            stopAtBestQuality
                ? 0
                : -Infinity;


        // ====================================================
        // TEST EVERY POSSIBLE NEXT NAIL
        // ====================================================

        for (
            let offset = minDistance;
            offset <
                nailCount - minDistance;
            offset++
        ) {

            const testPin =
                (
                    currentPin +
                    offset
                ) % nailCount;


            // Don't immediately reuse
            // recent nails.

            if (
                lastPinsHas(
                    lastPins,
                    lastPinsState.start,
                    lastPinsState.count,
                    testPin
                )
            ) {
                continue;
            }


            const pairIndex =
                currentPin *
                    nailCount +
                testPin;


            const points =
                cache.lengths[
                    pairIndex
                ];


            if (!points) {
                continue;
            }


            const start =
                cache.offsets[
                    pairIndex
                ];


            let errorReduction = 0;


            // =================================================
            // SCORE THIS LINE
            // =================================================

            for (
                let i = 0;
                i < points;
                i++
            ) {

                const pixelIndex =
                    cache.indices[
                        start + i
                    ];


                const residual =
                    residualDarkness[
                        pixelIndex
                    ];


                errorReduction +=
                    doubleLineWeight *
                        residual -
                    lineWeightSquared;
            }


            // =================================================
            // BEST LINE?
            // =================================================

            if (
                errorReduction >
                bestErrorReduction
            ) {

                bestErrorReduction =
                    errorReduction;

                bestPin =
                    testPin;
            }
        }


        // ====================================================
        // NO IMPROVEMENT
        // ====================================================

        if (
            bestPin < 0
        ) {

            console.log(
                "No useful line found."
            );

            break;
        }


        // ====================================================
        // SAVE SELECTED LINE
        // ====================================================

        sequence.push(
            bestPin
        );


        // ====================================================
        // APPLY LINE DARKNESS
        // ====================================================

        const pairIndex =
            currentPin *
                nailCount +
            bestPin;


        const points =
            cache.lengths[
                pairIndex
            ];


        const start =
            cache.offsets[
                pairIndex
            ];


        for (
            let i = 0;
            i < points;
            i++
        ) {

            const pixelIndex =
                cache.indices[
                    start + i
                ];


            residualDarkness[
                pixelIndex
            ] -= lineWeight;
        }


        // ====================================================
        // UPDATE RECENT HISTORY
        // ====================================================

        lastPinsPush(
            lastPins,
            lastPinsState,
            bestPin
        );


        // ====================================================
        // MOVE TO NEXT NAIL
        // ====================================================

        currentPin =
            bestPin;


        // ====================================================
        // PROGRESS
        // ====================================================

        const linesDone =
            lineIndex + 1;


        if (
            linesDone %
                progressInterval ===
            0
        ) {

            const elapsed =
                (
                    Date.now() -
                    startTime
                ) / 1000;


            console.log(
                `Lines: ${linesDone}/${maxLines}` +
                ` | Current nail: ${currentPin}` +
                ` | Score: ${bestErrorReduction.toFixed(0)}` +
                ` | Time: ${elapsed.toFixed(1)}s`
            );
        }
    }


    const elapsed =
        (
            Date.now() -
            startTime
        ) / 1000;


    console.log(
        "\nGeneration finished."
    );

    console.log(
        "Lines generated:",
        sequence.length - 1
    );

    console.log(
        "Time:",
        `${elapsed.toFixed(2)} seconds`
    );


    return {
        sequence,
        coords,
        residualDarkness,

        /*
         * Useful for drawing the final result.
         */
        nailCount,
        size,

        /*
         * Keep the settings in the result.
         */
        lineWeight,
        minDistance
    };
}


// ============================================================
// 9. DRAW FINAL STRING ART
// ============================================================

function drawSequence(
    sequence,
    coords,
    size,
    lineWeight = 20
) {

    /*
     * Start with white.
     */
    const canvas =
        new Uint8Array(
            size * size
        );

    canvas.fill(255);


    /*
     * Convert StringAr's darkness
     * representation into actual image pixels.
     *
     * Each string subtracts lineWeight.
     */
    for (
        let i = 0;
        i < sequence.length - 1;
        i++
    ) {

        const from =
            sequence[i];

        const to =
            sequence[i + 1];


        const x0 =
            coords[from * 2];

        const y0 =
            coords[from * 2 + 1];

        const x1 =
            coords[to * 2];

        const y1 =
            coords[to * 2 + 1];


        drawBresenhamLine(
            canvas,
            size,
            x0,
            y0,
            x1,
            y1,
            lineWeight
        );
    }


    return canvas;
}


// ============================================================
// 10. DRAW ONE BRESENHAM LINE
// ============================================================

function drawBresenhamLine(
    canvas,
    size,
    x0,
    y0,
    x1,
    y1,
    darkness
) {

    const stepX =
        x0 < x1 ? 1 : -1;

    const stepY =
        y0 < y1 ? 1 : -1;

    const deltaX =
        Math.abs(x1 - x0);

    const deltaY =
        -Math.abs(y1 - y0);

    let error =
        deltaX + deltaY;


    while (true) {

        if (
            x0 >= 0 &&
            x0 < size &&
            y0 >= 0 &&
            y0 < size
        ) {

            const index =
                y0 * size + x0;


            canvas[index] =
                Math.max(
                    0,
                    canvas[index] -
                        darkness
                );
        }


        if (
            x0 === x1 &&
            y0 === y1
        ) {
            break;
        }


        const doubledError =
            2 * error;


        if (
            doubledError >= deltaY
        ) {

            error += deltaY;
            x0 += stepX;
        }


        if (
            doubledError <= deltaX
        ) {

            error += deltaX;
            y0 += stepY;
        }
    }
}


// ============================================================
// 11. SAVE PNG
// ============================================================

async function saveCanvas(
    canvas,
    size,
    outputPath
) {

    await sharp(
        Buffer.from(canvas),
        {
            raw: {
                width: size,
                height: size,
                channels: 1
            }
        }
    )
        .png()
        .toFile(outputPath);
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    generateNails,
    prepareImage,

    circularDistance,
    getLinePointCount,
    writeLineIndices,
    buildLineCache,

    makeStringArt,

    drawSequence,
    drawBresenhamLine,

    saveCanvas
};