import { getByPlanId } from "../models/payment.js";
import Subscription from "../models/subscription.js";

export const getSubscriptionByUser = async (req, res) => {
  const user = req.user;
  const sub = await Subscription.findOne({
    company: user.role.company,
  }).populate("company", "name");
  if (!sub) {
    return res.status(400).json({
      message: "user don't have any subscritpion.",
      subscription: sub,
    });
  }
  return res.status(200).json({
    message: `user have ${sub.type} subscritpion.`,
    subscription: sub,
  });
};

// middleware for pro users.
export const isProUser = async (req, res, next) => {
  const user = req.user;
  const subscription = await Subscription.findOne({
    company: user.role.company,
  }).exec();
  if (!subscription) {
    const newSubscription = new Subscription({
      company: user.role.company,
    });
    await newSubscription.save();
    req.subscription = newSubscription;
    return next();
  }
  req.subscription = subscription;
  if (
    subscription.pro &&
    subscription.type === "pro" &&
    subscription.proExpire >= Date.now()
  ) {
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
      req.subscription = subscription;
      return next();
    } else {
      subscription.pro = false;
      subscription.type === "free";
      await subscription.save();
      req.subscription = subscription;
      return next();
    }
  } else {
    return next();
  }
};

// middleware for pro users.
export const onlyProUser = async (req, res, next) => {
  const subscription = req.subscription;
  if (subscription.pro) {
    return next();
  }
  return res.status(403).json({ message: "not a pro user.", code: "ErrorPro" });
};
