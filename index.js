const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

const port = process.env.PORT |

// Route du chat

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Route des logS

app.get('/logs', (req, res) => {
    const logFilePath = path.join(__dirname, 'chat_logs.json');
    fs.readFile(logFilePath, (err, data) => {
      if (err) {
        return res.status(500).send('404 Erreur logs');
      }
      try {
        const logs = JSON.parse(data);
        res.json(logs);
      } catch (e) {
        res.status(500).send('Impossible de lire les logs');
      }
    });
  });

  
// wEBSOCKET  

io.on('connection', (socket) => {    
    console.log('Un utilisateur s\'est connecté');
    socket.on('disconnect', () => {
      console.log('Un utilisateur s\'est déconnecté');
    });
    socket.on('chat message', (msg) => {
        console.log('message envoyé par : ' + msg.username + ' (' + msg.userId + ') : ' + msg.text + ' le ' + msg.timestamp);
        io.emit('chat message', msg);

// Logs de chat de chaque messages dans chat_logs.json

        const log = {
            id: msg.userId,
            name: msg.username,
            message: msg.text,
            date: new Date(msg.timestamp).toLocaleDateString(),
            heure: new Date(msg.timestamp).toLocaleTimeString()
        };

        const logFilePath = path.join(__dirname, 'chat_logs.json');
        fs.readFile(logFilePath, (err, data) => {
            let logs = [];
            if (!err) {
                logs = JSON.parse(data);
            }
            logs.push(log);
            fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
                if (err) throw err;
                console.log('Log enregistré dans le fichier [chat_logs.json]');
            });
        });
    });
});

// Port

http.listen(3001, () => {
    console.log('PORT : (500×6)+500 - 500 + 1 ');
});