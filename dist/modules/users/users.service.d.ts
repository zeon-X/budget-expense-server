import { DatabaseService } from "../../database/database.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersService {
    private readonly database;
    constructor(database: DatabaseService);
    getMe(userId: string): Promise<{
        id: any;
        email: any;
        emailVerified: any;
        name: any;
        avatar: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateMe(userId: string, dto: UpdateUserDto): Promise<{
        id: any;
        email: any;
        emailVerified: any;
        name: any;
        avatar: any;
        createdAt: any;
        updatedAt: any;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteMe(userId: string): Promise<{
        message: string;
    }>;
    private sanitizeUser;
}
