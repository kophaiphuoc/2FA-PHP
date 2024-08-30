package app

import (
	"fmt"
	"github.com/kbinani/screenshot"
	"image"
	"image/png"
	"os"
)

type Window struct {
	X, Y int
	W, H int
}

// CaptureScreen captures the screen
func CaptureScreen(window Window) (string, error) {

	// create rect
	rect := image.Rect(window.X, window.Y, window.X+window.W, window.Y+window.H)

	// capture rect
	img, err := screenshot.CaptureRect(rect)
	if err != nil {
		return "", fmt.Errorf("lỗi khi chụp màn hình: %v", err)
	}

	// save image to file
	file, err := os.Create("screenshot.png")
	if err != nil {
		return "", fmt.Errorf("lỗi khi tạo file: %v", err)
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	err = png.Encode(file, img)
	if err != nil {
		return "", fmt.Errorf("lỗi khi lưu ảnh: %v", err)
	}
	// log file save
	fmt.Println("Screenshot saved to screenshot.png")

	return "screenshot", nil
}
