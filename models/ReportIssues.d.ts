type LogLevel = 'fatal' | 'warning' | 'debug' | 'info' | 'error';
export interface ReportOptions {
    live?: boolean;
    folder?: string;
    server?: string;
    server_path?: string;
    minimumInterval?: number;
    output?: boolean;
}
export interface IssueOptions {
    expireAfter?: number;
    minSeenCount?: number;
    hostname?: string;
}
interface ExtraData {
    [key: string]: unknown;
}
export interface ReportContent {
    v: number;
    issue_id: number;
    meta: Record<string, unknown>;
    options: Record<string, unknown>;
    caller: string;
    stackTrace: string[] | false;
    app: string;
    extra: ExtraData;
    description: string;
    level: LogLevel;
    libversion: string;
    t: number;
}
export default class ReportIssues {
    private socket;
    private buffer;
    private reported;
    private meta;
    private reportOptions;
    private appName;
    constructor(appName: string, options?: ReportOptions);
    fatal(issue: unknown, extra?: ExtraData, opts?: IssueOptions): boolean;
    warning(issue: unknown, extra?: ExtraData, opts?: IssueOptions): boolean;
    debug(issue: unknown, extra?: ExtraData, opts?: IssueOptions): boolean;
    info(issue: unknown, extra?: ExtraData, opts?: IssueOptions): boolean;
    error(issue: unknown, extra?: ExtraData, opts?: IssueOptions): boolean;
    private liveWorker;
    stackTrace(lines?: number): string[];
    private generateIssue;
    private add;
}
export {};
//# sourceMappingURL=ReportIssues.d.ts.map