import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import CRC32 from 'crc-32';
import { CoadminService3 } from './CoadminService3'

jest.mock('fs');
jest.mock('path');
jest.useFakeTimers();

describe('CoadminService3', () => {
    let service: any;
    const mockFolder = '/mock/coadmin';
    const serviceName = 'test-service';
    
    beforeEach(() => {
        jest.clearAllMocks();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
        service = new CoadminService3(serviceName, { folder: mockFolder, ping: false });
    });

    describe('constructor', () => {
        it('initializes with default options when none provided', () => {
            const defaultService = new CoadminService3(serviceName);
            expect(defaultService.options.folder).toBe('/var/coadmin');
            expect(defaultService.options.ping).toBe(true);
        });

       

        it('sets up auto-ping when enabled', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval');
            const pingService = new CoadminService3(serviceName, { folder: mockFolder, ping: true });
            expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
            setIntervalSpy.mockRestore();
        });
    });

    describe('ping functionality', () => {
        it('sets up correct ping parameters', () => {
            const spyReport = jest.spyOn(CoadminService3.prototype, 'reportSuccess');
            const pingService = new CoadminService3(serviceName, { folder: mockFolder, ping: true });
            
            expect(spyReport).toHaveBeenCalledWith('ping');
            spyReport.mockRestore();
        });
    });

    describe('report', () => {
        const operation = 'test-operation';
        const params = { test: 'params' };


        it('handles undefined operation', () => {
            const result = service.report(undefined, params);
            expect(fs.writeFileSync).toHaveBeenCalled();
            const fileContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1] as string);
            expect(fileContent.operation).toBeUndefined();
        });

        it('handles various params types', () => {
            service.report(operation+'1', undefined);
            service.report(operation+'2', null);
            service.report(operation+'3', false);
            
            const calls = (fs.writeFileSync as jest.Mock).mock.calls;
            const contents = calls.map(call => JSON.parse(call[1] as string));
            // console.log(contents);
            
            expect(contents[0]).not.toHaveProperty('params');
            expect(contents[1]).toHaveProperty('params');
            expect(contents[2].params).toBe(false);
        });

        it('creates report file with correct content', () => {
            const expectedFileName = Math.abs(CRC32.str(`${serviceName}_${operation}`)) + '.coadmin_service';
            const fullPath = path.join(mockFolder, expectedFileName);
            
            service.report(operation, params);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                fullPath,
                expect.any(String)
            );

            const fileContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1] as string);
            expect(fileContent).toMatchObject({
                v: 3,
                service: serviceName,
                operation,
                params,
                error: false
            });
        });

        it('handles non-existent folder', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            const result = service.report(operation, params);
            expect(result).toBe(false);
            expect(fs.writeFileSync).not.toHaveBeenCalled();
        });

        it('handles write errors', () => {
            const mockError = new Error('Write failed');
            (fs.writeFileSync as jest.Mock).mockImplementation(() => {
                throw mockError;
            });
            
            const result = service.report(operation, params);
            expect(result).toBe(mockError);
        });
    });

    describe('reportSuccess', () => {
        it('reports only after specified interval', () => {
            const operation = 'test-operation-'+Date.now();
            
            service.reportSuccess(operation, null);
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
            
            // Try reporting again immediately
            service.reportSuccess(operation, null);
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
            
            // Advance time by more than the interval
            delete service.reported[operation]
            
            service.reportSuccess(operation, null);
            expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
        });
    });

    describe('reportError', () => {
        it('creates error report with error flag set', () => {
            const operation = 'error-operation';
            const params = { error: 'test' };
            
            service.reportError(operation, params);
            
            const fileContent = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1] as string);
            expect(fileContent.error).toBe(true);
        });
    });

   
});