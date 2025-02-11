declare module 'coadmin-lib' {
    export interface ReportIssuesOpts {
        folder?: string;
        live?: boolean;
        server?: string;
        server_path?: string;
        minimumInterval?: number;
        output?: boolean;
    }
    
    export interface ExtraInformation {
        [key: string]: any;
    }
    
    export class ReportIssues {
        constructor(appName: string, options?: ReportIssuesOpts);

        fatal  (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        warning(issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        debug  (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        info   (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
        error  (issue: any, extra?: ExtraInformation, options?: object): boolean | string;
    }
}