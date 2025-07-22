import { Request, Response } from 'express';
import { SalonSearchParams } from '../types';
export declare const getSalons: (req: Request<{}, {}, {}, SalonSearchParams>, res: Response) => Promise<void>;
export declare const getSalonById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=salons.d.ts.map