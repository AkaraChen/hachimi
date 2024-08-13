#!/usr/bin/env node

import source from '@/source.json' with { type: 'json' };
import { concatUrl } from '@/util';
import open from 'open';

function pick<T>(array: Array<T>) {
    return array[Math.floor(Math.random() * array.length)] as T;
}

const picked = pick(source);
const url = concatUrl(picked);
open(url.href);
