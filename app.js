const mongoose = require('mongoose')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const session = require("express-session")
const MongoStore = require("connect-mongo")

const PORT = process.env.PORT || 3000
const mongoURI = process.env.mongoURI || 'mongodb://localhost:27017/interchat'

app.use(express.json())
app.use(express.urlencoded({
    extended:false
}))

mongoose.connect(mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.set('useCreateIndex', true) // to remove (node:8172) Deprecation

db = mongoose.connection
db.on('error', console.error.bind("Database connection error"))
db.once('open', () => {
	console.log("Database connected")
})

app.set('view engine','ejs')

const path=__dirname+'/views/'

app.use(express.static(path)) 

app.set('views','views')

app.use(session({
	secret:'5^$#8gsssstg(2esff-)87',
	resave:true,                // it updates the database session each time we visit the page
	rolling:true,				// it updates the cookie maxAge each time we visit the page
	saveUninitialized:false,
	store:MongoStore.create({
		mongoUrl:mongoURI
	}),
	cookie:{
		maxAge: 1000*60*60*24*365  // 1year Days
	}
}))

const message = require('./models/message.schema')

io.on('connection', (socket) => {
    socket.on('join', function (data) {
      socket.join(data.id); // We are using room of socket io  
      
      socket.on('chat message', (msg) => {
        var newMessage = new message(msg)

        newMessage.save((err,d)=>{
          if(err) throw err
        })

        var count = io.sockets.adapter.rooms.get(data.id).size;
        io.in(data.id).emit('chat message', {data : msg,count:count})
      });
    });
  
    socket.on('leave',(data)=>{
      socket.leave(data.id);
    }) 
})

require('./router/routes')(app)

app.get('*',(req,res)=>{
  res.redirect('/')
})

server.listen(PORT,()=>{
    console.log('Node working')
})







