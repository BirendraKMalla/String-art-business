const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        originalImage: {
            type: String,
            required: true
        },

        stringArtImage: {
            type: String,
            required: true
        },

        nailSequence: {
            type: [Number],
            required: true
        },

        canvas: {
            shape: {
                type: String,
                default: "circle"
            },

            diameter: {
                type: Number,
                default: 24
            },

            nails: {
                type: Number,
                default: 300
            },

            lines: {
                type: Number,
                default: 3500
            }
        },

        lineWeight: {
            type: Number,
            default: 35
        },

        size: {
            type: Number,
            default: 700
        }
    },
    {
        timestamps: true
    }
);

const Design = mongoose.model("Design", designSchema);

module.exports = Design;