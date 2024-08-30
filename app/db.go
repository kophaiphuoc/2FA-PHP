package app

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
)

// Database represents a SQLite3 database connection.
type Database struct {
	db *sql.DB
}

// NewDatabase creates a new SQLite3 database connection and sets up the table.
func NewDatabase(dbPath string) (*Database, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Create table if not exists
	createTableSQL := `CREATE TABLE IF NOT EXISTS two_fa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        priority INTEGER,
        logo TEXT,
        name TEXT,
        secret TEXT,
        domain TEXT
    );`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, fmt.Errorf("error creating table: %w", err)
	}

	return &Database{db: db}, nil
}

// Close closes the database connection.
func (d *Database) Close() error {
	return d.db.Close()
}
