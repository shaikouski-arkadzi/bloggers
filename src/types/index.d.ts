declare global {
  namespace Express {
    export interface Request {
      auth: {
        userId: string | null;
        deviceId: string | null;
        iat: string | null;
      };
    }
  }
}

export {};
