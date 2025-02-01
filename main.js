const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true, // Erlaubt Zugriff auf Node.js im Renderer-Prozess
        },
    });

    mainWindow.loadURL("http://localhost:3000"); // Lädt das React-Frontend
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
