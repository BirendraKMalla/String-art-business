const {
    prepareImage,
    makeStringArt,
    drawSequence,
    saveCanvas
} = require("./src/utils/stringArt");


async function run() {

    // ========================================================
    // SETTINGS
    // ========================================================

    const size = 800;

    const nailCount = 300;

    const maxLines = 4000;

    const lineWeight = 30;

    const minDistance = 10;


    // ========================================================
    // LOAD IMAGE
    // ========================================================

    console.log("Loading image...");

    const target =
        await prepareImage(
            "test.jpg",
            size
        );


    // ========================================================
    // GENERATE STRING ART
    // ========================================================

    const result =
        makeStringArt(
            target,
            size,
            nailCount,
            maxLines,
            {
                lineWeight,
                minDistance,

                stopAtBestQuality: true,

                progressInterval: 100
            }
        );


    // ========================================================
    // DRAW FINAL IMAGE
    // ========================================================

    console.log(
        "\nRendering final image..."
    );


    const canvas =
        drawSequence(
            result.sequence,
            result.coords,
            size,
            lineWeight
        );


    // ========================================================
    // ANALYZE OUTPUT
    // ========================================================

    let darkest = 255;
    let brightest = 0;
    let total = 0;
    let affected = 0;


    for (
        const pixel of canvas
    ) {

        if (
            pixel < darkest
        ) {
            darkest = pixel;
        }


        if (
            pixel > brightest
        ) {
            brightest = pixel;
        }


        if (
            pixel < 255
        ) {
            affected++;
        }


        total += pixel;
    }


    const average =
        total /
        canvas.length;


    console.log(
        "\n=== OUTPUT ==="
    );

    console.log(
        "Lines:",
        result.sequence.length - 1
    );

    console.log(
        "Nails:",
        nailCount
    );

    console.log(
        "Resolution:",
        `${size}x${size}`
    );

    console.log(
        "Line weight:",
        lineWeight
    );

    console.log(
        "Minimum distance:",
        minDistance
    );

    console.log(
        "Darkest:",
        darkest
    );

    console.log(
        "Brightest:",
        brightest
    );

    console.log(
        "Average brightness:",
        average.toFixed(2)
    );

    console.log(
        "Affected pixels:",
        affected
    );

    console.log(
        "Coverage:",
        (
            affected /
            canvas.length *
            100
        ).toFixed(2) + "%"
    );


    // ========================================================
    // SAVE
    // ========================================================

    await saveCanvas(
        canvas,
        size,
        "string-art-test.png"
    );


    console.log(
        "\nSaved string-art-test.png"
    );


    // ========================================================
    // PRINT FIRST 20 LINES
    // ========================================================

    console.log(
        "\nFirst 20 lines:"
    );


    for (
        let i = 0;
        i < Math.min(
            20,
            result.sequence.length - 1
        );
        i++
    ) {

        console.log(
            `Line ${i + 1}: ` +
            `${result.sequence[i]} → ` +
            `${result.sequence[i + 1]}`
        );
    }
}


run().catch(
    console.error
);