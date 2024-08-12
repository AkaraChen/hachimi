import fsp from 'node:fs/promises';
import path from 'node:path';
import source from '@/source.json';
import puppeteer from 'puppeteer';
import { PptrChecker } from './pptr';

async function main() {
    const checker = new PptrChecker(await puppeteer.launch());
    const deduped = Array.from(new Set(source));
    const result: string[] = [];
    for (const bv of deduped) {
        if (await checker.check(bv)) {
            result.push(bv);
        } else {
            console.log(`视频 ${bv} 已下架`);
        }
    }
    await checker.dispose();
    await fsp.writeFile(
        path.resolve(import.meta.dirname, '../src/source.json'),
        JSON.stringify(result, null, 4),
    );
}

main();
