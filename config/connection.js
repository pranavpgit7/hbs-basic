const MongoClient = require('mongodb-legacy').MongoClient;
const state = {
    db:null
}

module.exports.connect = (done)=>{
    const url = "mongodb://127.0.0.1:27017";
    const dbname = "shoppee";

    MongoClient.connect(url, (err,data)=>{
        if(err) return console.log(err)
        state.db=data.db(dbname);
        done();
    })
}

module.exports.get=()=> state.db;   



