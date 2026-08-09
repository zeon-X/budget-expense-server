import { config } from 'dotenv';
import { resolve } from 'node:path';

// `__dirname` is `src/config` in development and `dist/config` after build.
// Both resolve to the project-root `.env` file.
config({
    path: resolve(__dirname, '..', '..', '.env'),
    quiet: true,
});
