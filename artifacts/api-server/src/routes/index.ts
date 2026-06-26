import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import adminRouter from "./admin";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/registrations", registrationsRouter);
router.use("/admin", adminRouter);
router.use("/contact", contactRouter);

export default router;
