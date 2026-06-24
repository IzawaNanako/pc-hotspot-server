import express from 'express';
import { exec } from 'child_process';

const app = express();
const PORT = 3000;

const psCommand = `
Add-Type -AssemblyName System.Runtime.WindowsRuntime;
$connectionProfile = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]::GetInternetConnectionProfile();
$tetheringManager = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]::CreateFromConnectionProfile($connectionProfile);
$tetheringManager.StartTetheringAsync();
`;

app.get('/toggle', (req, res) => {
    console.log('Phone signal received!');
    
    exec(`powershell.exe -Command "${psCommand}"`, (error) => {
        if (error) {
            console.error('Oops!', error);
            return res.status(500).send('Failed to toggle hotspot.');
        }
        return res.send('Hotspot is waking up!');
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nanaz is listening on port ${PORT}!`);
});
