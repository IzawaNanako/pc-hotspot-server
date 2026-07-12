# PC Hotspot Server

A lightweight Node.js server that exposes an endpoint to remotely enable the Windows Mobile Hotspot via PowerShell.

## Description

A lightweight Express.js utility server designed to remotely trigger the Windows Mobile Hotspot. By exposing a local network endpoint that executes a PowerShell command, this tool allows you to wake up your PC's hotspot seamlessly from other devices. This project was developed as a custom solution tailored to the creator's own workflow.

## Primary Use Case

This project was built with local network automation in mind. A common workflow involves:

1. Connecting a mobile device to the PC's local network (e.g., via a VPN like Tailscale).
2. Scanning an NFC tag with the mobile device to send a GET request to this server's endpoint.
3. The server receives the request and executes the necessary Windows Runtime commands to turn on the PC's Mobile Hotspot.
4. A secondary automation (or the same NFC tag) connects the mobile device to the newly broadcasted Wi-Fi network.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Process Manager:** PM2

## Getting Started

### Prerequisites

To run this server, you will need:

- **Operating System:** Windows 10 or Windows 11
- **Hardware:** A Wi-Fi adapter with Mobile Hotspot capabilities enabled in Windows settings.
- **Environment:** [Node.js](https://nodejs.org/) (v16+ recommended)
- **Process Manager:** PM2 installed globally on your system.

  ```bash
  npm install -g pm2
  ```

- **Network:** Both the PC and the trigger device must be able to communicate over the network (e.g., same LAN, or a mesh VPN like Tailscale/Zerotier).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/IzawaNanako/pc-hotspot-server.git
   cd pc-hotspot-server
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

### Usage & Execution

Controlling the Windows network state requires Administrator privileges. The provided batch scripts are designed to automatically request elevation and manage the server as a background process.

#### Starting the Server

Run the `run.bat` file.

- The script will prompt for Administrator approval.
- Once approved, it will automatically compile the code and start the server in the background using PM2 under the name `hotspot-server`.

#### Stopping the Server

Run the `stop.bat` file.

- This will safely terminate the PM2 background process.

#### Triggering the Hotspot

Once the server is running, you can activate the PC's hotspot by sending a standard GET request to the `/wake` endpoint.

Replace `localhost` with your PC's local IP address or Tailscale IP if accessing from another device:

```text
http://localhost:3000/wake
```

Upon a successful request, the server will log the receipt and the Windows Mobile Hotspot will be initialized.

## License

This project is licensed under the GPL-3.0 License - see [LICENSE](/LICENSE) for details.
