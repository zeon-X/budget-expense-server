import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
    constructor(private readonly databaseService: DatabaseService) { }

    async check() {
        let database = 'up';

        try {
            await this.databaseService.$runCommandRaw({
                ping: 1,
            });
        } catch {
            database = 'down';
        }

        return {
            status: database === 'up' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            services: {
                api: 'up',
                database,
            },
        };
    }
}