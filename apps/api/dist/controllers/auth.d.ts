import { Request, Response } from 'express';
import { LoginRequest, RegisterRequest } from '../types';
export declare const register: (req: Request<{}, {}, RegisterRequest>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map