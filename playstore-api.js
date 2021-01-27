var gplay = require('google-play-scraper');


module.exports.getTopAppsInCategory = (categoryId) => {
    console.log('cat is: ' +categoryId);
    return gplay.list({
        category: categoryId,
        collection: gplay.collection.TOP_FREE,
        num: 100,
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
        return { ...result, offersIap: result.offersIAP, iapRange: result.IAPRange };
    } catch (error) {
        console.log('error fetching: ' + appId);
        console.log(error);
        return false;
    }

}

module.exports.getReviewsByPlaystoreId = async (playstoreId) => {

    try {
        const result = await gplay.reviews({
            appId: playstoreId,
            sort: gplay.sort.RATING,
            num: 3000,
            throttle: 1
        });
        return result.data;
    } catch (error) {
        console.log('error fetching: ' + playstoreId);
        console.log(error);
        return false;
    }

}