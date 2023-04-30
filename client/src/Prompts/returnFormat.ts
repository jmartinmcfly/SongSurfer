enum Action {
  replace = 'replace',
  add = 'add',
  remove = 'remove',
}

type returnFormat = {
  actionList: {
    actionType: Action
    tracks: {
      track: string
      artist: string
      album: string
    }[]
  }[]
}

{
  "actionList": [
    {
      "actionType": "replace",
      "tracks": [
        {
        "track": "Right Here, Right Now",
        "artist": "Fatboy Slim",
        "album": "You've Come a Long Way, Baby"
        },
        {
        "track": "Around the World",
        "artist": "Daft Punk",
        "album": "Homework"
        },
        {
        "track": "Smack My Bitch Up",
        "artist": "The Prodigy",
        "album": "The Fat of the Land"
        },
        {
        "track": "Let Forever Be",
        "artist": "The Chemical Brothers",
        "album": "Surrender"
        },
        {
        "track": "I Feel Love",
        "artist": "Donna Summer",
        "album": "I Remember Yesterday"
        },
        {
        "track": "Personal Jesus",
        "artist": "Depeche Mode",
        "album": "Violator"
        },
        {
        "track": "Block Rockin' Beats",
        "artist": "The Chemical Brothers",
        "album": "Dig Your Own Hole"
        },
        {
        "track": "Push It",
        "artist": "Garbage",
        "album": "Version 2.0"
        },
        {
        "track": "Breathe",
        "artist": "The Prodigy",
        "album": "The Fat of the Land"
        },
        {
        "track": "Born Slippy .NUXX",
        "artist": "Underworld",
        "album": "Trainspotting: Music from the Motion Picture, Vol. #1"
        }
        ]
    }
  ]
}

[,{"track": "Naima","artist": "John Coltrane","album": "Giant Steps"},{"track": "Blue Train","artist": "John Coltrane","album": "Blue Train"},{"track": "Central Park West","artist": "John Coltrane","album": "Coltrane's Sound"},{"track": "Equinox","artist": "John Coltrane","album": "Coltrane's Sound"},{"track": "Impressions","artist": "John Coltrane","album": "Impressions"},{"track": "Alabama","artist": "John Coltrane","album": "Live at Birdland"},{"track": "Giant Steps (Alternate Take)","artist": "John Coltrane","album": "Giant Steps: 60th Anniversary Super Deluxe Edition"}]
