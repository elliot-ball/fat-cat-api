// const { Pool } = require('pg'); // Enables querying postgresql DB
const { TinyPg } = require('tinypg');
const { resolve } = require('path');
const { snakeKeysToCamel } = require('./utils/camelCase');

require("dotenv").config({
    path: resolve(process.cwd(), ".env"),
});
// Configure DB connection using values from .env
const pool = new TinyPg({
    connection_string: `postgres://${process.env.PGFC_RW_USERNAME}:${process.env.PGFC_RW_PASSWORD}@${process.env.PGFC_HOST}:${process.env.PGFC_PORT}/${process.env.PGFC_DATABASE}`,
    // host: process.env.PGFC_HOST,
    // database: process.env.PGFC_DATABASE,
    // user: process.env.PGFC_RW_USERNAME,
    // password: process.env.PGFC_RW_PASSWORD,
    // port: process.env.PGFC_PORT,
    // max: 5,
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000
});

module.exports.getAllCategories = () => {
    return pool.query(`
        select * from category
    `).then(result => {
        return snakeKeysToCamel(result.rows);
    }).catch(error => {
        console.log(error);
    });
}

module.exports.getAppByPlaystoreID = (playstoreID) => {
    return pool.query(`
        select * from app
        where play_store_app_id = :playstoreID
    `, { playstoreID: playstoreID }).then(result => {
        // console.log(result);
        if (result.rows.length > 0) {
            return snakeKeysToCamel(result.rows[0]);
        }
        else {
            return false;
        }
    }).catch(error => {
        console.log(error);
    });
}

module.exports.insertApp = (app) => {
    return pool.query(`
    INSERT
    INTO
        app
        (
            play_store_app_id,
            title,
            description,
            description_html,
            summary,
            installs,
            min_installs,
            max_installs,
            score,
            score_text,
            ratings,
            reviews,
            price,
            free,
            offers_iap,
            iap_range,
            iap_range_upper,
            iap_range_lower,
            fixed_rate_iap,
            size,
            android_version,
            developer,
            developer_id,
            privacy_policy,
            genre,
            genre_id,
            icon,
            header_image,
            screenshots,
            video,
            video_image,
            content_rating,
            content_rating_description,
            ad_supported,
            released,
            updated,
            recent_changed,
            url
        )
        VALUES
        (
            :appId,
            :title,
            :description,
            :descriptionHTML,
            :summary,
            :installs,
            :minInstalls,
            :maxInstalls,
            :score,
            :scoreText,
            :ratings,
            :reviews,
            :price,
            :free,
            :offersIap,
            :iapRange,
            :iapRangeUpper,
            :iapRangeLower,
            :fixedRateIap,
            :size,
            :androidVersion,
            :developer,
            :developerId,
            :privacyPolicy,
            :genre,
            :genreId,
            :icon,
            :headerImage,
            :screenshots,
            :video,
            :videoImage,
            :contentRating,
            :contentRatingDescription,
            :adSupported,
            :released,
            :updated,
            :recentChanged,
            :url
        ) ;
    `, {
        appId: app.appId, 
        title: app.title,
        description: app.description,
        descriptionHTML: app.descriptionHTML,
        summary: app.summary,
        installs: app.installs,
        minInstalls: app.minInstalls,
        maxInstalls: app.maxInstalls,
        score: app.score,
        scoreText: app.scoreText,
        ratings: app.ratings,
        reviews: app.reviews,
        price: app.price,
        free: app.free,
        offersIap: app.offersIap,
        iapRange: app.iapRange,
        iapRangeUpper: app.iapRangeUpper,
        iapRangeLower: app.iapRangeLower,
        fixedRateIap: app.fixedRateIap,
        size: app.size,
        androidVersion: app.androidVersion,
        developer: app.developer,
        developerId: app.developerId,
        privacyPolicy: app.privacyPolicy,
        genre: app.genre,
        genreId: app.genreId,
        icon: app.icon,
        headerImage: app.headerImage,
        screenshots: app.screenshots,
        video: app.video,
        videoImage: app.videoImage,
        contentRating: app.contentRating,
        contentRatingDescription: app.contentRatingDescription,
        adSupported: app.adSupported,
        released: app.released,
        updated: app.updated,
        recentChanged: app.recentChanged,
        url: app.url, 
    }).then(result => {
        return true;
    }).catch(error => {
        console.log(error);
    });
}