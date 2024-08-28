package app

import "os"

func SaveToFile(fileName, data string) error {
	return os.WriteFile(fileName, []byte(data), 0644)
}

func ReadFromFile(fileName string) (string, error) {
	data, err := os.ReadFile(fileName)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
