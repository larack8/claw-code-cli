import * as React from 'react';
import {useState} from 'react';
import {Box, Text} from '../../ink.js';
import {Dialog} from 'src/components/design-system/Dialog';
import {getSettingsForSource, updateSettingsForSource} from 'src/utils/settings/settings';
import type {LocalJSXCommandCall} from 'src/types/command';

export const call: LocalJSXCommandCall = async (onDone, context) => {
	return <ApiSetup onClose={onDone}/>;
};

function ApiSetup({onClose}: { onClose: (result?: string) => void }) {
	const [authToken, setAuthToken] = useState('');
	const [baseUrl, setBaseUrl] = useState('https://api.acedata.cloud');
	const [step, setStep] = useState<'input' | 'saving' | 'done'>('input');

	const handleSave = async () => {
		setStep('saving');

		try {
			// Get current user settings
			const currentSettings = getSettingsForSource('userSettings');

			// Update env variables
			const updatedSettings = {
				...currentSettings,
				env: {
					...(currentSettings.env || {}),
					ANTHROPIC_AUTH_TOKEN: authToken,
					ANTHROPIC_BASE_URL: baseUrl,
				},
			};

			// Save to user settings
			await updateSettingsForSource('userSettings', updatedSettings);

			setStep('done');
			setTimeout(() => {
				onClose('API configuration saved successfully');
			}, 1500);
		} catch (error) {
			onClose(`Failed to save configuration: ${error}`);
		}
	};

	if (step === 'saving') {
		return (
			<Box flexDirection="column" padding={1}>
				<Text>Saving configuration...</Text>
			</Box>
		);
	}

	if (step === 'done') {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="green">? Configuration saved successfully!</Text>
				<Text dimColor>Restart the CLI to apply changes.</Text>
			</Box>
		);
	}

	return (
		<Dialog
			title="API Configuration"
			onClose={() => onClose('API setup cancelled')}
			width={60}
		>
			<Box flexDirection="column" gap={1}>
				<Text>Configure your Anthropic API credentials:</Text>

				<Box flexDirection="column" marginTop={1}>
					<Text bold>ANTHROPIC_AUTH_TOKEN:</Text>
					<Text dimColor>Enter your API token</Text>
					<Box marginTop={1}>
						<Text color="cyan">{authToken || '(not set)'}</Text>
					</Box>
				</Box>

				<Box flexDirection="column" marginTop={1}>
					<Text bold>ANTHROPIC_BASE_URL:</Text>
					<Text dimColor>API endpoint (default: https://api.acedata.cloud)</Text>
					<Box marginTop={1}>
						<Text color="cyan">{baseUrl}</Text>
					</Box>
				</Box>

				<Box marginTop={2}>
					<Text dimColor>
						Note: This is a simplified setup UI. To configure these values:
					</Text>
				</Box>

				<Box flexDirection="column" marginTop={1}>
					<Text>1. Edit ~/.claude/settings.json</Text>
					<Text>2. Add or update the "env" section:</Text>
					<Box marginLeft={2} marginTop={1}>
						<Text dimColor>
							{JSON.stringify({
								env: {
									ANTHROPIC_AUTH_TOKEN: '{your-token}',
									ANTHROPIC_BASE_URL: 'https://api.acedata.cloud'
								}
							}, null, 2)}
						</Text>
					</Box>
					<Text marginTop={1}>3. Restart the CLI</Text>
				</Box>

				<Box marginTop={2}>
					<Text dimColor>Press Esc to close</Text>
				</Box>
			</Box>
		</Dialog>
	);
}
