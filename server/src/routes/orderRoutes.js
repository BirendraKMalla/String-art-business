const express = require("express");
const Order = require("../models/Order");
const Design = require("../models/Design");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            designId,
            deliveryAddress,
            isPublic
        } = req.body;

        const design = await Design.findOne({
            _id: designId,
            user: req.userId
        });

        if (!design) {
            return res.status(404).json({
                message: "Design not found"
            });
        }

        const order = await Order.create({
            user: req.userId,

            design: design._id,

            deliveryAddress,

            originalImage: design.originalImage,

            stringArtImage: design.stringArtImage,

            isPublic,

            canvas: design.canvas,

            advanceAmount: 2000,

            orderStatus: "pending"
        });

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Order creation failed",
            error: error.message
        });
    }
});


// =====================================================
// GET MY ORDERS
// GET /api/orders/my-orders
// =====================================================

router.get("/my-orders", authMiddleware, async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.userId
        })
        .populate("design")
        .sort({ createdAt: -1 });

        res.status(200).json({
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });

    }
});


// =====================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// =====================================================

router.get("/:id", authMiddleware, async (req, res) => {
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.userId
        })
        .populate("design");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });

    }
});


// =====================================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:id/status
// =====================================================

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { orderStatus } = req.body;

            const allowedStatuses = [
                "pending",
                "confirmed",
                "in production",
                "completed",
                "delivered"
            ];

            if (!allowedStatuses.includes(orderStatus)) {
                return res.status(400).json({
                    message: "Invalid order status"
                });
            }

            const order = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    orderStatus
                },
                {
                    new: true
                }
            );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.status(200).json({
                message: "Order status updated successfully",
                order
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to update order status",
                error: error.message
            });

        }
    }
);


module.exports = router;