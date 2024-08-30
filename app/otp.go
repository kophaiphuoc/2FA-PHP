package app

import (
	"fmt"
	"github.com/pquerna/otp/totp"
	"regexp"
	"strings"
	"time"
)

func isValidBase32(secret string) bool {
	// Regex secret base32
	base32Regex := regexp.MustCompile(`^[A-Z2-7]+$`)
	return base32Regex.MatchString(secret)
}

func extractSecretFromURL(url string) (string, error) {
	otpauthRegex := regexp.MustCompile(`^otpauth:\/\/totp\/[^:]+:[^?]+\?secret=([a-zA-Z0-9]+)&?.*$`)
	matches := otpauthRegex.FindStringSubmatch(url)

	if len(matches) < 2 {
		return "", nil
	}
	secret := matches[1]
	if isValidBase32(secret) {
		return secret, nil
	}
	return secret, nil
}

func GenerateOTP(secret string) (string, string, int64, error) {

	// gen OTP for now time
	otp, err := totp.GenerateCode(secret, time.Now())
	if err != nil {
		return "", "", 0, err
	}

	// default period of time
	timeStep := 30

	// get now time
	currentTime := time.Now().Unix()

	// calculator time compared to present
	elapsed := currentTime % int64(timeStep)

	// Calculate remaining time in current cycle
	timeLeft := int64(timeStep) - elapsed

	return otp, secret, timeLeft, nil
}

func generateOTPInputHandler(input string) (string, string, int64, error) {
	var secret string

	// check secret
	if isValidBase32(input) {
		secret = input
	} else if strings.HasPrefix(input, "otpauth://totp/") {
		extractedSecret, err := extractSecretFromURL(input)
		if err != nil {
			return "", "", 0, err
		}
		secret = extractedSecret
	} else {
		return "", "", 0, nil
	}
	// Gen OTP
	return GenerateOTP(secret)
}

func startOTPRoutine(secret string) {
	// create a ticker to call the function back every 30 seconds
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		otp, _, timeLeft, err := GenerateOTP(secret)
		if err != nil {
			fmt.Printf("Lỗi khi tạo mã OTP: %v\n", err)
			return
		}

		fmt.Printf("Mã OTP: %s\n", otp)
		fmt.Printf("Thời gian còn lại trong chu kỳ 30 giây: %d giây\n", timeLeft)

		<-ticker.C
	}
}
