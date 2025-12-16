import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/auth.controller";
import protect from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, (req: any, res) => {
  res.json({
    message: "Authorized",
    phone: req.user.phone
  });
});



export default router;
