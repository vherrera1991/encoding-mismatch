import * as vscode from 'vscode';

// Map equivalent encodings that VS Code may confuse
const equivalentEncodings: Record<string, Set<string>> = {
	'windows1252': new Set(['windows1252', 'iso88591', 'iso-8859-1']),
	'iso88591': new Set(['windows1252', 'iso88591', 'iso-8859-1']),
};

function normalizeEncoding(encoding: string): string {
	return encoding.toLowerCase().replace(/[-_]/g, '');
}

function areEncodingsEquivalent(encoding1: string, encoding2: string): boolean {
	const norm1 = normalizeEncoding(encoding1);
	const norm2 = normalizeEncoding(encoding2);

	if (norm1 === norm2) {
		return true;
	}

	// Check if encodings are in the equivalent set
	if (equivalentEncodings[norm1]) {
		return equivalentEncodings[norm1].has(norm2) || equivalentEncodings[norm1].has(encoding2);
	}

	return false;
}

function getConfiguredEncoding(document: vscode.TextDocument): string | undefined {
	const config = vscode.workspace.getConfiguration('files', {
		languageId: document.languageId,
		uri: document.uri
	});
	return config.get<string>('encoding');
}

function checkEncodingMismatch(document: vscode.TextDocument, statusBarItem: vscode.StatusBarItem): void {
	// Skip untitled and unsaved documents
	if (document.isUntitled) {
		statusBarItem.hide();
		return;
	}

	const actualEncoding = document.encoding;
	const configuredEncoding = getConfiguredEncoding(document);

	// Only show alert if configured encoding exists and doesn't match actual encoding
	if (configuredEncoding && !areEncodingsEquivalent(actualEncoding, configuredEncoding)) {
		// Get configuration settings
		const config = vscode.workspace.getConfiguration('encodingMismatch');
		const showMessages = config.get<boolean>('showErrorMessages', true);
		const showStatusBar = config.get<boolean>('showStatusBarIndicator', true);

		// Show warning message if enabled
		if (showMessages) {
			vscode.window.showWarningMessage(
				`Encoding mismatch in "${document.fileName}": expected "${configuredEncoding}" but found "${actualEncoding}"`
			);
		}

		// Update and show status bar if enabled
		if (showStatusBar) {
			statusBarItem.tooltip = `Expected "${configuredEncoding}" but found "${actualEncoding}"`;
			statusBarItem.show();
		} else {
			statusBarItem.hide();
		}
	} else {
		// No mismatch detected, hide status bar
		statusBarItem.hide();
	}
}

export function activate(context: vscode.ExtensionContext) {

	// console.log('Encoding Mismatch extension is now active!');

	// Create status bar item
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100.2
	);
	statusBarItem.text = '$(alert) Encoding Mismatch';
	statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
	statusBarItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
	context.subscriptions.push(statusBarItem);

	// Check all currently open documents on activation
	vscode.workspace.textDocuments.forEach(doc => checkEncodingMismatch(doc, statusBarItem));

	// Check encoding when a document is opened
	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument(doc => checkEncodingMismatch(doc, statusBarItem))
	);

	// Check encoding when switching between editors
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				checkEncodingMismatch(editor.document, statusBarItem);
			} else {
				statusBarItem.hide();
			}
		})
	);

	// Re-check all documents when configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration('files.encoding')) {
				vscode.workspace.textDocuments.forEach(doc => checkEncodingMismatch(doc, statusBarItem));
			}
			// Update status bar visibility when showStatusBarIndicator setting changes
			if (event.affectsConfiguration('encodingMismatch.showStatusBarIndicator')) {
				const activeEditor = vscode.window.activeTextEditor;
				if (activeEditor) {
					checkEncodingMismatch(activeEditor.document, statusBarItem);
				}
			}
		})
	);

}

export function deactivate() {}
