/**
 * Type declarations for react-native-sqlite-storage
 */

declare module 'react-native-sqlite-storage' {
  export interface DatabaseParams {
    name: string;
    location: string;
  }

  export interface ResultSetRowList {
    length: number;
    item(index: number): any;
    raw(): any[];
  }

  export interface ResultSet {
    insertId: number;
    rowsAffected: number;
    rows: ResultSetRowList;
  }

  export interface Transaction {
    executeSql(
      sql: string,
      params?: any[],
      success?: (tx: Transaction, result: ResultSet) => void,
      error?: (tx: Transaction, error: any) => void
    ): void;
  }

  export interface SQLiteDatabase {
    executeSql(sql: string, params?: any[]): Promise<[ResultSet]>;
    transaction(
      callback: (tx: Transaction) => void,
      error?: (error: any) => void,
      success?: () => void
    ): void;
    close(): Promise<void>;
  }

  export interface SQLite {
    DEBUG(debug: boolean): void;
    enablePromise(enable: boolean): void;
    openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
    deleteDatabase(params: DatabaseParams): Promise<void>;
  }

  const SQLiteStorage: SQLite;
  export default SQLiteStorage;
}
