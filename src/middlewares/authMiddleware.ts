import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Auth } from "../models/auth.schema";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;

  // Check if Access Token Exist
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
      console.log("Access token masih valid");
      next();
    } catch (error) {
      // If false, regenerate new access token from refreshToken
      if (!refreshToken) {
        console.log("Refresh Token tidak ada");
        return res.status(401).json({ message: "Please re-login..." });
      }

      try {
        // Check if Refresh Token Valid
        console.log("Verifikasi Refresh Token");
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET as string
        );
        // If valid, verify if it's exist in database
        console.log("Cek refresh token ke database");
        const activeRefreshToken = Auth.findOne({
          refreshToken,
        });

        if (!activeRefreshToken) {
          console.log("Refresh token tidak ada di database");
          return res.status(401).json({ message: "Please re-login..." });
        }

        const payload = jwt.decode(refreshToken) as {
          id: string;
          name: string;
          email: string;
        };

        console.log("Bikin accessToken baru");
        const newAccessToken = jwt.sign(
          {
            id: payload?.id,
            name: payload.name,
            email: payload.email,
          },
          process.env.JWT_ACCESS_TOKEN_SECRET as string,
          { expiresIn: 300 }
        );

        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        next();
        // regenerate new access token
      } catch (error) {
        // If invalid, user need to re-login
        return res.status(401).json({ message: "Please re-login..." });
      }
    }
  }
};