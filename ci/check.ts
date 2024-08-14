import fsp from 'node:fs/promises';
import path from 'node:path';
import source from '@/source.json';
import pAll from 'p-all';
import puppeteer from 'puppeteer';
import { PptrChecker } from './pptr';

const deduped = Array.from(new Set(source));
let result: string[] = [];
const checker = new PptrChecker(await puppeteer.launch());
await pAll(
    deduped.map((bv, idx) => {
        return async () => {
            if (await checker.check(bv)) {
                result[idx] = bv;
            } else {
                console.log(`视频 ${bv} 已下架`);
            }
        };
    }),
    { concurrency: 3 },
);
await checker.dispose();
result = result.filter(Boolean);
await fsp.writeFile(
    path.resolve(import.meta.dirname, '../src/source.json'),
    JSON.stringify(result, null, 4),
);
