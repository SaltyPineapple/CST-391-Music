import { track } from "./track";

export class album {
    private id: number = -1;
    private title: string = "";
    private artist: string = "";
    private tracks: track[] = [];

    constructor(id:number, title:string, artist:string, tracks:track[]){
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.tracks = tracks;
    }

    get Id():number
    {
        return this.id;
    }
    set Id(id:number)
    {
        this.id = id;
    }

    get Title():string
    {
        return this.title;
    }
    set Title(title:string)
    {
        this.title = title;
    }

    get Artist():string
    {
        return this.artist;
    }
    set Artist(artist:string)
    {
        this.artist = artist;
    }
    
    get Tracks():track[]
    {
        return this.tracks;
    }
    set Tracks(tracks:track[])
    {
        this.tracks = tracks;
    }
}