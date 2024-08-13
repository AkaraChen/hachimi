import simpleGit from 'simple-git';
import { $ } from 'zx';

let haveUserGeneratedCommits = false;

if (process.env.CI === 'true') {
    const github: typeof import('@actions/github') = require('@actions/github');
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);
    const { data } = await octokit.rest.repos.listCommits({
        since: 'HEAD@{2.day.ago}',
        until: 'HEAD',
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
    });
    const commits = data.map((c) => c.commit);
    const ugc = commits.filter(
        (c) => !c.author?.name?.includes('github-actions'),
    );
    if (ugc.length > 0) {
        haveUserGeneratedCommits = true;
    }
} else {
    const git = simpleGit();
    const log = await git.log({
        from: 'HEAD@{2.day.ago}',
        to: 'HEAD',
    });
    const ugc = log.all.filter(
        (c) => !c.author_name.includes('github-actions'),
    );
    if (ugc.length > 0) {
        haveUserGeneratedCommits = true;
    }
}

if (haveUserGeneratedCommits) {
    $`pnpm bumpp patch -y`;
    console.log('Bumped version');
} else {
    console.log('No user generated commits');
}
