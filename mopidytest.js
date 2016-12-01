var get = function (key, object) {
    return object[key];
};

var printTypeAndName = function (model) {
    console.log(model.__model__ + ": " + model.name);
    // By returning the playlist, this function can be inserted
    // anywhere a model with a name is piped in the chain.
    return model;
};

var trackDesc = function (track) {
    return track.name + " by " + track.artists[0].name +
        " from " + track.album.name;
};

var printNowPlaying = function () {
    // By returning any arguments we get, the function can be inserted
    // anywhere in the chain.
    var args = arguments;
    return mopidy.playback.getCurrentTrack()
        .then(function (track) {
            console.log("Now playing:", trackDesc(track));
            return args;
        });
};

var queueAndPlay = function (playlistNum, trackNum) {
    playlistNum = playlistNum || 0;
    trackNum = trackNum || 0;
    mopidy.playlists.getPlaylists()
        // => list of Playlists
        .fold(get, playlistNum)
        // => Playlist
        .then(printTypeAndName)
        // => Playlist
        .fold(get, 'tracks')
        // => list of Tracks
        .then(mopidy.tracklist.add)
        // => list of TlTracks
        .fold(get, trackNum)
        // => TlTrack
        .then(mopidy.playback.play)
        // => null
        .then(printNowPlaying)
        // => null
        .catch(console.error.bind(console))  // Handle errors here
        // => null
        .done();                       // ...or they'll be thrown here
};


var playArtist = function (artist) {
    mopidy.library.search(artist)
        // => search result  	
        .fold(get, 'tracks')
        // => list of Tracks
        .then(mopidy.tracklist.add)
        // => list of TlTracks
        .fold(get, 1)
        // => TlTrack
        .then(mopidy.playback.play)
        // => null
        .then(printNowPlaying)
        // => null
        .catch(console.error.bind(console))  // Handle errors here
        // => null
        .done();                       // ...or they'll be thrown here
};

var mopidy = new Mopidy();             // Connect to server
mopidy.on(console.log.bind(console));  // Log all events
mopidy.on("state:online", playArtist({any: "Spoon"));
console.log("It's Dano");
