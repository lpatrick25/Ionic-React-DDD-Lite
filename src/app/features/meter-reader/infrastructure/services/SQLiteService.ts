import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  private db: SQLiteDBConnection | null = null;
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private readonly dbName = 'meter-reader';

  async initializeDatabase(): Promise<void> {
    // Ensure consistency of connections
    await this.sqlite.checkConnectionsConsistency();

    // Check if connection already exists
    const isConn = (await this.sqlite.isConnection(this.dbName, false)).result;

    if (isConn) {
      console.log('[SQLiteService] Reusing existing connection');
      this.db = await this.sqlite.retrieveConnection(this.dbName, false);
    } else {
      console.log('[SQLiteService] Creating new connection');
      this.db = await this.sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false
      );
    }

    await this.db.open();

    // Schema definition
    const schema = `
      CREATE TABLE IF NOT EXISTS concessionaires (
        id INTEGER PRIMARY KEY,
        account_number TEXT UNIQUE,
        meter_number TEXT UNIQUE,
        first_name TEXT,
        middle_name TEXT,
        last_name TEXT,
        extension_name TEXT,
        address TEXT,
        street_address TEXT,
        email TEXT UNIQUE,
        phone_number TEXT UNIQUE,
        meter_type TEXT,
        status TEXT,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS meters (
        id INTEGER PRIMARY KEY,
        concessionaire_id INTEGER,
        installation_date TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (concessionaire_id) REFERENCES concessionaires(id)
      );
      CREATE TABLE IF NOT EXISTS meter_readings (
        id INTEGER PRIMARY KEY,
        meter_id INTEGER,
        reader_id INTEGER,
        reading_date TEXT,
        previous_reading INTEGER,
        present_reading INTEGER,
        consumption INTEGER,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (meter_id) REFERENCES meters(id)
      );
      CREATE TABLE IF NOT EXISTS billings (
        id INTEGER PRIMARY KEY,
        bill_no TEXT,
        concessionaire_id INTEGER,
        meter_reading_id INTEGER,
        billing_month TEXT,
        payment_deadline TEXT,
        disconnection_date TEXT,
        amount_due REAL,
        status TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (concessionaire_id) REFERENCES concessionaires(id),
        FOREIGN KEY (meter_reading_id) REFERENCES meter_readings(id)
      );
      CREATE TABLE IF NOT EXISTS tariff_rates (
        id INTEGER PRIMARY KEY,
        effective_date TEXT,
        min_consumption INTEGER,
        max_consumption INTEGER,
        flat_amount REAL,
        rate_per_cubic_meter REAL,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        middle_name TEXT,
        last_name TEXT,
        extension_name TEXT,
        phone_number TEXT UNIQUE,
        email TEXT UNIQUE,
        email_verified_at TEXT,
        role TEXT,
        status TEXT,
        created_at TEXT,
        updated_at TEXT
      );
    `;

    await this.db.execute(schema);
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.query(query, params);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
