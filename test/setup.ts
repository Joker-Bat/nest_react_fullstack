import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
    try {
        // Delete the test.sqlite file before every test runs
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (err) {}
});
