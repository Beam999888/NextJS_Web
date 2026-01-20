import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
    if (pool) return pool;
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'thai_address';
    pool = mysql.createPool({ host, port, user, password, database, connectionLimit: 5, charset: 'utf8mb4_unicode_ci' });
    return pool;
}

