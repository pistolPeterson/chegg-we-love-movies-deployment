const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");



router
  .route("/:reviewId")
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
