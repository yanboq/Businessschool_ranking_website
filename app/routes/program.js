var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var pool = mysql.createPool({
host : 'localhost',
user : 'root',
password : '123456',
database: "pear"
});

router.get('/program/:id', function (req, res) {
  pool.getConnection(function(err, connection){

    var programName = req.params.id;
    console.log(programName);

    connection.query("select ranking, schoolName, programName, year from school, ranking, program where school.schoolId = ranking.schoolId and ranking.programId = ( select programId from program where programName = ?) and ranking.year = '2016' and websiteId = '1' and program.programName = ? order by ranking", [programName,programName],function (error, rows, fields) {

      var dic = {
        "Program": ""
      };

      dic["Program"] = rows;
      var rankdata = dic.Program;


    res.render('program',{
       rankinfo: rankdata,
       pageID: programName,
       pageTitle: 'Program'
     });

          console.log('Database connect');
    });
    });
});

router.post('/program/:id/search', function(req, res){

  var programName = req.params.id;
  var webSiteId = req.body.database;
  var year = req.body.year;

  pool.getConnection(function(err, connection){


  connection.query("SELECT s.schoolName, p.programName, r.ranking, r.year FROM (pear.ranking r left join pear.school s on r.schoolId = s.schoolId) left join pear.program p on r.programId = p.programId where year = ? and programName = ? and webSiteId = ? order by r.ranking"
, [year,programName,webSiteId],function (error, rows, fields) {

  console.log('Database connect');

  var obj = {
    "Program": ""
  };

  obj["Program"] = rows;
  var rankdata = obj.Program;

  if( JSON.stringify(rankdata) == "[]" ){
    console.log("empty");
    res.render('emptydata',{
      pageTitle: 'Program',
      pageID: programName
    });
  }else{
    res.render('program',{
       rankinfo: rankdata,
       pageID: programName,
       pageTitle: 'Program'
     });
  }

  });
  });
});




module.exports = router;
