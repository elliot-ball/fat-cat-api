const database = require('./database');
const playstoreApi = require('./playstore-api');

const explodeIapRange = (app) => {

    let result = {
        iapRangeLower: null,
        iapRangeUpper: null,
        fixedRateIap: false,
        iapRange: app.IAPRange
    };

    if (result.iapRange) {
        
        let matches = result.iapRange.match(/£(\d+\.\d+)\s-\s£(\d+\.\d+)/);

        if (matches !== null) {

            result.iapRangeLower = matches[1];    
            result.iapRangeUpper = matches[2];

        }
        else {

            matches = result.iapRange.match(/£(\d+\.\d+)/);

            if (matches !== null) {

                result.iapRangeLower = matches[1];
                result.iapRangeUpper = matches[1];
                result.fixedRateIap = true;

            }

        }

    }
    return result;
}

const getAppDetails = async (appId) => {

    let matchingApp = await database.getAppByPlaystoreID(appId);
    // console.log(matchingApp)
    if (matchingApp) {
        console.log('we already have this app');
        return matchingApp;
    }
    else {

        const playstoreApp = await playstoreApi.getAppByPlaystoreId(appId);
        const { iapRange, iapRangeLower, iapRangeUpper, fixedRateIap } = explodeIapRange(playstoreApp);

        await database.insertApp({ ...playstoreApp, iapRange, iapRangeLower, iapRangeUpper, fixedRateIap });
        console.log('new app added:' + playstoreApp.title);
        matchingApp = await database.getAppByPlaystoreID(appId);
        return matchingApp;
    }

}

const getAppsInCategory = async (category) => {
    const playstoreApps = await playstoreApi.getTopAppsInCategory(category.category_id);

    const apps = await Promise.all( playstoreApps.map(app => getAppDetails(app.appId)));
        
    return { category, apps };
}

const updateCategoriesApps = async () => {

    const categories = await database.getAllCategories();

    return Promise.all( categories.map(category => getAppsInCategory(category)));
    
}

const run = async () => {

    const catApps = await updateCategoriesApps();
    // console.log(catApps);
    // console.log(catApps[0].appsDetails);

}



const testDB = async () => {

    let cat = await database.getAllCategories();

    console.log(cat);

}

const testInsert = async () => {

    let app = await getAppDetails('com.ta.offline.strike.force');

    console.log(app.appId);

}


// run();
testInsert();
// testDB();
