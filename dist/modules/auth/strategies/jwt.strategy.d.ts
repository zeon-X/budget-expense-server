import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "../types/auth.types";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        sessionId: string;
        email: string;
    }>;
}
export {};
