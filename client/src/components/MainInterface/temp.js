let toTest = `[
  {
    actionType: 'remove',
    tracks: [
      {
        track: 'At Last',
        artist: 'Etta James',
        album: 'At Last!',
      },
      {
        track: 'Respect',
        artist: 'Aretha Franklin',
        album: 'I Never Loved a Man the Way I Love You',
      },
      {
        track: "(Sittin' On) the Dock of the Bay",
        artist: 'Otis Redding',
        album: 'The Dock of the Bay (Mono)',
      },
      {
        track:
          'Girl (Why You Wanna Make Me Blue)/All I Need/My Girl - Medley/Live On The Ed Sullivan Show, May 28, 1967',
        artist: 'The Temptations',
        album:
          'Girl (Why You Wanna Make Me Blue)/All I Need/My Girl [Medley/Live On The Ed Sullivan Show, May 28, 1967]',
      },
      {
        track: "What's Going On",
        artist: 'Marvin Gaye',
        album: "What's Going On",
      },
      {
        track: 'Chain of Fools',
        artist: 'Aretha Franklin',
        album: 'Lady Soul (With Bonus Selections)',
      },
      {
        track: 'I Got You (I Feel Good)',
        artist: 'James Brown & The Famous Flames',
        album: 'I Got You (I Feel Good)',
      },
      {
        track: "Let's Get It On",
        artist: 'Marvin Gaye',
        album: "Let's Get It On (Deluxe Edition)",
      },
      {
        track: 'I Heard It Through The Grapevine',
        artist: 'Gladys Knight & The Pips',
        album: 'Everybody Needs Love',
      },
      {
        track: 'Try a Little Tenderness',
        artist: 'Otis Redding',
        album: 'The Very Best of Otis Redding',
      },
      {
        track: 'You Are the Best Thing',
        artist: 'Ray LaMontagne',
        album: 'Gossip In The Grain',
      },
      {
        track: 'Kiss and Say Goodbye',
        artist: 'The Manhattans',
        album: 'The Manhattans (Expanded Version)',
      },
      {
        track: 'Lovely Day',
        artist: 'Bill Withers',
        album: 'Menagerie',
      },
    ],
  },
  {
    actionType: 'add',
    tracks: [
      {
        track: 'Superstition',
        artist: 'Stevie Wonder',
        album: 'Talking Book',
      },
      {
        track: 'Brick House',
        artist: 'The Commodores',
        album: 'Commodores',
      },
      {
        track: 'I Want You Back',
        artist: 'The Jackson 5',
        album: 'Diana Ross Presents The Jackson 5',
      },
      {
        track: 'Get Up Offa That Thing',
        artist: 'James Brown',
        album: 'Get Up Offa That Thing',
      },
      {
        track: 'Le Freak',
        artist: 'Chic',
        album: "C'est Chic",
      },
      {
        track: 'Play That Funky Music',
        artist: 'Wild Cherry',
        album: 'Wild Cherry',
      },
      {
        track: 'Dancing Machine',
        artist: 'The Jackson 5',
        album: 'Get It Together',
      },
      {
        track: 'Give Up the Funk (Tear the Roof off the Sucker)',
        artist: 'Parliament',
        album: 'Mothership Connection',
      },
      {
        track: "That's the Way (I Like It)",
        artist: 'KC and the Sunshine Band',
        album: 'KC and the Sunshine Band',
      },
      {
        track: 'Jungle Boogie',
        artist: 'Kool & The Gang',
        album: 'Wild and Peaceful',
      },
    ],
  },
]`

console.log(JSON.parse(toTest))
