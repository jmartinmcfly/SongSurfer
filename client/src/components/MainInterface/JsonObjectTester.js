const toTest =
  'Sure thing! Here\'s your updated playlist:\n\n{\n"actionList": [\n{\n"actionType: "add",\n"tracks": [\n{\n"track": "So What",\n"artist": "Miles Davis",\n"album": "Kind of Blue"\n},\n{\n"track": "All Blues",\n"artist": "Miles Davis",\n"album": "Kind of Blue"\n},\n{\n"track": "My Funny Valentine",\n"artist": "Miles Davis",\n"album": "Cookin\' with the Miles Davis Quintet"\n},\n]\n}\n]\n}\n\nYour playlist now includes three iconic songs by legendary jazz musician Miles Davis. "So What" and "All Blues" come from Davis\' seminal album "Kind of Blue," while "My Funny Valentine" is a classic ballad from his album "Cookin\' with the Miles Davis Quintet." These songs are sure to add a touch of sophistication and cool to your playlist. Enjoy!'

const parseResponse = (responseMessage) => {
  try {
    console.log('here')
    const { jsonObject, beforeJson, afterJson } = splitJsonFromString(responseMessage)
    console.log(afterJson)
    const playlistActions = jsonObject.actionList
    // TODO: check formatting of parsed response message
    const parsedResponseMessage = beforeJson + afterJson

    return { playlistActions, parsedResponseMessage }
  } catch (error) {
    console.log(error)
    let playlistActions = []
    let parsedResponseMessage = responseMessage
    return { playlistActions, parsedResponseMessage }
  }
}

const splitJsonFromString = (input) => {
  const openBracketIndex = input.indexOf('{')
  const closeBracketIndex = input.lastIndexOf('}')
  console.log(openBracketIndex)
  console.log('closeBracketIndex' + closeBracketIndex)

  if (openBracketIndex === -1 || closeBracketIndex === -1) {
    throw new Error('No JSON object found in the input string')
  }

  const jsonString = input.slice(openBracketIndex, closeBracketIndex + 1)
  const beforeJson = input.slice(0, openBracketIndex)
  const afterJson = input.slice(closeBracketIndex + 1)

  let jsonObject
  try {
    console.log(jsonString)
    jsonObject = JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
    throw new Error('Invalid JSON object in the input string')
  }

  return {
    jsonObject,
    beforeJson,
    afterJson,
  }
}

console.log(parseResponse(toTest))
