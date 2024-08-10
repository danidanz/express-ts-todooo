import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.schema";
import { Auth } from "../models/auth.schema";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Check if the user exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exist" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // payload
      const newUser = {
        name,
        email,
        password: hashedPassword,
      };

      // insert to db
      const createUser = new User(newUser);
      await createUser.save();

      res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found, return an error response
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password as string);

      // If passwords do not match, return an error response
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // authorization
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      console.log(payload);

      const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      console.log(accessToken);

      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        // TODO
        // { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        {
          expiresIn: "30d",
        }
      );

      console.log(refreshToken);

      const newRefreshToken = new Auth({
        userId: user.id,
        refreshToken,
      });
      await newRefreshToken.save();
      return res
        .cookie("accessToken", accessToken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .status(200)
        .json({ message: "Login success!" });
    } catch (error) {
      // Handle any server errors
      return res.status(500).json({ msg: "Server error login" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      // If no refresh token is provided, return an error response
      if (!refreshToken) {
        return res.status(400).json({ msg: "No refresh token provided" });
      }

      // Find the refresh token in the database
      const storedToken = await Auth.findOne({ token: refreshToken });

      // If no token is found, or the token doesn't match, return an error response
      if (!storedToken) {
        return res.status(403).json({ msg: "Invalid refresh token" });
      }

      // Verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        (err: any, decoded: any) => {
          if (err) {
            return res.status(403).json({ msg: "Invalid refresh token" });
          }

          // Generate a new access token
          const accessToken = jwt.sign(
            { userId: (decoded as any).userId },
            process.env.JWT_ACCESS_TOKEN_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
          );

          // Store the new access token in cookies
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            //   secure: process.env.NODE_ENV === "production", // Only use https in production
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          // Respond with the new access token
          res.json({ accessToken });
        }
      );
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ msg: "Server error" });
    }
  }
}

export default new AuthController();
