import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Auth } from "../models/auth.schema";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;

  // Check if Access Token Exist
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
      console.log("Access-Token is still valid");
      next();
    } catch (error) {
      // If false, regenerate new access token from refreshToken
      if (!refreshToken) {
        console.log("Refresh-Token is not found");
        return res.status(401).json({ message: "Please re-login..." });
      }

      try {
        // Check if Refresh Token Valid
        console.log("Verify Refresh-Token");
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET as string
        );
        // If valid, verify if it's exist in database
        console.log("Checking Refresh-Token in the database");
        const activeRefreshToken = Auth.findOne({
          refreshToken,
        });

        if (!activeRefreshToken) {
          console.log("Refresh-Token can't be found in the database");
          return res.status(401).json({ message: "Please re-login..." });
        }

        const payload = jwt.decode(refreshToken) as {
          id: string;
          name: string;
          email: string;
        };

        const newAccessToken = jwt.sign(
          {
            id: payload?.id,
            name: payload.name,
            email: payload.email,
          },
          process.env.JWT_ACCESS_TOKEN_SECRET as string,
          { expiresIn: 300 }
        );
        console.log("Regenerated new Access-Token");

        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        next();
      } catch (error) {
        // If invalid, user need to re-login
        return res.status(401).json({ message: "Please re-login..." });
      }
    }
  }
};
