const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Design = require("../models/Design");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/*
 * All routes in this file are protected by:
 *   authMiddleware (verifies JWT)
 *   adminMiddleware (checks user.role === "admin")
 */

// =====================================================
// DASHBOARD STATS
// GET /api/admin/dashboard
// =====================================================

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // --- Aggregate order counts by status ---
      const statusAggregation = await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]);

      const ordersByStatus = statusAggregation.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {});

      // --- Total revenue (advance + remaining across all orders) ---
      const revenueAggregation = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalAdvance: { $sum: "$advanceAmount" },
            totalRemaining: { $sum: { $ifNull: ["$remainingAmount", 0] } },
            orderCount: { $sum: 1 },
          },
        },
      ]);

      const revenueData = revenueAggregation[0] || {
        totalAdvance: 0,
        totalRemaining: 0,
        orderCount: 0,
      };

      // --- New users this month ---
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newThisMonth = await User.countDocuments({
        createdAt: { $gte: startOfMonth },
      });

      // --- Recent activity (last 10 orders) ---
      const recentOrders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({
        ordersByStatus,
        totalOrders: revenueData.orderCount,
        totalRevenue: revenueData.totalAdvance + revenueData.totalRemaining,
        totalAdvance: revenueData.totalAdvance,
        totalRemaining: revenueData.totalRemaining,
        newUsersThisMonth: newThisMonth,
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch dashboard stats",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL ORDERS (admin)
// GET /api/admin/orders
//   ?status=confirmed
//   ?search=customer@email.com
//   ?page=1&limit=20
//   ?isPublic=true
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        status,
        search,
        isPublic,
        page = 1,
        limit = 20,
      } = req.query;

      const filter = {};

      if (status) {
        filter.orderStatus = status;
      }

      if (isPublic === "true") {
        filter.isPublic = true;
      } else if (isPublic === "false") {
        filter.isPublic = false;
      }

      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        filter.$or = [
          { "user.name": searchRegex },
          { "user.email": searchRegex },
          { _id: mongoose.Types.ObjectId.isValid(search) ? search : null },
        ].filter(Boolean);
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find(filter)
          .populate("user", "name email phone")
          .populate("design")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Order.countDocuments(filter),
      ]);

      res.status(200).json({
        orders,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET SINGLE ORDER (admin — no ownership check)
// GET /api/admin/orders/:id
// =====================================================

router.get(
  "/orders/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "name email phone")
        .populate("design");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json({
        order,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch order",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL USERS (admin)
// GET /api/admin/users
//   ?search=name or email
//   ?role=customer|admin
// =====================================================

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { search, role } = req.query;

      const filter = {};

      if (role) {
        filter.role = role;
      }

      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        filter.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ];
      }

      const users = await User.find(filter, "-password").sort({
        createdAt: -1,
      });

      res.status(200).json({
        users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE USER ROLE (admin)
// PATCH /api/admin/users/:id/role
// { role: "admin" | "customer" }
// =====================================================

router.patch(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!role || !["customer", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, select: "-password" }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update user role",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL DESIGNS (admin)
// GET /api/admin/designs
//   ?search=user email
//   ?used=true|false  (whether the design has been turned into an order)
// =====================================================

router.get(
  "/designs",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { search, used } = req.query;

      const filter = {};

      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        filter.$or = [
          { "user.email": searchRegex },
          { "user.name": searchRegex },
        ];
      }

      if (used === "true") {
        // Designs that belong to at least one order
        const orderDesignIds = await Order.distinct("design");
        filter._id = { $in: orderDesignIds };
      } else if (used === "false") {
        // Designs that have NOT been turned into orders
        const orderDesignIds = await Order.distinct("design");
        filter._id = { $nin: orderDesignIds };
      }

      const designs = await Design.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        designs,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch designs",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL DESIGN IDS THAT HAVE ORDERS (helper for used filter)
// GET /api/admin/designs/stats
// =====================================================

router.get(
  "/designs/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalDesigns = await Design.countDocuments();

      const usedDesignIds = await Order.distinct("design");

      const usedCount = usedDesignIds.length;
      const unusedCount = totalDesigns - usedCount;

      res.status(200).json({
        totalDesigns,
        used: usedCount,
        unused: unusedCount,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch design stats",
        error: error.message,
      });
    }
  }
);

module.exports = router;
