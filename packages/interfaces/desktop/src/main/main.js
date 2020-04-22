import 'core-js/stable'
import 'regenerator-runtime/runtime'

import path from 'path'

import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  globalShortcut,
  ipcMain,
} from 'electron'

import * as db from './services/db'
import modules, { init } from './actions'
import logger from './utils/logger'

db.init().then(init)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// app.dock.hide()
// Menu.setApplicationMenu(false)

let tray = null

let spotlight = null

const close = () => {
  if (spotlight) {
    spotlight.hide()
  }
}

const toggle = () => {
  if (spotlight && spotlight.isVisible()) {
    close()
  } else {
    openSpotlight()
  }
}

const byPriority = (a, b) => a.priority - b.priority

const height = 58
const width = 670

const openSpotlight = () => {
  if (spotlight) {
    spotlight.show()
    return
  }
  spotlight = new BrowserWindow({
    width,
    maxWidth: width,
    minWidth: width,
    height,
    minHeight: height,
    // maxHeight: height,
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    backgroundColor: '#2d3135',
    // resizable: false,
    // alwaysOnTop: true,
    skipTaskbar: false,
  })
  spotlight.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  spotlight.on('blur', close)
}

const changeSpotlightSize = big => {
  logger.info({ big })
  if (big) {
    spotlight.setMinimumSize(width, 400)
    spotlight.setSize(width, 400, true)
  } else {
    spotlight.setMinimumSize(width, height)
    spotlight.setSize(width, height, true)
  }
}

const keep = async (event, query) => {
  const actions =
    query.length < 1
      ? []
      : (await Promise.all(
          Object.values(modules).map(m => m.getAvailableActions(query))
        ))
          .reduce((acc, a) => [...acc, ...a], [])
          .sort(byPriority)

  event.reply('actions', actions)
  changeSpotlightSize(actions.length > 0)
}

let clear = () => {}

ipcMain.on('query-change', async (event, { query }) => {
  clear = () => event.reply('query-clear')
  await keep(event, query)
})

ipcMain.on('query-execute', (event, { query, action }) => {
  modules[action.section] &&
    modules[action.section].executionAction({
      action,
      query,
      close,
      clear,
      keep: () => keep(event, query),
    })
})

ipcMain.on('get-data', async (event, { action, request }) => {
  if (
    modules[action.section] &&
    typeof modules[action.section].getData === 'function'
  ) {
    const data = await modules[action.section].getData({ action, request })
    event.reply('set-data', { action, data })
  }
})

ipcMain.on('close', (event, { query }) => {
  close()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../assets/iconTemplate.png'))

  const openSpotlightItem = new MenuItem({
    label: 'Open Spotlight',
    click: openSpotlight,
  })

  const quitItem = new MenuItem({
    label: 'Quit Assistant-OS',
    click: () => app.quit(),
  })

  const contextMenu = Menu.buildFromTemplate([openSpotlightItem, quitItem])
  tray.setToolTip('Assistant-OS')
  tray.setContextMenu(contextMenu)

  const ret = globalShortcut.register('Ctrl+Space', toggle)

  openSpotlight()
  close()

  if (!ret) {
    console.log('enregistrement échoué')
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('will-quit', () => globalShortcut.unregisterAll())

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (BrowserWindow.getAllWindows().length === 0) {
  //   createWindow()
  // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
