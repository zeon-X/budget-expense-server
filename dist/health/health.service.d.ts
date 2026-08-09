import { DatabaseService } from '../database/database.service';
export declare class HealthService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    check(): Promise<{
        status: string;
        timestamp: string;
        services: {
            api: string;
            database: string;
        };
    }>;
}
