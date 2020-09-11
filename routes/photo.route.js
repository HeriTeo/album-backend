import express from "express";

import multipart from "connect-multiparty";
import controller from "../controllers/photo.controller";

const multipartMiddleware = multipart();

const router = express.Router();

router.get("/*", controller.getData);
router.post("/list", controller.list);
router.put("/", multipartMiddleware, controller.update);
router.delete("/*", controller.remove);

export default router;
