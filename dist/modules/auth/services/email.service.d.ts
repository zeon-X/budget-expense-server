import { PasswordResetEmailData, VerificationEmailData } from "../types/auth.types";
export declare class EmailService {
    private readonly logger;
    sendVerificationEmail(data: VerificationEmailData): Promise<void>;
    sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void>;
}
