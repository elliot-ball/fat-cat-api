var gplay = require('google-play-scraper');

let val = gplay.reviews({
    appId: 'jp.konami.duellinks'
}).then((result) => {
    // console.log(result);
    let textReviews = result.data.map((review) => {
        return review.text;
    });
    console.log(textReviews);
});

