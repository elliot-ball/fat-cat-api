const database = require('./database');
const playstoreApi = require('./playstore-api');

const explodeIAPRange = (app) => {
    let result = {
        IAPRangeLower: null,
        IAPRangeUpper: null,
        fixedRateIAP: false
    };
    if (app.IAPRange) {
        
        let matches = app.IAPRange.match(/£(\d+\.\d+)\s-\s£(\d+\.\d+)/);
        console.log(app.IAPRange);
        console.log(matches);
        if (matches !== null) {

            result.IAPRangeLower = matches[1];    
            result.IAPRangeUpper = matches[2];

        }
        else {

            matches = app.IAPRange.match(/£(\d+\.\d+)/);

            if (matches !== null) {

                result.IAPRangeLower = matches[1];
                result.IAPRangeUpper = matches[1];
                result.fixedRateIAP = true;

            }

        }

    }
    return result;
}

const getAppDetails = async (appId) => {

    let matchingApp = await database.getAppByPlaystoreID(appId);

    if (matchingApp) {
        console.log('we already have this app');
        return matchingApp;
    }
    else {

        const playstoreApp = await playstoreApi.getAppByPlaystoreId(appId);
        const { IAPRangeLower, IAPRangeUpper, fixedRateIAP } = explodeIAPRange(playstoreApp);

        await database.insertApp({ ...playstoreApp, IAPRangeLower, IAPRangeUpper, fixedRateIAP });
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

    console.log(app.app_id);

}


// run();
testInsert();
// testDB();
