import { Request, Response, NextFunction } from 'express';
import supabase from '~/config/supabase';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Access denied. No token provided.',
        message: 'Authorization header with Bearer token is required' 
      });
      return;
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // 2. Verify token với Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token verification failed' 
      });
      return;
    }

    // 3. Lấy thông tin chi tiết user từ database (nếu cần)
    const { data: userProfile, error: profileError } = await supabase
      .from('user')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('Could not fetch user profile:', profileError.message);
    }

    // 4. Gán user info vào req để controller sử dụng
    req.user = {
      id: user.id,
      email: user.email,
      ...userProfile // Merge với profile nếu có
    };

    next(); // Chuyển sang middleware/controller tiếp theo
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid or expired token' 
    });
    return;
  }
};

export default authenticate;