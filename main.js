"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
// const contextMenu = require("electron-context-menu");
const config = require("./config");
// const menu = require("./menu");

unhandled();
debug();
// contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.company.AppName");

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 1200,
		height: 500,
		webPreferences: {
			nodeIntegration: true,
		},
		// frame: false,
	});

	win.on("ready-to-show", () => {
		win.show();
	});

	win.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, "index.html"));

	return win;
};
function musicPlayer() {
	const player = new BrowserWindow({
		// frame: false,
		width: 366,
		height: 650,
		parent: mainWindow,
		webPreferences: {
			devTools: false,
			nodeIntegration: true,
		},
	});

	player.setMenu(null);
	player.loadFile(path.join(__dirname, "./modules/music/src/index.html"));
}
// const { ipcMain } = require("electron");

ipcMain.on("OPEN-MUSIC-PLAYER", () => {
	musicPlayer();
});
// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(null);
	mainWindow = await createMainWindow();
})();
