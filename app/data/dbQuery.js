
var mysql = require("mysql");



var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : '123456',
database: "google"
});


var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {

   getAllUniversity: function (req, res, next) {
        connection.connect();
        connection.query('SELECT * FROM goole_news;', function(err, result) {
                jsonWrite(res, result);
            });
    }

};
