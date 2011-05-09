var exec = require('child_process').exec;

module.exports = {
  get: function(inputfile, callback) {
    try
    {
      exec('ffmpeg -i ' + inputfile, function(err, stdout, stderr) {
        // parse data from stderr
        var aspect = /(4|3|16):(3|2|9|10)/.exec(stderr);
        var bitrate = /bitrate: ([0-9]+) kb\/s/.exec(stderr);
        var duration = /Duration: (([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]+))/.exec(stderr);
        var resolution = /(([0-9]{2,5})x([0-9]{2,5}))/.exec(stderr);
        var major_brand = /major_brand\s+:\s+(.+)/.exec(stderr);
        var minor_version = /minor_version\s+:\s+(.+)/.exec(stderr);
        var compatible_brands = /compatible_brands:\s+(.+)/.exec(stderr);
        var creation_time = /create_time\s+:s+(.+)/.exec(stderr);
        var title = /title\s+:\s+(.+)/.exec(stderr);
        var artist = /artist\s+:\s+(.+)/.exec(stderr);
        var composer = /composer\s+:\s+(.+)/.exec(stderr);
        var album = /album\s+:\s+(.+)/.exec(stderr);
        var track = /track\s+:\s+(.+)/.exec(stderr);
        var date = /date\s+:\s+(.+)/.exec(stderr);
        var encoder = /encoder\s+:\s+(.+)/.exec(stderr);
        
        // build return object
        var ret = {
            aspect: (aspect && aspect.length > 0) ? aspect[0] : '',
            durationraw: (duration && duration.length > 1) ? duration[1] : '',
            bitrate: (bitrate && bitrate.length > 1) ? bitrate[1] : '',
            resolution: {
              w: (resolution && resolution.length > 2) ? resolution[2] : 0,
              h: (resolution && resolution.length > 3) ? resolution[3] : 0
            },
            major_brand : (major_brand && major_brand.length > 0) ? major_brand[1] : '',
            minor_version : (minor_version && minor_version.length > 0) ? minor_version[1] : 0,
            compatible_brands : (compatible_brands && compatible_brands.length > 0) ? compatible_brands[1] : '',
            creation_time : (creation_time && creation_time.length > 0) ? creation_time[1] : '',
            title : (title && title.length > 0) ? title[1] : '',
            artist : (artist && artist.length > 0) ? artist[1] : '',
            composer : (composer && composer.length > 0) ? composer[1] : '',
            album : (album && album.length > 0) ? album[1] : '',
            track : (track && track.length > 0) ? track[1] : '',
            date : (date && date.length > 0) ? date[1] : '',
            encoder : (encoder && encoder.length > 0) ? encoder[1] : ''
        };
        
        // calculate duration in seconds
        if (duration && duration.length > 1) {
          var parts = duration[1].split(':');
          var secs = 0;
          // add hours
          secs += parseInt(parts[0]) * 3600;
          // add minutes
          secs += parseInt(parts[1]) * 60;
          // add seconds
          secs += parseInt(parts[2]);
          ret.durationsec = secs;
        }
        
        callback(ret);
      });
    } catch (err) {
      callback(null, err);
    }
  }
}
