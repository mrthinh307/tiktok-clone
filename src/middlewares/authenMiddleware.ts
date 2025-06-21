import { Request, Response, NextFunction } from "express";
import supabase from "~/config/supabase";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const getUserInfomation = async (user: any) => {
  const { data: userProfile, error: profileError } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.warn("Could not fetch user profile:", profileError.message);
  }

  return {
    id: user.id,
    email: user.email,
    ...userProfile, // Merge với profile nếu có
  };
};

// authenticate - bắt buộc phải có token
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Access denied. No token provided.",
        message: "Authorization header with Bearer token is required",
      });
      return;
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // 2. Verify token với Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
      return;
    }

    // 3. Lấy thông tin chi tiết user từ database (nếu cần)
    req.user = await getUserInfomation(user);

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      error: "Authentication failed",
      message: "Invalid or expired token",
    });
    return;
  }
};

// Optional authentication - không bắt buộc phải có token
export const authenticateOptional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Không có token thì vẫn cho phép tiếp tục, req.user = undefined
      req.user = undefined;
      next();
      return;
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // 2. Verify token với Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Token không hợp lệ thì vẫn cho phép tiếp tục, req.user = undefined
      // req.user = undefined;
      // next();
      res.status(401).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
      return;
    }

    // 3. Lấy thông tin chi tiết user từ database (nếu cần)
    req.user = await getUserInfomation(user);

    next(); 
  } catch (error) {
    console.error("Optional authentication error:", error);
    // Với optional auth, lỗi cũng không block request
    req.user = undefined;
    next();
  }
};

export default authenticate;
