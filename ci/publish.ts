import simpleGit from 'simple-git';
import { $ } from 'zx';

const git = simpleGit();

const log = await git.log({
    from: 'HEAD@{2.day.ago}',
    to: 'HEAD',
});
const ugc = log.all.filter((c) => !c.author_name.includes('github-actions'));
if (ugc.length > 0) {
    $`pnpm bumpp patch -y`;
    console.log('Bumped version');
} else {
    console.log('No user generated commits');
}
