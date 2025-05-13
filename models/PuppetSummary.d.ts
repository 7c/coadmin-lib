export interface VersionInfo {
    config: Date | null;
    puppet: string | null;
}
export interface ApplicationInfo {
    run_mode: string | null;
    initial_environment: string | null;
    converged_environment: string | null;
}
export interface ResourcesInfo {
    changed: number | null;
    corrective_change: number | null;
    failed: number | null;
    failed_to_restart: number | null;
    out_of_sync: number | null;
    restarted: number | null;
    scheduled: number | null;
    skipped: number | null;
    total: number | null;
}
export interface TimeInfo {
    anchor: number | null;
    apt_key: number | null;
    archive: number | null;
    catalog_application: number | null;
    concat_file: number | null;
    concat_fragment: number | null;
    config_retrieval: number | null;
    convert_catalog: number | null;
    cron: number | null;
    debconf: number | null;
    exec: number | null;
    fact_generation: number | null;
    file: number | null;
    file_line: number | null;
    filebucket: number | null;
    group: number | null;
    notify: number | null;
    package: number | null;
    plugin_sync: number | null;
    schedule: number | null;
    service: number | null;
    ssh_authorized_key: number | null;
    total: number | null;
    transaction_evaluation: number | null;
    user: number | null;
    vcsrepo: number | null;
    last_run: number | null;
}
export interface ChangesInfo {
    total: number | null;
}
export interface EventsInfo {
    failure: number | null;
    success: number | null;
    total: number | null;
}
export interface PuppetSummaryData {
    version: VersionInfo;
    application: ApplicationInfo;
    resources: ResourcesInfo;
    time: TimeInfo;
    changes: ChangesInfo;
    events: EventsInfo;
}
export declare class PuppetSummary {
    private data;
    constructor(PuppetSummaryFile: string);
    getSummary(): string;
    private processData;
    getVersion(): VersionInfo;
    getApplication(): ApplicationInfo;
    getResources(): ResourcesInfo;
    getTime(): TimeInfo;
    getChanges(): ChangesInfo;
    getEvents(): EventsInfo;
    getTotalExecutionTime(): number | null;
    hasFailures(): boolean;
    private formatDate;
    private formatFailureCount;
    private formatDuration;
    private formatTimeAgo;
}
//# sourceMappingURL=PuppetSummary.d.ts.map