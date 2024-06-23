import { Router } from "express";
import { check, validationResult } from "express-validator";
import { getBarChartData } from "../controllers/barChartController";

const router = Router();

router.get(
  "/",
  [check("month").isString().notEmpty().withMessage("Month is required")],
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getBarChartData
);

export default router;
