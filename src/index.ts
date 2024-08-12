import open from 'open';
import source from './source.json';

function pick<T>(array: Array<T>) {
    return array[Math.floor(Math.random() * array.length)] as T;
}

const picked = pick(source);
const url = new URL(`/video/${picked}`, 'https://www.bilibili.com/');
open(url.href);
