import { readFileSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';

import chalk from 'chalk'

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

export class PuppetSummary {
    private data: PuppetSummaryData;

    constructor(PuppetSummaryFile: string) {
        const yamlContent = readFileSync(PuppetSummaryFile, 'utf8')
        const parsed = yamlLoad(yamlContent)
        this.data = this.processData(parsed);
    }

    public getSummary(): string {
        const sections: string[] = [];

        // Version and Environment Info
        sections.push(chalk.bold.blue('🔍 Puppet Run Summary'));
        sections.push(
            `${chalk.dim('Last Run:')} ${chalk.yellow(this.formatDate(this.data.version.config))}\n` +
            `${chalk.dim('Last Run Ago:')} ${chalk.yellow(this.data.version.config ? this.formatTimeAgo(Date.now() - this.data.version.config.getTime()) : 'N/A')}\n` +
            `${chalk.dim('Puppet Version:')} ${chalk.green(this.data.version.puppet)}\n` +
            `${chalk.dim('Environment:')} ${chalk.cyan(this.data.application.converged_environment)}`
        );

        // Resources Summary
        const resourcesInfo = this.data.resources;
        sections.push(chalk.bold.blue('\n📦 Resources'));
        sections.push(
            `${chalk.dim('Total:')} ${chalk.white(resourcesInfo.total)}\n` +
            `${chalk.dim('Changed:')} ${chalk.yellow(resourcesInfo.changed)}\n` +
            `${chalk.dim('Failed:')} ${this.formatFailureCount(resourcesInfo.failed)}\n` +
            `${chalk.dim('Out of Sync:')} ${chalk.yellow(resourcesInfo.out_of_sync)}`
        );

        // Events Summary
        const eventsInfo = this.data.events;
        sections.push(chalk.bold.blue('\n🎯 Events'));
        sections.push(
            `${chalk.dim('Success:')} ${chalk.green(eventsInfo.success)}\n` +
            `${chalk.dim('Failure:')} ${this.formatFailureCount(eventsInfo.failure)}\n` +
            `${chalk.dim('Total:')} ${chalk.white(eventsInfo.total)}`
        );

        // Time Summary
        const timeInfo = this.data.time;
        sections.push(chalk.bold.blue('\n⏱️ Timing'));
        sections.push(
            `${chalk.dim('Total Time:')} ${chalk.magenta(this.formatDuration(timeInfo.total))}\n` +
            `${chalk.dim('Config Retrieval:')} ${chalk.magenta(this.formatDuration(timeInfo.config_retrieval))}\n` +
            `${chalk.dim('Catalog Application:')} ${chalk.magenta(this.formatDuration(timeInfo.catalog_application))}`
        );

        return sections.join('\n');
    }

    private processData(parsedData: any): PuppetSummaryData {
        return {
            version: {
                config: parsedData.version?.config ? new Date(parsedData.version.config * 1000) : null,
                puppet: parsedData.version?.puppet ?? null,
            },
            application: {
                run_mode: parsedData.application?.run_mode ?? null,
                initial_environment: parsedData.application?.initial_environment ?? null,
                converged_environment: parsedData.application?.converged_environment ?? null,
            },
            resources: {
                changed: parsedData.resources?.changed ?? null,
                corrective_change: parsedData.resources?.corrective_change ?? null,
                failed: parsedData.resources?.failed ?? null,
                failed_to_restart: parsedData.resources?.failed_to_restart ?? null,
                out_of_sync: parsedData.resources?.out_of_sync ?? null,
                restarted: parsedData.resources?.restarted ?? null,
                scheduled: parsedData.resources?.scheduled ?? null,
                skipped: parsedData.resources?.skipped ?? null,
                total: parsedData.resources?.total ?? null,
            },
            time: {
                anchor: parsedData.time?.anchor ?? null,
                apt_key: parsedData.time?.apt_key ?? null,
                archive: parsedData.time?.archive ?? null,
                catalog_application: parsedData.time?.catalog_application ?? null,
                concat_file: parsedData.time?.concat_file ?? null,
                concat_fragment: parsedData.time?.concat_fragment ?? null,
                config_retrieval: parsedData.time?.config_retrieval ?? null,
                convert_catalog: parsedData.time?.convert_catalog ?? null,
                cron: parsedData.time?.cron ?? null,
                debconf: parsedData.time?.debconf ?? null,
                exec: parsedData.time?.exec ?? null,
                fact_generation: parsedData.time?.fact_generation ?? null,
                file: parsedData.time?.file ?? null,
                file_line: parsedData.time?.file_line ?? null,
                filebucket: parsedData.time?.filebucket ?? null,
                group: parsedData.time?.group ?? null,
                notify: parsedData.time?.notify ?? null,
                package: parsedData.time?.package ?? null,
                plugin_sync: parsedData.time?.plugin_sync ?? null,
                schedule: parsedData.time?.schedule ?? null,
                service: parsedData.time?.service ?? null,
                ssh_authorized_key: parsedData.time?.ssh_authorized_key ?? null,
                total: parsedData.time?.total ?? null,
                transaction_evaluation: parsedData.time?.transaction_evaluation ?? null,
                user: parsedData.time?.user ?? null,
                vcsrepo: parsedData.time?.vcsrepo ?? null,
                last_run: parsedData.time?.last_run ?? null,
            },
            changes: {
                total: parsedData.changes?.total ?? null,
            },
            events: {
                failure: parsedData.events?.failure ?? null,
                success: parsedData.events?.success ?? null,
                total: parsedData.events?.total ?? null,
            },
        };
    }

    // Getter methods for each section
    public getVersion(): VersionInfo {
        return this.data.version;
    }

    public getApplication(): ApplicationInfo {
        return this.data.application;
    }

    public getResources(): ResourcesInfo {
        return this.data.resources;
    }

    public getTime(): TimeInfo {
        return this.data.time;
    }

    public getChanges(): ChangesInfo {
        return this.data.changes;
    }

    public getEvents(): EventsInfo {
        return this.data.events;
    }

    // Helper method to get total execution time
    public getTotalExecutionTime(): number | null {
        return this.data.time.total;
    }

    // Helper method to check if there were any failures
    public hasFailures(): boolean {
        return (this.data.events.failure ?? 0) > 0 || (this.data.resources.failed ?? 0) > 0;
    }

    private formatDate(date: Date | null): string {
        if (!date) return 'N/A';
        return date.toISOString();
    }

    private formatFailureCount(count: number | null): string {
        if (!count) return chalk.green('0');
        return chalk.red(`${count}`);
    }

    private formatDuration(seconds: number | null): string {
        if (seconds === null) return 'N/A';
        if (seconds < 1) return `${(seconds * 1000).toFixed(2)}ms`;
        return `${seconds.toFixed(2)}s`;
    }

    // Add this helper function to format the time difference
    private formatTimeAgo(milliseconds: number): string {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const secondsDisplay = seconds % 60;
        const minutesDisplay = minutes % 60;
        const hoursDisplay = hours % 24;

        return [
            days > 0 ? `${days}d` : '',
            hoursDisplay > 0 ? `${hoursDisplay}h` : '',
            minutesDisplay > 0 ? `${minutesDisplay}m` : '',
            `${secondsDisplay}s`
        ].filter(Boolean).join(' ');
    }
}

if (require.main === module) {
    const puppetSummary = new PuppetSummary('/opt/puppetlabs/puppet/public/last_run_summary.yaml');

    // Access the data
    console.log(puppetSummary.getSummary()); // Date object
}
