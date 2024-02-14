const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { electron } = require("process");
const ipc = ipcMain;

function createWindow() {
	const win = new BrowserWindow({
		minWidth: 1080,
		minHeight: 700,
		webPreferences: {
			// production config
			// preload: path.join(__dirname, "preload.js"),
			devTools: isDev,
			nodeIntegration: true,
			contextIsolation: false,
			// devTools: true,
		},
		icon: __dirname + "/icons/favicon.ico",
		frame: false,
		center: true,
	});

	// and load the index.html of the app.
	// win.loadFile("index.html");

	win.maximize();
	win.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	// Open the DevTools.
	if (isDev) {
		win.webContents.openDevTools({ mode: "detach" });
	}

	win.webContents.setWindowOpenHandler((event, url) => {
		event.preventDefault();
		win.loadURL(url);
	});

	ipc.on("closeApp", () => {
		win.close();
		console.log("close btn");
	});
	ipc.on("minApp", () => {
		win.minimize();
	});

	ipc.on("maxRestoreApp", () => {
		if (win.isMaximized()) {
			win.restore();
		} else {
			win.maximize();
		}
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
