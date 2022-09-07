const express = require("express");
const path = require("path");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

//configuração do handlebars
const handlebars	= require('express-handlebars');
app.engine('handlebars', handlebars.engine('main'));
app.set('view engine','handlebars') ;
app.set('views','./view');

//configuração de arquivos estaticos
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.render('home');
})
let pesOnline = []
io.on('connection',socket=>{
    socket.people = {
        name:'undefined', 
        id:socket.id,
        color:'#444',
        digit:false
    }
    pesOnline.push(socket.people);
    io.emit("atualizaConection",pesOnline);
    
    socket.on("atuaName",me=>{
        console.log("atualizar name para ",me)
        socket.people.name = me.name;
        socket.people.color = me.color;
        for(p of pesOnline){
            if(p.id == socket.id){
                p = socket;
            }
        }
        io.emit("atualizaConection",pesOnline);
    })



    socket.on("disconnect",()=>{
        console.log("desconected socket");
        let index;
        for(j of pesOnline){
            if(j.id == socket.id){
               index =  pesOnline.indexOf(j);
            }
        }
        pesOnline.splice(index, 1);
        io.emit("atualizaConection",pesOnline);
    })

    console.log("conectado");
});



server.listen(port,console.log("aperto e funcionando "))