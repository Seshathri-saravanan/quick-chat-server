import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/User.js";

export default passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

