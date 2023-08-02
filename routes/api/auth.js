const express = require("express");

const router = express.Router();

const { validateBody, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const schemas = require("../../schemas/auth");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.registerSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.subscriptionUpdateSchema),
  ctrl.updateSubscription
);

module.exports = router;
