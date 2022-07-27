import { track } from "../models/track";
import { album } from "../models/album";
import { artist } from "../models/artist";

import * as mysql from "mysql";
import * as util from "util";

class MusicDao {

    private host:string = "";
    private port:number = 3306;
    private username:string = "";
    private password:string = "";
    private schema:string = "MUSIC";
    private pool = this.initDbConnection();

    constructor(host:string, port:number, username:string, password:string)
    {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    public findArtists(callback: any){
        let artists:artist[] = [];

        this.pool.getConnection(function(err:any, connection:any){
            if (err) throw err

            connection.query("SELECT DISTINCT ARTIST FROM ALBUM", function (err:any, rows:any, fields:any){
                connection.release();
                if (err) throw err

                for(let x=0; x< rows.length; x++){
                    artists.push(new artist(x, rows[x].ARTIST));
                }

                callback(artist);
            });
        });
    }
 
     public findAlbums(artist:string, callback: any)
     {
          let albums:album[] = [];
  
         this.pool.getConnection(async function(err:any, connection:any)
         {
             connection.release();
 
             if (err) throw err;
 
             connection.query = util.promisify(connection.query);
             let result1 = await connection.query('SELECT * FROM ALBUM WHERE ARTIST=? ORDER BY TITLE', [artist]);
             for(let x=0;x < result1.length;++x)
             {
                 let albumId = result1[x].ID;
                 let tracks:track[] = [];
                 let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                 for(let y=0;y < result2.length;++y)
                 {
                     tracks.push(new track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS));
                 }
 
                 albums.push(new album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, tracks)); 
             }
 
             callback(albums);
          });
     }            
 
     public findAllAlbums(callback: any)
     {
          let albums:album[] = [];
  
         this.pool.getConnection(async function(err:any, connection:any)
         {
             connection.release();
 
             if (err) throw err;
 
             connection.query = util.promisify(connection.query);
             let result1 = await connection.query('SELECT * FROM ALBUM ORDER BY TITLE');
             for(let x=0;x < result1.length;++x)
             {
                 let albumId = result1[x].ID;
                 let tracks:track[] = [];
                 let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                 for(let y=0;y < result2.length;++y)
                 {
                     tracks.push(new track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS));
                 }
 
                 albums.push(new album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, tracks)); 
             }
 
             callback(albums);
          });
     }
 
     public findAlbumsByArtist(search:string, callback: any)
     {
          let albums:album[] = [];
   
         this.pool.getConnection(async function(err:any, connection:any)
         {
             connection.release();
 
             if (err) throw err;
 
             connection.query = util.promisify(connection.query);
             let result1 = await connection.query("SELECT * FROM ALBUM WHERE ARTIST LIKE ? ORDER BY TITLE", ['%' + search + '%']);
             for(let x=0;x < result1.length;++x)
             {
                 let albumId = result1[x].ID;
                 let tracks:track[] = [];
                 let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                 for(let y=0;y < result2.length;++y)
                 {
                     tracks.push(new track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS));
                 }
 
                 albums.push(new album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, tracks)); 
             }
 
             callback(albums);
          });
     }            
 
     public findAlbumsByDescription(search:string, callback: any)
     {
          let albums:album[] = [];
   
         this.pool.getConnection(async function(err:any, connection:any)
         {
             connection.release();
 
             if (err) throw err;
 
             connection.query = util.promisify(connection.query);
             let result1 = await connection.query("SELECT * FROM ALBUM WHERE DESCRIPTION LIKE ? ORDER BY TITLE", ['%' + search + '%']);
             for(let x=0;x < result1.length;++x)
             {
                 let albumId = result1[x].ID;
                 let tracks:track[] = [];
                 let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                 for(let y=0;y < result2.length;++y)
                 {
                     tracks.push(new track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS));
                 }
 
                 albums.push(new album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, tracks)); 
             }
 
             callback(albums);
          });
     }            
 
     public findAlbum(albumId:number, callback: any)
     { 
         this.pool.getConnection(async function(err:any, connection:any)
         {
             connection.release();
 
             if (err) throw err;
 
             connection.query = util.promisify(connection.query);
             let result1 = await connection.query('SELECT * FROM ALBUM WHERE ID=?', [albumId]);
             if(result1.length != 1)
                 callback(null);
 
             let tracks:track[] = [];
             let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
             for(let y=0;y < result2.length;++y)
             {
                 tracks.push(new track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS));
             }
 
             let Album = new album(result1[0].ID, result1[0].TITLE, result1[0].ARTIST, tracks); 
 
             callback(album);
          });
     }
 
    public create(album:album, callback: any)
    { 
        this.pool.getConnection(async function(err:any, connection:any)
        {
            connection.release();

            if (err) throw err;

            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('INSERT INTO ALBUM (TITLE, ARTIST) VALUES(?,?)', [album.Title, album.Artist]);
            if(result1.affectedRows != 1)
            callback(-1);

            let albumId = result1.insertId;
            for(let y=0;y < album.Tracks.length;++y)
            {
                let result2 = await connection.query('INSERT INTO TRACK (ALBUM_ID, TITLE, NUMBER) VALUES(?,?,?)', [albumId, album.Tracks[y].Title, album.Tracks[y].Number]);
            }

            callback(albumId);
        });
    }
 
    public update(album:album, callback: any)
    {  
          this.pool.getConnection(async function(err:any, connection:any)
          {
            connection.release();
  
            if (err) throw err;
  
            let changes = 0;
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('UPDATE ALBUM SET TITLE=?, ARTIST=? WHERE ID=?', [album.Title, album.Artist, album.Id]);
            if(result1.changedRows != 0)
                 ++changes;
 
            for(let y=0;y < album.Tracks.length;++y)
            {
                let result2 = await connection.query('UPDATE TRACK SET TITLE=?, NUMBER=? WHERE ID=? AND ALBUM_ID=?', [album.Tracks[y].Title, album.Tracks[y].Number, album.Tracks[y].Id, album.Id]);
                if(result2.changedRows != 0)
                    ++changes;
            }
             
            callback(changes);
        });
    }
 
    
    public delete(albumId:number, callback: any)
    {  
        this.pool.getConnection(async function(err:any, connection:any)
        {
            connection.release();

        if (err) throw err;

            let changes = 0;
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('DELETE FROM TRACK WHERE ALBUM_ID=?', [albumId]);
            changes = changes + result1.affectedRows;

            let result2 = await connection.query('DELETE FROM ALBUM WHERE ID=?', [albumId]);
            changes = changes + result2.affectedRows;

            callback(changes);
        });
    }
    

    private initDbConnection():any {
        return mysql.createPool({host: this.host, port: this.port, user: this.username, password: this.password, database: this.schema, connectionLimit: 10});
    }
}