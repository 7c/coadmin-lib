declare module 'coadmin-lib' {
    export interface ReportIssuesOpts {
        folder: string;
        minimumInterval?: number;
    }

    export interface ExtraInformation {
        [key: string]: any;
    }

    export class ReportIssues {
        constructor(appName: string, options?: ReportIssuesOpts);
        fatal(issueDescription: string, extra?: ExtraInformation, options?: object): boolean | string | Error;
        warning(issueDescription: string, extra?: ExtraInformation, options?: object): boolean | string | Error;
        info(issueDescription: string, extra?: ExtraInformation, options?: object): boolean | string | Error;
        error(issueDescription: string, extra?: ExtraInformation, options?: object): boolean | string | Error;
    }
}