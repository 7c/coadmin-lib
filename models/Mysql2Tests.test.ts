import mysql2 from 'mysql2/promise';
import { Mysql2Tests } from './Mysql2Tests';

describe('Mysql2Tests', () => {
    describe('isAlive', () => {
        test('should return true if mysql2handle is alive', async () => {
            // Arrange
            const mockMysql2handle = {
                ping: jest.fn().mockResolvedValue(undefined)
            } as unknown as mysql2.Connection;

            // Act
            const result = await Mysql2Tests.isAlive(mockMysql2handle);

            // Assert
            expect(result).toBe(true);
            expect(mockMysql2handle.ping).toHaveBeenCalled();
        });

        test('should return false if mysql2handle is not alive', async () => {
            // Arrange
            const mockMysql2handle = {
                ping: jest.fn().mockRejectedValue(new Error('Connection failed'))
            } as unknown as mysql2.Connection;

            // Act
            
            const result = await Mysql2Tests.isAlive(mockMysql2handle);

            // Assert
            expect(result).toBe(false);
            expect(mockMysql2handle.ping).toHaveBeenCalled();
        });

        test('should return "mysql2handle is null" if mysql2handle is null', async () => {
            // Arrange
            const mockMysql2handle = null;

            // Act
            const result = await Mysql2Tests.isAlive(mockMysql2handle as unknown as mysql2.Connection);

            // Assert
            expect(result).toBe('mysql2handle is null');
        });
    });
});