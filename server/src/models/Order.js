const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },

    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },
    },

    originalImage: {
      type: String,
      required: true,
    },

    stringArtImage: {
      type: String,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    canvas: {
      shape: {
        type: String,
        default: "circle",
      },

      diameter: {
        type: Number,
        default: 24,
      },

      nails: {
        type: Number,
        default: 300,
      },

      lines: {
        type: Number,
        default: 3500,
      },
    },

    advanceAmount: {
      type: Number,
      default: 2000,
    },

    remainingAmount: {
      type: Number,
    },

    orderStatus: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
