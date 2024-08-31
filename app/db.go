package app

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3" // Import SQLite3 driver
	"os"
	"path/filepath"
)

// Database struct chứa kết nối đến SQLite
type Database struct {
	db *sql.DB
}

// NewDatabase mở kết nối đến cơ sở dữ liệu SQLite và tạo bảng nếu chưa tồn tại.
func NewDatabase(dbName string) (*Database, error) {
	// Lấy thư mục ứng dụng (Application Support) trong thư mục người dùng
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("error getting user home directory: %w", err)
	}

	// Tạo đường dẫn tới thư mục Application Support
	appSupportDir := filepath.Join(homeDir, "Library", "Application Support", "2FA-PHP")
	// Tạo thư mục nếu nó chưa tồn tại
	if err := os.MkdirAll(appSupportDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("error creating application support directory: %w", err)
	}

	// Tạo đường dẫn đầy đủ cho file database
	dbPath := filepath.Join(appSupportDir, dbName)

	// Mở kết nối đến cơ sở dữ liệu
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Đảm bảo kết nối được thiết lập thành công
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	// Tạo bảng nếu chưa tồn tại
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
		db.Close()
		return nil, fmt.Errorf("error creating table: %w", err)
	}

	// Trả về đối tượng Database
	return &Database{db: db}, nil
}

// Đảm bảo đóng kết nối khi không sử dụng
func (d *Database) Close() error {
	return d.db.Close()
}
