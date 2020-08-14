require("dotenv").config();
const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: "rsmq"} );
const mongoose = require('mongoose');
const queuename = process.env.QUEUE_NAME;

const TinyUrl = require("./models/tinyurl");

// Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("bravo database connected ........");
    
    setInterval(() => {
        rsmq.popMessage({ qname: queuename }, function (err, resp) {
            if (err) {
                console.error(err)
                return
            }
         
            if (resp.id) {
                let updateID = resp.message;
                console.log(resp.message);
                incrementClickCount(updateID);
            }
        });
    }, 500);
})

rsmq.createQueue({ qname: queuename }, function (err, resp) {});

// TODO: Handle Error
var incrementClickCount = (updateID) => {
    TinyUrl.findOneAndUpdate(
        { _id: updateID },
        { $inc: {'count': 1 } },
        {new: true },
        (err, res) => {

        }
    )
}