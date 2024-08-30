package app

import (
	"context"
	_ "database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	db  *Database
}

type OTPAndTimeExp struct {
	Otp     string
	TimeExp int64
	Secret  string
}

// TwoFA represents a 2FA record.
type TwoFAS struct {
	ID       int
	Priority int
	Logo     string
	Name     string
	Secret   string
	Domain   string
}

// NewApp creates a new App application struct
func NewApp(ctx context.Context, db *Database) *App {
	return &App{
		ctx: ctx,
		db:  db,
	}
}

//func NewApp() *App {
//	return &App{}
//}

// Startup is called when the app starts. The context is saved
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) HandlerSecret(secret string) (string, error) {

	secretTest := "2EWI7ARW24G75TTO"

	if secret == "" {
		return "OTP is invalid", nil
	}

	go startOTPRoutine(secretTest)

	select {}
}

// CaptureScreenAndScanQR captures the screen and scans for QR codes
func (a *App) CaptureScreenAndScanQR() (string, error) {

	// get position window
	x, y := runtime.WindowGetPosition(a.ctx)

	// get size window
	width, height := runtime.WindowGetSize(a.ctx)

	window := Window{
		X: x,
		Y: y,
		W: width,
		H: height,
	}

	_, err := CaptureScreen(window)

	result, err := DecodeQRCodeFromImage("screenshot.png")
	if err != nil {
		return "", err
	}
	// return result
	return result, nil
}

func (a *App) HandlerSecretTest(secret string) (string, error) {
	key := "examplekey123456"

	// encode data
	encryptedData, err := Encrypt([]byte(key), []byte(secret))
	if err != nil {
		fmt.Println("Error encrypting data:", err)
		return "", err
	}

	err = SaveToFile("secret_data.enc", encryptedData)
	if err != nil {
		fmt.Println("Error saving file:", err)
		return "", err
	}

	// Read file and decode
	dataFromFile, err := ReadFromFile("secret_data.enc")
	if err != nil {
		fmt.Println("Error reading file:", err)
		return "", err
	}

	decryptedData, err := Decrypt([]byte(key), dataFromFile)
	if err != nil {
		fmt.Println("Error decrypting data:", err)
		return "", err
	}

	fmt.Println("Decrypted data:", string(decryptedData))

	return string(decryptedData), nil
}

func (a *App) GetOTPAndTimeExp(secret string) (OTPAndTimeExp, error) {
	otp, key, timeLeft, err := generateOTPInputHandler(secret)
	if err != nil {
		return OTPAndTimeExp{}, err
	}
	if key == "" {
		return OTPAndTimeExp{}, fmt.Errorf("key cannot be empty")
	}
	return OTPAndTimeExp{Otp: otp, TimeExp: timeLeft, Secret: key}, nil
}

// AddTwoFA adds a new 2FA record to the database.
func (a *App) AddTwoFA(priority int, logo, name, secret, domain string) (int64, error) {

	// check secret
	exists, err := a.db.IsSecretExists(secret)
	if err != nil {
		fmt.Printf("Error checking secret existence: %v\n", err)
		return 0, err
	}

	// is secret
	if exists {
		return 0, fmt.Errorf("secret already exists")
	}

	// is not secret
	id, err := a.db.AddTwoFA(priority, logo, name, secret, domain)
	if err != nil {
		fmt.Printf("Error adding 2FA: %v\n", err)
		return 0, err
	}

	return id, nil
}

// GetTwoFAs retrieves all 2FA records and maps them to a new structure.
func (a *App) GetTwoFAs() ([]map[string]interface{}, error) {
	twoFAs, err := a.db.GetTwoFAs()
	if err != nil {
		fmt.Printf("Error retrieving 2FA records: %v", err)
		return nil, err
	}

	var result []map[string]interface{}
	for _, twoFA := range twoFAs {
		otpAndTimeExp, err := a.GetOTPAndTimeExp(twoFA.Secret)
		if err != nil {
			fmt.Printf("Error generating OTP and timeExp for secret %s: %v", twoFA.Secret, err)
			return nil, err
		}

		record := map[string]interface{}{
			"priority": twoFA.Priority,
			"Logo":     twoFA.Logo,
			"Name":     twoFA.Name,
			"Secret":   twoFA.Secret,
			"otp":      otpAndTimeExp.Otp,
			"domain":   twoFA.Domain,
			"timeExp":  otpAndTimeExp.TimeExp,
		}

		result = append(result, record)
	}

	return result, nil
}

// UpdateTwoFA updates an existing 2FA record in the database.
func (a *App) UpdateTwoFA(id, priority int, logo, name, domain string) error {
	err := a.db.UpdateTwoFA(id, priority, logo, name, domain)
	if err != nil {
		fmt.Printf("Error updating 2FA record: %v", err)
	}
	return err
}

// DeleteTwoFA deletes a 2FA record from the database.
func (a *App) DeleteTwoFA(id int) error {
	err := a.db.DeleteTwoFA(id)
	if err != nil {
		fmt.Printf("Error deleting 2FA record: %v", err)
	}
	return err
}
