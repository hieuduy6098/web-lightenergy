

var port = 8080;
var mqtt = require('mqtt')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('main.html', {root: __dirname});
});
//socket connect
io = io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });
});
//connect mqtt
var option = {
    port: 16959,
    host: 'mqtt://m16.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'lbtkifwk',
    password: 'b9u4zxPpiUDX',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client  = mqtt.connect('mqtt://m16.cloudmqtt.com',option)
client.on('connect', function() {
    console.log("connected mqtt");
    // client subcribe topic data
    client.subscribe("data");
});
client.on('message', function(topic, message) {
    var data = JSON.parse(message)
    if (data.type=="sensor") {
        io.emit("sensormes",data);
    } else if (data.type=="actuator") {
        io.emit("actuatormes",data);
    } else if (data.type=="history") {
        //console.log(data);
        //console.log(typeof(data));
        if (data.id=="I_in") {
            //console.log(data.data.length);
            let angrychartdata= [] ;
            data.data.forEach(element => {
                let chartdata = {
                    date: element.t,
                    I_in: element.v,
                };
                angrychartdata.push(chartdata);
            });
            console.log(angrychartdata);
            io.emit("historymesIin",angrychartdata);
        } else if (data.id=="I_out") {
            //console.log(data.data.length);
            let angrychartdata= [] ;
            data.data.forEach(element => {
                let chartdata = {
                    date: element.t,
                    I_out: element.v,
                };
                angrychartdata.push(chartdata);
            });
            console.log(angrychartdata);
            io.emit("historymesIout",angrychartdata);
        } else if (data.id=="U_in") {
            //console.log(data.data.length);
            let angrychartdata= [] ;
            data.data.forEach(element => {
                let chartdata = {
                    date: element.t,
                    U_in: element.v,
                };
                angrychartdata.push(chartdata);
            });
            console.log(angrychartdata);
            io.emit("historymesUin",angrychartdata);
        } else if (data.id=="U_out") {
            //console.log(data.data.length);
            let angrychartdata= [] ;
            data.data.forEach(element => {
                let chartdata = {
                    date: element.t,
                    U_out: element.v,
                };
                angrychartdata.push(chartdata);
            });
            console.log(angrychartdata);
            io.emit("historymesUout",angrychartdata);
        } else {

        };
    };
});

http.listen(port, function(){
    console.log("Running on port " + port)
});
