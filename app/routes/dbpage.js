var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var pool = mysql.createPool({
host : 'localhost',
user : 'root',
password : '123456',
database: "pear"
});

router.get('/database/:id', function (req, res) {
  pool.getConnection(function(err, connection){

    var webSiteName = req.params.id;
    console.log(webSiteName);

    connection.query("select ranking, schoolName, programName, year from school, ranking, program, website where school.schoolId = ranking.schoolId and ranking.programId = '1' and ranking.year = '2016' and ranking.websiteId = (select website.websiteId where website.websiteName = ?) and program.programName = 'mba' order by ranking", [webSiteName],function (error, rows, fields) {

      var dic = {
        "Program": ""
      };

      dic["Program"] = rows;
      var rankdata = dic.Program;


    res.render('dbpage',{
       rankinfo: rankdata,
       pageID: webSiteName,
       pageTitle: 'Program'
     });

          console.log('Database connect');
    });
    });
});

router.post('/database/:id/search', function(req, res){

  var webSiteName = req.params.id;
  var programName = req.body.programName;
  var year = req.body.year;

  pool.getConnection(function(err, connection){


  connection.query("SELECT s.schoolName, p.programName, r.ranking, r.year FROM (pear.ranking r left join pear.school s on r.schoolId = s.schoolId) left join pear.program p on r.programId = p.programId where year = ? and programName = ? and websiteId = (SELECT websiteId FROM website WHERE websiteName = ?) order by r.ranking", [year,programName,webSiteName],function (error, rows, fields) {

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
      pageID: webSiteName
    });
  }else{
    res.render('program',{
       rankinfo: rankdata,
       pageID: webSiteName,
       pageTitle: 'Program'
     });
  }

  });
  });
});




module.exports = router;
