import { app, Menu } from 'electron'

const template = [
    {
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            }
        ]
    }
]

function createMenu() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

export default createMenu
