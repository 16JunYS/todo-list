var express = require('express');
var fs = require('fs');

//var router = express.Router();
exports.list = function(req,res) {
    var exists = fs.existsSync('./todo_list.json');
    if (exists) {
        console.log('read from json file');
        
        fs.readFile('./todo_list.json', 
        {'encoding' : 'utf-8'}, 
        function(err, list) {
            res.json(list);
        });
    }
    else {
        console.log('create json file');
        
        var list = {
            'list': []            
        }; 
        fs.writeFile('./todo_list.json', JSON.stringify(list), function(error) {
            res.json(list);
        });
    }
};

exports.add = function(req,res) {
    var todo = {
        'contents': '',
        'complete': false
    };

    todo.contents = req.body.contents;
    console.log(todo.contents);
    fs.readFile('./todo_list.json', 
    {'enconding' : 'utf-8'}, function(err, data) 
    {
        if (err) throw err;
        data = JSON.parse(data);
        data.list.push(todo);
        fs.writeFile('./todo_list.json', JSON.stringify(data), function(err)
        {
            res.json(true);
        });
        
    });
};

exports.complete = function(req, res) {
    fs.readFile('./todo_list.json', {'encoding' : 'utf-8'},
    function(err, data) {
        data = JSON.parse(data);
        data.list[req.body.index].complete = true;
        fs.writeFile('./todo_list.json', JSON.stringify(data), function(err)
        {
            res.json(true);
        });
    });
};

exports.delete = function(req, res) {
    fs.readFile('./todo_list.json', {'encoding' : 'utf-8'},
    function(err, data) {
        data = JSON.parse(data);

        data.list[req.body.index] = null; // 선택한 항목 삭제
        data.list = data.list.filter(Boolean);

        fs.writeFile('./todo_list.json', JSON.stringify(data), function(err)
        {
            res.json(true);
        });
    });
}

exports.edit = function(req,res) {
    fs.readFile('./todo_list.json', {'encoding' : 'utf-8'},
    function(err, data) {
        data = JSON.parse(data);
        console.log('data: '+data.list[req.body.idx].contents)
        data.list[req.body.idx].contents = req.body.updated_todo
        console.log('data: '+data.list[req.body.idx].contents)

        fs.writeFile('./todo_list.json', JSON.stringify(data), function(err){
            res.json(true);
        })
    })
};
//module.exports = router;