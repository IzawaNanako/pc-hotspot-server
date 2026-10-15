import { execFile } from 'node:child_process';
import { createHash, timingSafeEqual } from 'node:crypto';
import express from 'express';

try {
	process.loadEnvFile();
} catch {}

const { HOTSPOT_TOKEN } = process.env;

if (!HOTSPOT_TOKEN || HOTSPOT_TOKEN.length < 16) {
	console.error('HOTSPOT_TOKEN must be set to at least 16 characters. See .env.example.');
	process.exit(1);
}

const app = express();
const PORT = 3000;
const TIMEOUT_MS = 15_000;

const psCommand = '$connectionProfile = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]::GetInternetConnectionProfile(); $tetheringManager = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]::CreateFromConnectionProfile($connectionProfile); $tetheringManager.StartTetheringAsync();';

const sha256 = (value: string) => createHash('sha256').update(value).digest();
const expectedDigest = sha256(HOTSPOT_TOKEN);
const isValidToken = (candidate: unknown) => typeof candidate === 'string' && timingSafeEqual(sha256(candidate), expectedDigest);

let isRunning = false;

app.disable('x-powered-by');

app.get('/wake', (req, res) => {
	const { token } = req.query;

	if (!isValidToken(token)) {
		console.warn(`Rejected request from ${req.ip}`);
		res.sendStatus(401);
		return;
	}

	if (isRunning) {
		res.status(429).send('Already working on it!');
		return;
	}

	console.log('Phone signal received!');

	res.send('Hotspot is waking up!');

	isRunning = true;

	execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCommand], {
		timeout: TIMEOUT_MS,
	}, (error) => {
		isRunning = false;

		if (error) {
			console.error('Oops!', error);
		}
	});
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Application is listening on port ${PORT}!`);
});
