import express from "express";
import photoRoute from "./photo.route";

const router = express.Router();
router.use("/photos", photoRoute);

router.get("/health", (req, res) => res.send({ message: "OK" }));

export default router;
