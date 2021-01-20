const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const url = require("url");
const setupEvents = require('./installers/setupEvents')


let win;

if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function createWindow() {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        webPreferences: {
            webSecurity: false
        },
        width: 1024,
        height: 768,
        icon: path.join(__dirname, `/build/icon.ico`)
    });
    // win.maximize();
    win.setMenuBarVisibility(false);

    // load the dist folder from Angular
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );



    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()

    win.on("closed", () => {
        win = null;
    });

    // win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });

}

app.on("ready", createWindow);


// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// initialize the app's main window
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});