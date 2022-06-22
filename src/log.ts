import { stdout } from "process";

enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    Fatal = 4
}

enum ConsoleColor {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m"
}

function log(level: LogLevel, message: string) {
    switch (level) {
        case LogLevel.Debug:
            process.stdout.write(`\x1b[32m[DEBUG]\x1b[0m ${message}\n`);
            break;
        case LogLevel.Info:
            process.stdout.write(`[INFO] ${message}\n`);
            break;
        case LogLevel.Warn:
            process.stdout.write(`\x1b[33m[WARN] ${message}\x1b[0m\n`);
            break;
        case LogLevel.Error:
            process.stdout.write(`\x1b[31m[ERROR] ${message}\x1b[0m\n`);
            break;
        case LogLevel.Fatal:
            process.stdout.write(`\x1b[31m[FATAL] ${message}\x1b[0m\n`);
            break;
    }
}

export function debug(message: string | undefined) {
    if (message)
        log(LogLevel.Debug, message);
}

export function info(message: string | undefined) {
    if (message)
        log(LogLevel.Info, message);
}

export function warn(message: string | undefined) {
    if (message)
        log(LogLevel.Warn, message);
}

export function error(message: string | undefined) {
    if (message)
        log(LogLevel.Error, message);
}

export function fatal(message: string | undefined) {
    if (message)
        log(LogLevel.Fatal, message);
}