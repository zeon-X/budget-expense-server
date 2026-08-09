export declare class TokenService {
    generateToken(): string;
    hashToken(token: string): string;
    getExpiration(minutes: number): Date;
}
