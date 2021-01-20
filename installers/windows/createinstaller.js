const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    })

function getInstallerConfig() {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'release-builds')

    return Promise.resolve({
        appDirectory: path.join(outPath, 'treggo-portal-win32-x64/'),
        authors: 'Siddhant Gupta',
        noMsi: false,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'treggo-portal.exe',
        setupExe: 'TreggoPortalInstaller.exe',
        description: 'An online technical restaurant portal',
        setupIcon: path.join(rootPath, 'build', 'icon.ico')
    })
}