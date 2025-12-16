import { Router } from "express";
import { registerUser, loginUser,logoutUser } from "../controllers/auth.controller";
import protect from "../middleware/auth.middleware";
import { Request, Response } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, (req: Request, res: Response) => {
  res.json({
    message: "Authorized",
    phone: req.user.phone
  });
});



export default router;
