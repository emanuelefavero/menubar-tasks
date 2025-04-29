# MenuBar Tasks

This is an Electron app for Mac OS that allows you to create, manage and display tasks directly in the menu bar. It is designed to be minimal, easy to use and lightweight

### Mockup

![mockup](./mockup.webp 'mockup')

## Features

- Create, edit and delete tasks directly from the menu bar
- Show the last task in the menu bar instead of the icon
- Minimal interface
- Lightweight and fast

## Installation

- Clone the repository and `cd` into the directory
- Run `npm install` to install the dependencies
- Run `npm start` to start the app
- Check your menu bar to see the app in action

## Build

- Run `npm run app:dir` to build the app in a directory without code signing (useful for testing)
- Run `npm run app:dist` to build the app for distribution (code signing is enabled)
- The app will be built in the `dist` directory

> Tip: Code signing takes a while, so I decided to disable it for the `app:dir` command. If you want to enable it, you can do so by setting `export CSC_IDENTITY_AUTO_DISCOVERY=true` in the `app:dir` command in `package.json`.

## Usage

- Click on the app icon in the menu bar to open the task list
- Click on a task to edit it
- Click on the "Add Task" button to create a new task
- Click on the "Delete" button in the task submenu to delete a task
- Click on the "Clear" button to clear all tasks
- Click on the "Quit" button to quit the app

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request. All contributions are welcome!

## Resources

- [Electron](https://www.electronjs.org/)
- [Electron Builder](https://www.electron.build/)
- [Electron Builder Code Signing](https://www.electron.build/code-signing-mac.html)
- [Electron Notarization](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)
- [Electron Forge (not used in this repo)](https://www.electronforge.io/)
- [Mac OS Categories](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)
- [Mac OS Figma Icon Template](https://www.figma.com/community/file/1203739127660048027)
- [TinyPNG](https://tinypng.com/)
- [PNG to ICNS Converter](https://cloudconvert.com/)

## License

- [MIT](LICENSE.md)

&nbsp;

&nbsp;

[**Go To Top &nbsp; ⬆️**](#menubar-tasks)
