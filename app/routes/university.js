var express = require('express');
var router = express.Router();
var mysql = require("mysql");

var pool = mysql.createPool({
host : 'localhost',
user : 'root',
password : '123456',
database: "pear"
});



router.get('/university', function(req, res) {

  res.render('university',{
    pageTitle: 'University',
    pageID: 'university'
  });

});

router.post('/university/search', function(req, res){
  var universityName = req.body.university;
  var webSiteId = req.body.website;
  var programName = req.body.program;


  pool.getConnection(function(err, connection){


   connection.query("SELECT s.schoolName, r.ranking, w.websiteName, r.year, p.programName FROM ((pear.ranking r left join pear.school s on r.schoolId = s.schoolId) left join pear.website w on r.websiteId = w.websiteId) left join pear.program p on r.programId = p.programId where s.schoolName like ? order by w.websiteName,r.ranking"
  ,['%' + universityName + '%'],function (error, rows, fields) {

   console.log('Database connect');

   var obj = {
     "Program": ""
   };

   obj["Program"] = rows;
   var rankdata = obj.Program;

   if( JSON.stringify(rankdata) == "[]" ){
     console.log("empty");
     res.render('emptydata',{
       pageTitle: 'University',
       pageID: 'University'
     });
   }else{
     res.render('university',{
        rankinfo: rankdata,
        pageID: 'universitysearch',
        pageTitle: 'University'
      });
   }

   });
   });

});

router.post('/university/specific', function(req, res){
  var universityName = req.body.university;
  var webSiteId = req.body.website;
  var programName = req.body.program;
  var year = req.body.year;


  pool.getConnection(function(err, connection){


   connection.query("SELECT s.schoolName, p.programName, r.ranking, r.year FROM (pear.ranking r join pear.school s on r.schoolId = s.schoolId) join pear.program p on r.programId = p.programId where year = ? and programName = ? and webSiteId = ? and schoolName like ? order by p.programName"
  ,[year,programName,webSiteId,'%' + universityName + '%'],function (error, rows, fields) {

   console.log('Database connect');

   var obj = {
     "Program": ""
   };

   obj["Program"] = rows;
   var rankdata = obj.Program;


   if( JSON.stringify(rankdata) == "[]" ){
     console.log("empty");
     res.render('emptydata',{
       pageTitle: 'University',
       pageID: 'University'
     });
   }else{
     res.render('university',{
        rankinfo: rankdata,
        pageID: 'universitysearch',
        pageTitle: 'University'
      });
   }

   });
   });

});


module.exports = router;
