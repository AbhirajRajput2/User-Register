import { Router, Response } from "express";
import protect, { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", protect, (req: AuthRequest, res: Response) => {
  res.json({
    phone: req.user?.phone
  });
});

export default router;
