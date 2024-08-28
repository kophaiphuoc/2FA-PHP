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

// CaptureScreen captures the screen and scans for QR codes
func CaptureScreen(window Window) (string, error) {

	// Tạo một hình chữ nhật với vị trí và kích thước đã xác định
	rect := image.Rect(window.X, window.Y, window.X+window.W, window.Y+window.H)

	// Chụp màn hình trong khu vực đã xác định
	img, err := screenshot.CaptureRect(rect)
	if err != nil {
		return "", fmt.Errorf("lỗi khi chụp màn hình: %v", err)
	}

	// Lưu hình ảnh đã chụp vào file
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
	// Ghi log rằng hình ảnh đã được lưu
	fmt.Println("Screenshot saved to screenshot.png")

	return "screenshot", nil
}
