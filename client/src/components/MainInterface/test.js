"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
var toTest = 'Sure thing! Here\'s your updated playlist:\n\n{\n"actionList": [\n{\n"actionType: "add",\n"tracks": [\n{\n"track": "So What",\n"artist": "Miles Davis",\n"album": "Kind of Blue"\n},\n{\n"track": "All Blues",\n"artist": "Miles Davis",\n"album": "Kind of Blue"\n},\n{\n"track": "My Funny Valentine",\n"artist": "Miles Davis",\n"album": "Cookin\' with the Miles Davis Quintet"\n},\n]\n}\n]\n}\n\nYour playlist now includes three iconic songs by legendary jazz musician Miles Davis. "So What" and "All Blues" come from Davis\' seminal album "Kind of Blue," while "My Funny Valentine" is a classic ballad from his album "Cookin\' with the Miles Davis Quintet." These songs are sure to add a touch of sophistication and cool to your playlist. Enjoy!';
var parseResponse = function (responseMessage) {
    try {
        var _a = splitJsonFromString(responseMessage), jsonObject = _a.jsonObject, beforeJson = _a.beforeJson, afterJson = _a.afterJson;
        var playlistActions = jsonObject.actionList;
        // TODO: check formatting of parsed response message
        var parsedResponseMessage = beforeJson + afterJson;
        return { playlistActions: playlistActions, parsedResponseMessage: parsedResponseMessage };
    }
    catch (error) {
        var playlistActions = [];
        var parsedResponseMessage = responseMessage;
        return { playlistActions: playlistActions, parsedResponseMessage: parsedResponseMessage };
    }
};
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Assistant"] = "assistant";
    Role["System"] = "system";
})(Role = exports.Role || (exports.Role = {}));
var splitJsonFromString = function (input) {
    var openBracketIndex = input.indexOf('{');
    var closeBracketIndex = input.lastIndexOf('}');
    if (openBracketIndex === -1 || closeBracketIndex === -1) {
        throw new Error('No JSON object found in the input string');
    }
    var jsonString = input.slice(openBracketIndex, closeBracketIndex + 1);
    var beforeJson = input.slice(0, openBracketIndex);
    var afterJson = input.slice(closeBracketIndex + 1);
    var jsonObject;
    try {
        jsonObject = JSON.parse(jsonString);
    }
    catch (error) {
        throw new Error('Invalid JSON object in the input string');
    }
    return {
        jsonObject: jsonObject,
        beforeJson: beforeJson,
        afterJson: afterJson,
    };
};
parseResponse(toTest);
