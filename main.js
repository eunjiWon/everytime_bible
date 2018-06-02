// Modules to control application life and create native browser window
const electron = require('electron');
const url = require('url');
const path = require('path');
const storage = require('electron-json-storage');
const notify = require('electron-main-notification');
const Notification = require('electron-native-notification');

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

  //get_bible();
  //set_interval();

});

  function get_bible( interval ){

   storage.setDataPath("/Users/gb/new_electron/electron-quick-start");
    
    const dataPath = storage.getDataPath();
    console.log(new Date());
    console.log('interval' + interval);
  
    storage.get('bible_verses',function(error, data) {
      if (error) throw error;

      var random = Math.floor(Math.random()*3) + 1; // 1~4까지 난수
      random_string = random.toString();
    
      //notify(data[random_string].name, { body: data[random_string].body }, () => {});
      var time_sum = 4000;
      while(1){

        show_notification(data,()=>{
          time_sum +=4000;
          console.log("dd");
        });
        
        

        if(time_sum > interval) break;

      }
      // var buttons = ['OK', 'Cancel'];
      // dialog.showMessageBox({ type: 'info', buttons: buttons, message: data[random_string].body }, function (buttonIndex) {
      //   console.log(buttonIndex);
      //   //updateFooter("Exit: " + buttons[buttonIndex]);
      // });
      
    });

  }
function show_notification(data){
  var notification = new Notification(data[random_string].name, { body: data[random_string].body});
  setTimeout(notification.close.bind(notification), 4000);
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

  //setInterval(()=>get_bible(), 10000);

}

  ipcMain.on('setting', function(e, data){
    preferencesWindow.webContents.send('setting', data[1]);
    //data[1] : interval 
    //data[2] : duration
    console.log(data[1]);
    preferencesWindow.close();

    if(data[1] == 'one'){
      console.log('1시간간격실행');
      setInterval(()=>get_bible(), 600000);
    }
      
    else if(data[1] == 'two'){
      console.log('2시간간격실행');
      setInterval(()=>get_bible(20000), 20000);
    }
    else if(data[1] == 'three'){
      console.log('3시간간격실행');
      setInterval(()=>get_bible(), 10000);
    }
    else if(data[1] == 'four'){
      console.log('4시간간격실행');
      setInterval(()=>get_bible(), 12000);
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




