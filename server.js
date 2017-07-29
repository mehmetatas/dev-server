var fs = require('fs');
var restify = require('restify');

// rest methods

function insert(req, res, next) {
    try {
        var type = req.params.__type;

        if (!type) {
            res.send(400);
            next();
            return;
        }
		
        var data = req.body;
        data.id = new Date().getTime() + '';

        var arr = getType(type);
        arr.push(data);

        save();

        res.header('X-Id', data.id);
        res.send(201);
    }
    catch (ex) {
        console.log(ex);
        res.send(500);
    }

    next();
}

function search(req, res, next) {
    try {
        var type = req.params.__type;

        if (!type) {
            res.send(400);
            next();
            return;
        }

        var arr = getType(type);
        var result = [];

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];

            var match = true;

            for (var prop in req.params) {
                if (prop === "__type") {
                    continue;
                }

                if (item[prop] != req.params[prop]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                result.push(item);
            }
        }

        res.json(200, result);
    }
    catch (ex) {
        console.log(ex);
        res.send(500);
    }

    next();
}

function update(req, res, next) {
    try {
        var type = req.params.__type;
        var id = req.params.id;

        if (!type || !id) {
            res.send(400);
            next();
            return;
        }

        var arr = getType(type);
        var found = false;

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr[i] = req.body;
                arr[i].id = id;
                found = true;
                break;
            }
        }

        if (found) {
            save();
            res.send(204);
        } else {
            res.send(404);
        }
    }
    catch (ex) {
        console.log(ex);
        res.send(500);
    }

    next();
}

function remove(req, res, next) {
    try {
        var type = req.params.__type;
        var id = req.params.id;

        if (!type || !id) {
            res.send(400);
            next();
            return;
        }

        var arr = getType(type);
        var found = false;

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr.splice(i ,1);
                found = true;
                break;
            }
        }

        if (found) {
            save();
            res.send(204);
        } else {
            res.send(404);
        }
    }
    catch (ex) {
        console.log(ex);
        res.send(500);
    }

    next();
}

// server

var server = restify.createServer();

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());

server.post('/:__type', insert);
server.get('/:__type', search);
server.put('/:__type/:id', update);
server.del('/:__type/:id', remove);

server.listen(8080, function () {
    console.log('server listening at http://localhost:' + server.address().port);
});

// db things

var db = {};

function getType(type) {
    if (!db[type]) {
        db[type] = [];
    }
    return db[type];
}

function save() {
    fs.writeFile('data.json', JSON.stringify(db), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

fs.readFile('data.json', function (err, content) {
    if (!err) {
        try {
            db = JSON.parse(content);
        } catch (ex) { }
    }
});