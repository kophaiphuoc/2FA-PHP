package app

// TwoFA represents a 2FA record.
type TwoFA struct {
	ID       int
	Priority int
	Logo     string
	Name     string
	Secret   string
	Domain   string
}

// AddTwoFA adds a new 2FA record to the database and returns the ID of the new record.
func (d *Database) AddTwoFA(priority int, logo, name, secret, domain string) (int64, error) {
	insertSQL := `INSERT INTO two_fa (priority, logo, name, secret,domain) VALUES (?, ?, ?, ?,?)`
	result, err := d.db.Exec(insertSQL, priority, logo, name, secret, domain)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetTwoFAs retrieves all 2FA records from the database.
func (d *Database) GetTwoFAs() ([]TwoFA, error) {
	rows, err := d.db.Query("SELECT id, priority, logo, name, secret, domain FROM two_fa")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var twoFAs []TwoFA
	for rows.Next() {
		var twoFA TwoFA
		if err := rows.Scan(&twoFA.ID, &twoFA.Priority, &twoFA.Logo, &twoFA.Name, &twoFA.Secret, &twoFA.Domain); err != nil {
			return nil, err
		}
		twoFAs = append(twoFAs, twoFA)
	}

	return twoFAs, nil
}

// UpdateTwoFA updates an existing 2FA record in the database.
func (d *Database) UpdateTwoFA(id, priority int, logo, name, domain string) error {
	updateSQL := `UPDATE two_fa SET priority = ?, logo = ?, name = ?, domain = ? WHERE id = ?`
	_, err := d.db.Exec(updateSQL, priority, logo, name, domain, id)
	return err
}

// DeleteTwoFA deletes a 2FA record from the database.
func (d *Database) DeleteTwoFA(id int) error {
	deleteSQL := `DELETE FROM two_fa WHERE id = ?`
	_, err := d.db.Exec(deleteSQL, id)
	return err
}

// IsSecretExists checks if a given secret already exists in the database.
func (d *Database) IsSecretExists(secret string) (bool, error) {
	var count int
	query := "SELECT COUNT(*) FROM two_fa WHERE secret = ?"
	err := d.db.QueryRow(query, secret).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
