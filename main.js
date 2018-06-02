// Modules to control application life and create native browser window
const electron = require('electron');
const url = require('url');
const path = require('path');
const storage = require('electron-json-storage');
// const notify = require('electron-main-notification');
// const Notification = require('electron-native-notification');
const dialog = require('electron').dialog;

const {app, BrowserWindow, Menu, ipcMain} = electron;
 
let preferencesWindow;

app.on('ready',  createPreferencesWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if(preferencesWindow ==null)
    createPreferencesWindow();
});

function get_bible(){ 
  storage.setDataPath("/Users/eunjiwon/Desktop/electron_dev");
  const dataPath = storage.getDataPath();
 
  storage.get('bible_verses',function(error, data) {
  if (error) throw error;
  var random = Math.floor(Math.random()*10) + 1; // 1~10까지 난수
  random_string = random.toString();

  var buttons = ['OK'];
    dialog.showMessageBox({ type: 'none', buttons: buttons, message: data[random_string].body + "\n[" + data[random_string].name+"]" }, function (buttonIndex) {
    console.log(buttonIndex);
    })  
  });
}

function createPreferencesWindow(){

  preferencesWindow = new BrowserWindow({
    width:300,
    height:200,
    title: 'Preferences'
  });

  preferencesWindow.loadFile('preferencesWindow.html')

  preferencesWindow.on('closed', function () {
    preferencesWindow = null;
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

}

  ipcMain.on('setting', function(e, data){
    preferencesWindow.webContents.send('setting', data[1]);
    //data[1] : interval 
    //data[2] : duration
    console.log(data[1]);
    preferencesWindow.close();

    if(data[1] == 'one'){
      console.log('1분 간격 실행');
      setInterval(()=>get_bible(), 60000);
    }
      
    else if(data[1] == 'two'){
      console.log('2분 간격 실행');
      setInterval(()=>get_bible(), 120000);
    }
    else if(data[1] == 'three'){
      console.log('3분 간격 실행');
      setInterval(()=>get_bible(), 180000);
    }
    else if(data[1] == 'four'){
      console.log('4분 간격 실행');
      setInterval(()=>get_bible(), 240000);
    }
      
  });

 
const mainMenuTemplate =[
  {
    label: 'Preferences',
    submenu:[
      {
        label: 'Preferences',
        click(){
          createPreferencesWindow();
        }
      },
      {
        label:'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}




