# Encoding Mismatch

A Visual Studio Code extension that alerts when the encoding of an open file does not match the defined configuration.

## Features

- **Automatic encoding mismatch detection**: Monitors open files and detects when their actual encoding does not match the expected configuration
- **Visual status bar indicator**: Displays an alert indicator in the VS Code status bar when a mismatch is detected
- **Configurable warning messages**: Shows alert notifications with details about the expected vs. actual encoding

## Installation

1. Open VS Code
2. Go to the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Encoding Mismatch"
4. Click Install

## Usage

Once installed, the extension works automatically. When you open a file whose encoding does not match your `files.encoding` configuration:

1. An **alert indicator** will appear in the status bar (if enabled)
2. You will receive a **warning notification** with details (if enabled)

### Example

If your configuration expects `UTF-8` but you open a file with `windows-1252` encoding:

```text
Encoding mismatch in "file.txt": expected "utf8" but found "windows1252"
```

## Configuration

The extension provides the following configuration options in `settings.json`:

### `encodingMismatch.showErrorMessages`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Show warning messages when file encoding doesn't match the configured encoding

```json
{
  "encodingMismatch.showErrorMessages": true
}
```

### `encodingMismatch.showStatusBarIndicator`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Show a status bar indicator when encoding mismatch is detected

```json
{
  "encodingMismatch.showStatusBarIndicator": true
}
```

### Base encoding configuration

To define the expected encoding, use the standard VS Code configuration:

```json
{
  "files.encoding": "utf8"
}
```

You can set the encoding globally or per language:

```json
{
  "files.encoding": "utf8",
  "[python]": {
    "files.encoding": "utf8"
  },
  "[java]": {
    "files.encoding": "iso88591"
  }
}
```

## Feedback and Contributions

Feature suggestions and contributions are welcome. You can:

- Report issues
- Suggest new features
- Submit pull requests with improvements

---

**Enjoying the extension? Consider leaving a review or starring the repository.**
