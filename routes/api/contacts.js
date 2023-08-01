const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const schemas = require("../../schemas/contacts");

const { isValidId, validateBody, authenticate } = require("../../middlewares");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.contactSchemaAdd),
  ctrl.add
);

router.delete("/:contactId", authenticate, isValidId, ctrl.remove);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.contactSchemaUpdate),
  ctrl.update
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
