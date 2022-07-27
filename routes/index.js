// Application Dependencies
const { Album } = require('./lib/app/models/Album');
const { Track } = require('./lib/app/models/Track');
const { MusicDAO } = require('./lib/app/database/MusicDAO.js')
const bodyParser = require('body-parser')

var express = require('express');
var router = express.Router();
const port = 3000


// Database configuration
const dbHost = "localhost"
const dbPort = 8889;
const dbUsername = "root"
const dbPassword = "root"

// Set location of static resources and use the JSON body parser
app.use(express.static('app/images'))
app.use(bodyParser.json());

// CORS Middleware
app.use(function (req, res, next) {
  // Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET Route at Root '/' that returns a Test Text message
app.get('/', function (_req, res)
{
    // Return Test Text
    console.log('In GET / Route');
    res.send('This is the default root Route.');
})
// GET Route at '/artists' that returns all Artists from the database
app.get('/artists', function (_req, res)
{
    // Return Artists List as JSON, call MusicDAO.findArtists(), and return JSON array of Artists (a string)
    console.log('In GET /artists Route');
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findArtists(function(artists)
    {
        res.json(artists);
    });
})

// GET Route at '/albums' that returns all Albums from the database
app.get('/albums', function (req, res)
{
    // Return Albums List as JSON, call MusicDAO.findAllAlbums(), and return JSON array of Albums
    console.log('In GET /albums Route ');
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAllAlbums(function(albums)
    {
        res.json(albums);
    });
})

// GET Route at '/albums'/:artist that returns all Albums for an Artist from the database
app.get('/albums/:artist', function (req, res)
{
    // Return Albums List as JSON, call MusicDAO.findAlbums(), and return JSON array of Albums
    console.log('In GET /albums Route for ' + req.params.artist);
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbums(req.params.artist, function(albums)
    {
        res.json(albums);
    });
})

// GET Route at '/albums/search/artist/:search' that does a wildcard search for all Albums searching by Artist from the database
app.get('/albums/search/artist/:search', function (req, res)
{
    // Return Albums List as JSON, call MusicDAO.findAlbumsByArtist(), and return JSON array of Albums
    console.log('In GET /albums/searach/artist Route for ' + req.params.search);
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbumsByArtist(req.params.search, function(albums)
    {
        res.json(albums);
    });
})

// GET Route at '/albums/search/description/:search' that does a wildcard search for all Albums searching by Description from the database
app.get('/albums/search/description/:search', function (req, res)
{
    // Return Albums List as JSON, call MusicDAO.findAlbumsByDescription(), and return JSON array of Albums
    console.log('In GET /albums/searach/description Route for ' + req.params.search);
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbumsByDescription(req.params.search, function(albums)
    {
        res.json(albums);
    });
})

// GET Route at '/albums/:artist/:id' that returns an Album given an Album ID from the database
app.get('/albums/:artist/:id', function (req, res)
{
    // Get the Album
    console.log('In GET /albums Route with ID of ' + req.params.id);
    let albumId = Number(req.params.id);
 
    // Call MusicDAO.findAlbum() to find Album from the database and return the Album
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbum(albumId, function(album)
    {
        if(album == null)
            res.status(200).json({"error" : "Invalid Album ID"})
        else
            res.status(200).json(album)
    });
 })

// POST Route at '/albums' that adds an Album and its Tracks to the database
app.post('/albums', function (req, res)
{
    // If invalid POST Body then return 400 response else add Album and Tracks to the database
    console.log('In POST /albums Route with Post of ' + JSON.stringify(req.body));
    if(!req.body.title)
    {
        // Check for valid POST Body, note this should validate EVERY field of the POST
        res.status(400).json({error: "Invalid Album Posted"});
    }
    else
    {
        // Create an Album object model from Posted Data
        let tracks = [];
        for(let x=0;x < req.body.tracks.length;++x)
        {
            tracks.push(new Track(req.body.tracks[x].id, req.body.tracks[x].number, req.body.tracks[x].title, req.body.tracks[x].lyrics, req.body.tracks[x].video));
        }
        let album = new Album(-1, req.body.title, req.body.artist, req.body.description, req.body.year, req.body.image, tracks);

        // Call MusicDAO.create() to create an Album from Posted Data and return an OK response     
        let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
        dao.create(album, function(albumId)
        {
            if(albumId == -1)
                res.status(200).json({"error" : "Creating Album failed"})
            else
                res.status(200).json({"success" : "Creating Album passed with an Album ID of " + albumId});
        });     
      }
})

// PUT Route at '/albums' that updates an Album and its Tracks in the database
app.put('/albums', function (req, res)
{
    // If invalid PUT Body then return 400 response else update Album and Tracks to the database
    console.log('In PUT /albums Route with Post of ' + JSON.stringify(req.body));
    if(!req.body.title)
    {
        // Check for valid PUT Body, note this should validate EVERY field of the POST
        res.status(400).json({error: "Invalid Album Posted"});
    }
    else
    {
        // Create an Album object model from Posted Data
        let tracks = [];
        for(let x=0;x < req.body.tracks.length;++x)
        {
            tracks.push(new Track(req.body.tracks[x].id, req.body.tracks[x].number, req.body.tracks[x].title, req.body.tracks[x].lyrics, req.body.tracks[x].video));
        }
        let album = new Album(req.body.id, req.body.title, req.body.artist, req.body.description, req.body.year, req.body.image, tracks);

        // Call MusicDAO.update() to update an Album from Posted Data and return an OK response     
        let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
        dao.update(album, function(changes)
        {
            if(changes == 0)
                res.status(200).json({"error" : "Updating Album passed but nothing was changed"})
            else
                res.status(200).json({"success" : "Updating Album passed and data was changed"});
        });     
      }
})

// DELETE Route at '/albums/:artist/:id' that deletes an Album given an Album ID from the database
app.delete('/albums/:artist/:id', function (req, res)
{
    // Get the Album
    console.log('In DELETE /albums Route with ID of ' + req.params.id);
    let albumId = Number(req.params.id);
 
    // Call MusicDAO.delete() to delete an Album from the database and return if passed
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.delete(albumId, function(changes)
    {
        if(changes == 0)
            res.status(200).json({"error" : "Delete Album failed"})
        else
            res.status(200).json({"success" : "Delete Album passed"})
    });
 })

// Start the Server
app.listen(port, () => 
{
    console.log(`Example app listening on port ${port}!`);
});

