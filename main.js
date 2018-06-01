// Modules to control application life and create native browser window
const electron = require('electron');
const url = require('url');
const path = require('path');
const storage = require('electron-json-storage');
const os = require('os');

const {app, BrowserWindow,Menu, ipcMain, Notification, window} = electron;
 
let mainWindow;
let preferencesWindow;
let myNotification;

app.on('ready',  createPreferencesWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {

  //timer가 시간재서
  //push notification해주는거
});

// function createWindow () {
 
//   mainWindow = new BrowserWindow({});

//   mainWindow.loadFile('index.html')

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()
//   mainWindow.on('closed', function () {
//     mainWindow = null;
//     app.quit();
//   })
//   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
//   Menu.setApplicationMenu(mainMenu);

//   // myNotification.show();
//   //여기에 duration시간은 어떻게 줄것인지
//   //interval은 ??
//   // 어떻게 사용자가 끄지 못하도록 할 것인지
  
//   get_bible();
//   push_bible(selected_verse);//왜 바디가 안나오지??
//   //set_interval();
// };

  function push_bible(selected_verse) {

    var notification = new Notification('bible', {
      title: "dddd",
      body: selected_verse,
    });

    notification.show();
    console.log("selected"+selected_verse);

    //이걸로는 한 5초?? 이상 안 머문다. 그 이상이 안됨
    setTimeout(notification.close.bind(notification), 600000); 
  }

  //시간간격설정하는거 하고싶은데,
  // 아직 잘 안댐~~
  // function set_interval(){

  //   var i = 0;
  //   // Using an interval cause some browsers (including Firefox) are blocking notifications if there are too much in a certain time.
  //   var interval = window.setInterval(function () {
  //     // Thanks to the tag, we should only see the "Hi! 9" notification 
  //     var n = new Notification("Hi! " + i, {tag: 'soManyNotification'});
  //     if (i++ == 9) {
  //       window.clearInterval(interval);
  //     }
  //   }, 200);

  // }

  function get_bible(){

    //var verse = {};
    var verse1;
    storage.setDataPath("/Users/gb/new_electron/electron-quick-start");
    
    const dataPath = storage.getDataPath();
    console.log(dataPath);
  
    storage.get('bible_verses',function(error, data) {
      if (error) throw error;
       verse1 = data.verse1;
    });

    return verse1;
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

  //selected_verse = get_bible();
  //push_bible(selected_verse);//왜 바디가 안나오지??

  push_bible(get_bible());

  var cbExample = function(number, cb) {
    setTimeout(function() {
      var sum = 0;
      for (var i = number; i > 0; i--) {
        sum += i;
      }
      cb(sum);
    }, 0);
  };
  push_bible(10, function(result) {
    console.log(result);
  }); // 55
  console.log('first');


}


  ipcMain.on('setting', function(e, data){
    //mainWindow.webContents.send('duration', duration);
    console.log(data);
    preferencesWindow.close();
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

//if mac, add empty object to munu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

//Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label:'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role:'reload'
      }
    ]
  });
}




