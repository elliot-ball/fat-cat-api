const database = require('./database');
const playstoreApi = require('./playstore-api');
const https = require('https');
const fs = require('fs');
const sa = require('./sentiment-analysis');
const { contentSecurityPolicy } = require('helmet');

const explodeIapRange = (app) => {

    let result = {
        iapRangeLower: null,
        iapRangeUpper: null,
        fixedRateIap: false,
        iapRange: app.iapRange
    };

    if (result.iapRange) {
        let matches = result.iapRange.match(/£(\d+\.\d+)\s-\s£(\d+\.\d+)/);
        // console.log(matches)
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

const getAppDetails = async (app) => {
    const { appId } = app;
    let matchingApp = await database.getAppByPlaystoreID(appId);
    console.log(app);
    if (matchingApp) {
        return matchingApp;
    }
    else {
        const playstoreApp = await playstoreApi.getAppByPlaystoreId(appId);
        const { iapRangeLower, iapRangeUpper, fixedRateIap } = explodeIapRange(playstoreApp);
        console.log('Adding: ' + playstoreApp.title);
        await database.insertApp({ ...playstoreApp, iapRangeLower, iapRangeUpper, fixedRateIap });
        await scrapeImage(playstoreApp.icon);

        matchingApp = await database.getAppByPlaystoreID(appId);
        return matchingApp;
    }

}

const getAppsInCategory = async (category) => {
    console.log(category.categoryId);
    const playstoreApps = await playstoreApi.getTopAppsInCategory(category.categoryId);
    const apps = await Promise.all( playstoreApps.map(app => getAppDetails(app)));
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

    let app = await getAppDetails({appId:'com.supercell.hayday'});

    console.log(app);

}

const testAPIAppPull = async () => {

    // const app = await playstoreApi.getAppByPlaystoreId('com.supercell.hayday');
    const app = await playstoreApi.getReviewsByPlaystoreId('com.supercell.hayday');
    console.log(app);

}

const testPlaystoreAPI = async () => {
    const playstoreApp = await playstoreApi.getAppByPlaystoreId('com.miniworldblock.krafting202');
    console.log(playstoreApp);
}

const scrapeImage = async (url) => {
    let fileId;
    let matches = url.match(/(?:https:\/\/(?:(?:[a-z]|[0-9]|-)*\.?)+)\/(.+)/);
    // console.log(matches);
    if (matches !== null) {
        fileId = matches[1];
        // console.log(fileId);
        const localPath = `icons/${fileId}.png`;
        const file = fs.createWriteStream(localPath);
        const request = https.get(url, (response) => {
            response.pipe(file);
        });
    }
    else {
        console.log('error: failed to grab icon fileId from URL');
    }
}

const scrapeAllIcons = async () => {
    const apps = await database.getAllApps();
    // console.log(apps)
    apps.forEach(async (app) => {
        console.log('scraping ' + app.title);
        await scrapeImage(app.icon);
        console.log('waiting');
        await new Promise(r => setTimeout(r, 2000));
    });
}

const testImageScrape = async () => {
    let app = await getAppDetails('com.ta.offline.strike.force');
    console.log(app.icon);
    await scrapeImage(app.icon);
    
    
}

const validateIapData = async () => {
    const apps = await database.getAllApps();
    apps.forEach(async (app) => {
        // if (app.iapRange !== null && (app.iapRangeUpper === null || app.iapRangeLower  === null)) {
            // console.log(app.appId);
            // console.log(app.playStoreAppId);
            // const playstoreApp = await playstoreApi.getAppByPlaystoreId(app.playStoreAppId);
            // if (playstoreApp) {   
                console.log(app.playStoreAppId);
                console.log(app.appId);
                const { iapRangeLower, iapRangeUpper, fixedRateIap } = explodeIapRange(app);
                console.log({ iapRangeLower, iapRangeUpper, fixedRateIap });
                await database.updateAppByAppId({ ...app, iapRangeLower, iapRangeUpper, fixedRateIap });
                // await new Promise(r => setTimeout(r, 2000));
            // }

        // }
    });
    console.log(apps.length)

}

const generateReviewScore = async () => {
    const apps = await database.getAppsWithoutKeywordAnalysis();
    console.log(apps.length); //112
    apps.forEach( async (app) => {
        // const app = apps[2];
        // console.log(app.playStoreAppId);

        const reviews = await playstoreApi.getReviewsByPlaystoreId(app.playStoreAppId);
        if (reviews) {

            reviews.forEach( async (review) => {
                if (review.text) {
                    const reviewObj = {
                        appId: app.appId,
                        playstoreReviewId: review.id,
                        score: review.score,
                        text: review.text,
                    };
                    const reviewExists = await database.reviewExists(reviewObj.playstoreReviewId, reviewObj.appId);
                    if (!reviewExists) {
                        await database.insertReview(reviewObj);
                    }
                }
            });

            const texts = reviews.map((review) => {
                if (review.text) {
                    return review.text;
                }
            });

            const scores = await sa.main(texts);
            console.log('app: ' + app.playStoreAppId);
            console.log(scores);

            for (const [key, score] of Object.entries(scores)) {
                await database.insertKeywordResults(
                    score.id,
                    app.appId,
                    score.count,
                    texts.length
                )
            }
        }
        // console.log(scores);
        // console.log('keyword_id: ' + scores.grindy.id);
        // console.log('app_id: ' + reviewObj.appId);
        // console.log('review_count: ' + texts.length);
        // console.log('keyword_count: ' + scores.grindy.count);
    });
}

// run();
// testInsert();
// testAPIAppPull();
// testDB();
// testImageScrape();
// scrapeAllIcons();
// validateIapData();   
// testPlaystoreAPI();
generateReviewScore();