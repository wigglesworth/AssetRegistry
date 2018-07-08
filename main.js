// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const http = require('http').createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write('Hello World')
    res.end()
  }
).listen(8080)
const io = require('socket.io')(http)
const settings = require('./settings')
const dbHandler = require('./db/dbHandler')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null

      // When the program is closed, disconnect from the database.
      dbHandler.disconnect()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  //createMenu()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// MariaDB connection
dbHandler.connect(settings)

// Socket.IO connection handling
io.on('connection', function(socket) {
    console.log('A connection has been established.')


    // --- Here we will handle the database calls --- //
    // Request a list of all assets
    socket.on('requestAssets', function(data, callback) {
        console.log("Assets Requested")
        dbHandler.connection.query('SELECT * FROM locations WHERE SoftDelete = 0;', function(err, data) {
            if (err) return callback(err)
            return callback(null, data)
        })
    })
})