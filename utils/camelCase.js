const snakeKeysToCamel = function(snakeObject) {
    var camelObject = {};
    let camelKey;
    for (var snakeKey in snakeObject) {
        if (snakeObject.hasOwnProperty(snakeKey)) {
            camelKey = snakeKey.replace(/_\w/g, function(match) {
                return match[1].toUpperCase();
            });
            camelObject[camelKey] = snakeObject[snakeKey];
            if (camelObject[camelKey] !== null && typeof camelObject[camelKey] === 'object') {
                camelObject[camelKey] = snakeKeysToCamel(camelObject[camelKey]);
            }
        }
    }
    return camelObject;
};

module.exports.snakeKeysToCamel = snakeKeysToCamel;