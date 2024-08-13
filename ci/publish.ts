import { createRequire } from 'node:module';
import { $ } from 'zx';

const require = createRequire(import.meta.url);
const github: typeof import('@actions/github') = require('@actions/github');
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);
const { data } = await octokit.rest.repos.listCommits({
    since: 'HEAD@{1.day.ago}',
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
});
const commits = data.map((c) => c.commit);
const ugc = commits.filter((c) => !c.author?.name?.includes('github-actions'));
if (ugc.length > 0) {
    $`pnpm bumpp patch -y`;
    console.log('Bumped version');
} else {
    console.log('No user generated commits');
}
