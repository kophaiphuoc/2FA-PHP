package app

import (
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

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

	// log result
	fmt.Println("Mã QR được tìm thấy:", result)

	// return result
	return result, nil
}
