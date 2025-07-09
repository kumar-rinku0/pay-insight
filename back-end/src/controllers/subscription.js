import { getByPlanId } from "../models/payment.js";
import Subscription from "../models/subscription.js";

export const getCustomerBySubscription = async (id) => {
  const sub = await Subscription.findOne({ createdBy: id }).populate(
    "createdBy",
    "name email phone"
  );
  if (!sub) {
    return null;
  }
  return sub;
};

// middleware for pro users.
export const isProUser = async (req, res, next) => {
  const user = req.user;
  const subscription = await Subscription.findOne({
    createdBy: user._id,
  }).exec();
  if (!subscription) {
    const newSubscription = new Subscription({
      createdBy: user._id,
    });
    await newSubscription.save();
    return res
      .status(401)
      .json({ message: "not a pro user.", code: "ErrorPro" });
  }
  if (
    subscription.pro &&
    subscription.type === "pro" &&
    subscription.proExpire >= Date.now()
  ) {
    req.subscription = subscription;
    return next();
  } else if (
    subscription.pro &&
    subscription.type === "pro" &&
    subscription.proExpire < Date.now()
  ) {
    if (subscription.upcoming && subscription.upcoming.length >= 1) {
      const upcomingPlanId = subscription.upcoming.shift();
      const plan = getByPlanId(upcomingPlanId);
      subscription.proExpire =
        new Date(subscription.proExpire).getTime() +
        plan.durationDays * 24 * 3600 * 1000;
      await subscription.save();
      return next();
    } else {
      subscription.pro = false;
      subscription.type === "free";
      await subscription.save();
      return res
        .status(401)
        .json({ message: "not a pro user, plan expired.", code: "ErrorPro" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "not a pro user.", code: "ErrorPro" });
  }
};
