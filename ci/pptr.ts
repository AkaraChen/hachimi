import { concatUrl } from '@/util';
import type { Browser } from 'puppeteer';

export class PptrChecker {
    constructor(protected browser: Browser) {}

    async check(bv: string) {
        const url = concatUrl(bv);
        const page = await this.browser.newPage();
        await page.goto(url.href);
        try {
            await page.waitForSelector('.rollback-btn', {
                timeout: 3000,
            });
            return false;
        } catch (error) {
            return true;
        }
    }

    dispose() {
        return this.browser.close();
    }
}
