import { UsersService } from "./users.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: any;
        email: any;
        emailVerified: any;
        name: any;
        avatar: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        id: any;
        email: any;
        emailVerified: any;
        name: any;
        avatar: any;
        createdAt: any;
        updatedAt: any;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteMe(req: any): Promise<{
        message: string;
    }>;
}
