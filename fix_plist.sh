#!/bin/bash

# Define the path to the generated Info.plist file
PLIST_PATH="./build/bin/Info.plist" # Adjust the path if it's different

# Check if the Info.plist file exists
if [ -f "$PLIST_PATH" ]; then
    echo "Modifying deployment target in Info.plist..."

    # Set the correct macOS deployment target (e.g., 10.13)
    /usr/libexec/PlistBuddy -c "Set :LSMinimumSystemVersion 10.13" "$PLIST_PATH"

    echo "Deployment target set to macOS 10.13 in Info.plist"
else
    echo "Info.plist not found at $PLIST_PATH"
fi
