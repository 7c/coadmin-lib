declare module 'coadmin-lib' {
    export interface ReportIssuesOpts {
        folder: string;
        minimumInterval?: number;
        live?: boolean;
    }

    export interface ExtraInformation {
        [key: string]: any;
    }

    export class ReportIssues {
        constructor(appName: string, options?: ReportIssuesOpts);

        fatal  (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        warning(issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        info   (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        error  (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
    }
}