const { Router } = require("express");
const router = Router();
const controller = require("../controller/books");

router.get("/", controller.getAll);
router.get("/pagination", controller.getAllPage);
router.get("/search", controller.searchBook);
router.get("/sorted", controller.sortBook);
router.post("/random", controller.getRandomBook);
router.get("/:id", controller.getById);
router.get("/best/list", controller.getBestBook);
module.exports = router;
