import { debug, info } from "./log";
import { ProcessName, processRequest } from "./process";

export function processBody(body: string) {
    const requestBody = JSON.parse(body) as GitHubRequest;
    if (requestBody.repository.name.toLowerCase().includes("modelsaber")) {

        info(`Processing request for project ${getProjectName(requestBody)}`);

        switch (requestBody.action) {
            case "created":
            case "released":
            case "published":
            case "prereleased":
                setTimeout(() => getAssetJson(requestBody), 1000);
                break;
        }
    }
}

function getAssetJson(requestBody: GitHubRequest) {
    fetch(requestBody.release.assets_url).then(res => res.json() as Promise<Asset[]>).then(assets => {
        if (assets.length > 0) {
            info(`Downloading ${assets[0].name} from ${assets[0].browser_download_url}`);
            const process = getProcessName(getProjectName(requestBody));
            processRequest(process!, assets[0].browser_download_url);
        }
    });
}

function getProcessName(projectName: string) {
    switch (projectName) {
        case "modelsaber.main":
            return ProcessName.Main;
        case "modelsaber.api":
            return ProcessName.Api;
    }
}

function getProjectName(requestBody: GitHubRequest) {
    return requestBody.repository.git_url.split("/").pop()!.split('.git')[0].toLowerCase();
}

interface User {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}

interface Release {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name?: string;
    draft: boolean;
    author: User;
    prerelease: boolean;
    created_at: Date;
    published_at: Date;
    assets: Asset[];
    tarball_url: string;
    zipball_url: string;
    body?: string;
}

interface Asset {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    uploader: User;
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: Date;
    updated_at: Date;
    browser_download_url: string;
}

interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: User;
    html_url: string;
    description?: any;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: Date;
    updated_at: Date;
    pushed_at: Date;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage?: any;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    forks_count: number;
    mirror_url?: any;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license?: any;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
}

enum Action {
    Created = "created",
    Deleted = "deleted",
    Edited = "edited",
    Released = "released",
    Published = "published",
    Unpublished = "unpublished",
    PreReleased = "prereleased"
}

interface GitHubRequest {
    action: Action;
    release: Release;
    repository: Repository;
    sender: User;
}

interface GitHubRelease {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string;
    zipball_url: string;
    discussion_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: Date;
    published_at: Date;
    author: User;
    assets: Asset[];
}