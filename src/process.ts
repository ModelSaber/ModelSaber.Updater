import { exec, ExecException, ExecOptions } from "child_process";
import { info, error, warn } from "./log";

export enum ProcessName {
    Main = "modelsaber.main",
    Api = "modelsaber.api",
}

function shutdown(process: ProcessName) {
    return execSync(`systemctl stop ${process}`);
}

function start(process: ProcessName) {
    return execSync(`systemctl start ${process}`);
}

function download(url: string, path: string) {
    return execSync(`wget -O ${path} ${url}`);
}

function unpack(process: ProcessName, path: string) {
    const folder = (process as string).split(".")[1];
    return execSync(`rm -rf /srv/${folder}/**/*.js`).then(() => {
        return execSync(`rm -rf /srv/${folder}/**/*.css`).then(() => {
            return execSync(`rm -rf /srv/${folder}/**/*.map`).then(() => {
                return execSync(`tar -xzf ${path} -C /srv/${folder}`);
            });
        });
    });
}

export function processRequest(process: ProcessName, url: string) {
    return new Promise<void>((resolve, reject) => {
        info(`Stopping ${process}`);
        shutdown(process).then(() => {
            info(`Downloading ${process}`);
            return downloadRequest(url, process);
        }).then(() => {
            resolve();
        }).catch((err: Error) => {
            error(err.message);
            error(err.stack);
            reject(err);
        });
    });
}
function downloadRequest(url: string, process: ProcessName): void | PromiseLike<void> {
    return download(url, `/tmp/${process}.tgz`).then(() => {
        info(`Unpacking ${process}`);
        return unpack(process, `/tmp/${process}.tgz`).then(() => {
            info(`Starting ${process}`);
            return start(process).then(() => {
                info(`${process} started successfully. Cleaning up`);
                return execSync(`rm -rf /tmp/${process}.tgz`);
            });
        });
    });
}

const execSync = (command: string, options?: { encoding: BufferEncoding; } & ExecOptions) => {
    return new Promise<void>((resolve, reject) => {
        exec(command, options, handleExecArgs).on('exit', () => {
            resolve();
        }).on('error', (err) => {
            reject(err);
        });
    });
}


function handleExecArgs(err: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) {
    if (err) {
        error(err.message);
        error(err.stack);
        if (err.code)
            error(`Exit code: ${err.code}`);
        return;
    }
    if (stderr) {
        if (stderr instanceof Buffer) {
            warn(stderr.toString());
        } else {
            warn(stderr);
        }
        return;
    }
    if (stdout instanceof Buffer) {
        info(stdout.toString());
    } else {
        info(stdout);
    }
}