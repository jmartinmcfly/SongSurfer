enum Action {
  replace = 'replace',
  add = 'add',
  remove = 'remove',
}

type returnFormat = {
  actionList: [
    [
      {
        actionType: Action
        tracks: [
          {
            track: string
            artist: string
            album: string
          }
        ]
      }
    ]
  ]
}
