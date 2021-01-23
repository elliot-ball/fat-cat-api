var gplay = require('google-play-scraper');


module.exports.getTopAppsInCategory = (categoryId) => {

    return gplay.list({
        category: categoryId,
        collection: gplay.collection.TOP_FREE,
        num: 2,
        throttle: 1,
        country: 'uk'
    })
    .then(result => {
        return result;
    }).catch(error => {
        console.log(error);
    });
    
}

module.exports.getAppByPlaystoreId = async (appId) => {

    try {
        const result = await gplay.app({
            appId: appId,
            throttle: 1,
            country: 'uk'
        });
        return result;
    } catch (error) {
        console.log(error);
    }

}