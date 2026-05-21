#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ADB_BIN="${ADB_BIN:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}/platform-tools/adb}"

if [[ ! -x "$ADB_BIN" ]]; then
  echo "adb not found at: $ADB_BIN"
  echo "Set ANDROID_SDK_ROOT or ADB_BIN, then retry."
  exit 1
fi

DEVICE_ID="$("$ADB_BIN" devices | awk 'NR>1 && $2=="device" {print $1; exit}')"
if [[ -z "${DEVICE_ID:-}" ]]; then
  echo "No Android device/emulator is connected."
  echo "Start an emulator (or connect a device), then retry."
  exit 1
fi

echo "Waiting for Android device: $DEVICE_ID"
"$ADB_BIN" -s "$DEVICE_ID" wait-for-device

for _ in {1..90}; do
  BOOT_OK="$("$ADB_BIN" -s "$DEVICE_ID" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  PKG_OK="$("$ADB_BIN" -s "$DEVICE_ID" shell service list 2>/dev/null | grep -c "package:" || true)"

  if [[ "$BOOT_OK" == "1" && "$PKG_OK" -gt 0 ]]; then
    echo "Android package service is ready on $DEVICE_ID."
    ABI_LIST="$("$ADB_BIN" -s "$DEVICE_ID" shell getprop ro.product.cpu.abilist 2>/dev/null | tr -d '\r' || true)"
    if [[ "$ABI_LIST" == *"x86_64"* ]]; then
      export ORG_GRADLE_PROJECT_reactNativeArchitectures="x86_64"
    elif [[ "$ABI_LIST" == *"arm64-v8a"* ]]; then
      export ORG_GRADLE_PROJECT_reactNativeArchitectures="arm64-v8a"
    else
      export ORG_GRADLE_PROJECT_reactNativeArchitectures="x86_64"
    fi

    # Keep Gradle cache local to the repo to avoid ~/.gradle lock/permission issues.
    export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$PROJECT_ROOT/.gradle-user-home}"
    mkdir -p "$GRADLE_USER_HOME"

    # Prevent env warnings from Expo config resolution during native build.
    export NODE_ENV="${NODE_ENV:-development}"

    echo "Using ABI(s): $ORG_GRADLE_PROJECT_reactNativeArchitectures"
    echo "Using GRADLE_USER_HOME: $GRADLE_USER_HOME"
    exec npx expo run:android --device "$DEVICE_ID" "$@"
  fi

  sleep 2
done

echo "Timed out waiting for Android package service on $DEVICE_ID."
echo "Try Android Studio > Device Manager > Cold Boot Now / Wipe Data."
exit 1
