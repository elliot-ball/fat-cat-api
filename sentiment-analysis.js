const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
var Sentiment = require('sentiment');
const database = require('./database');
var cloneDeep = require('lodash.clonedeep');

// for each game
//     for each review
//         for each sentence
//             identify keyword matches
//             identify which keyword has the most matches
//             sentiment analysis on sentence
            
// find keywords in reviews
function isMatchedWord (givenWordArray, keywords) {
    let keywordCount = {};
    keywords.forEach((keyword) => {
        keywordCount[keyword.key] = 0;
    });
    // console.log(givenWordArray)
    keywords.forEach((keyword) => {
        keyword.keywords.forEach((word) => {
            givenWordArray.forEach((givenWord) => {
                if (givenWord === word) {
                    keywordCount[keyword.key]++;
                }
            });
        });
        keyword.phrases.forEach((phrase) => {
            let string = givenWordArray.join(' ');
            if (string.indexOf(phrase) > 0) {
                keywordCount[keyword.key]++;
            }
        });
    });

    return keywordCount;
};

// define textx
const reviews1 = [
    "Worst game I've ever played. Grindy and greedy. Everthing need gem, if not, you lose everytime or wait for years so you can get the card you want. Even so, the chance of win is small. Event sucks ass, too many strong AI opponent too with little to no worthy rewards. Event exclusive cards and character, because if you don't play this game long enough then f u. Whales everywhere. Cancerous community, especially Indonesian. Go play offline games, or if you love ygo just play offline ygo tcg",
    "Very bad game, lost all my data spent hours over hours playing and they won't even help me get my data back I wouldn't recommend this game at all, its also a pay to win game.",
    "Love how you can have fun even as a f2p",
    "Too pay to win",
    "Pay to win , you need 50k gems for a complete competitive deck (2000$).",
// ];

// const unhelpfulReviews = [
    "Awesome game! Slow start but give it a chance.",
    "Excellent endless cards too choose between and combination too try",
    "The best game ever 💯",
    "Love the game",
    "Ficou ainda mais lixo depois da última atualização. Crashando frequentemente.",
    "This game is showing no connection although I have good connection.Because of that I am losing my PvP duels.",
    "This game is really awesome we got 3 Egyptian gods at the start of the game and 3500 gems at the start",
    "Cool",
    "Yu gi oh due",
    "Games is good but the carwds you draw is just so bad its like you draw careds from priviuse matches and the deck its not even shuffled properly like and the coin flip its so bad rock paper and scissors is way better that was the origenal yu gi os all about",
    "Sign in bugs out some times, follows the bs laws of the anime, so prepair the hate for anti-cannon gameplay and risk of randomly losing your account progress at no notice!",
    "This game is just amaaaaaaazing🤩🤩",
    "I wish there's a trading system",
    "I DONT LIKE THIS GAME CUZ I DONT LIKE",
    "Cool",
    "Love it",
    "To long to donlode",
    "great game ITS TIME TO DUEL KAIBA",
    "Very good",
    "Please fix ranked duels for Indonesia region, my internet is over 10 mbps but I ALWAYS get disconnected in ranked duels, this also occurs to some of my friends",
    "Pretty good game",
    "Konami sana pag binura koto sana wag umulit pag umulit sana mawala na ang larong to",
    "It's fun",
    "Your update speed is garbage....",
    "Badass game respect",
    "Cool app",
    "This a great game for those know as a anime or play the real game",
    "What's not to love!",
    "its not letting me PVP it keeps saying communication timed out please fix this and i will give it 5 stars again.. i cant PVP!! help please😔",
    "The only app where I can get my game on🔥💯",
    "Nice strategy game I like it",
    "This game is really fast paced and addicting lol, other than that it brings back alot of good memories from the first yu-gi-oh series. My advice is to include more characters increase the life points a bit cause the duels are too quick sometimes. Otherwise good game.",
    "I do own blue eye white dragon card in real life :)",
    "Best card game on mobile",
    "Best game ever made",
    "mama",
    "Carda effect is not working like it should be. Sometime it's work and sometimes no. You are ruining the game.",
    "Still cant understand why the developers make it possible to conduct 14 normal and special summon in one turn! How can you win against that or strategize against that while at the same time allowing that deck to have cards which enable the user to recycle his cards! To make it more annoying, starting the game takes forever 4+ minutes skipping storyline, event announcement, new pack etc before you can actually begin to play",
    "Please update yu-gi-oh legacy of duelist link evolution please more new card add speed duel nintendo switch",
    "Kool..!",
    "It's a good game my only dislike is that duels can feel a bit soulless and annoying from time to time.",
    "Great game",
    "its awe",
    "Excellent game",
    "After reaching stage 3 you have to defeat some duelist to get to the next stage but before reaching stage 4 you need to download additional data which is too expensive I bought a lot of data I deleted all my yu gi oh videos to have space but it wasn't enough I lost a lot of games",
    "Great game",
    "Great 🎮",
    "The best game",
    "It would be better if the game format was like the original game EDIT: 3 YEARS AND THIS STILL STANDS TRUE. Also, making decks are expensive.",
    "I hope I can build weather painter deck :3",
    "Can't play this game. Keeps reloading",
    "Used to be a great game now everone cheats.",
    "It was gorgeous with hours of gameplay and I'm not even halfway",
    "Great! I used to play Yu-Gi-Oh! When I was a kid. Almost like a nostalgia trip when I play this game. Personal feelings aside, I only gave 4 stars because online PvP is tough when everyone runs the same META deck.",
    "Kok nggak bisa di buka sih?",
    "You should be able to save your progress, Otherwise i'd give it 5 stars.",
    "Nice",
    "I would say its a nice game but the space for summoning is to small you cant have many monster and you cant even destroy existing cards played, also theirs a big difference especially the syncro and xyz summon it always end up having those user like unlimited special summon, espcially syncro tuner that can almost special summon 2 syncro monster with 1 tuner monster, its always difficult especially for user that use fusion that has almost no special summon at all",
    "Great game that you can pick up and play. No money needs to be spent which is great.",
    "Stuck in loading",
    "Best yugioh game ever",
    "Love it",
    "So far I've had a good experience with this game.",
    "so cool and professional",
    "🔥 🔥 🔥",
    "Love this game. Spent a lot of cash on is and I dont regret a dime. Only thing I wish you would add is trading. I would give 5 stars if you added a trading system were you can put a card up and ask for the card you want for the trade. Should be a limit to how many trades a day and what cards can and cant be traded",
    "Vergd",
    "Highly recommend. Great Game.",
    "Ugood",
    "Love it, really fun",
    "Mm",
    "Really amazing but they should add more starter decks and add ways to earn gems more easier",
    "Believe in the heart of the cards!",
    "still fun",
    "Better than Pokemon tcg online and available on mobile. What more to say. Better rewards too not just pay to play",
    "I like the different card variety,but cards cost a lot of gems.Although my experience was alright",
    "wow best cards now",
    "Really good game",
    "Perfection love Yu-Gi-Oh",
    "Awsome",
    "It's a good game but they need to bring bac the proper felid and deck limit 40+ decks and the 5 monster and magic zones and the game wud b so much better",
    "Great game 🎮",
    "Why we can only 3 cards in here, in my childhood we can play up to five monster in the field. Can we change it in setting?",
    "PLEASE INCREASE GEM REWARDs!!!! This is the best mobile Yu-gi-oh game but these gem REWARDs are trash Gem REWARDs should be +10 and event gems should be +50 or more. Takes way too much to collect gems and no gem shop to buy?",
    "Exalint dueling macanits and lots and lots of cards and the gafits are perfect 0",
    "Enjoying the game. Missing main phase 2, or is that no longer part of the game?",
    "Another pay to win game 😊😊😊😊 sarcastic",
    "AWESOME game",
    "Love it",
    "Due to the Frequent loss of connection I rate this 4 star , still very fun",
    "Please Help ME I Need to recover my duelist account please!",
    "It still has some bugs, but it's an interesting game with high tech and artificial intelligence",
    "Gg",
    "Awesome",
    "Honestly it was a good game to start. Then Xyz and Synchro summons destoryed it. The newer cards coming out just get stronger and stronger and easier to summon. Also card affects that are \"once per turn\" just use the effect, banish the card, the use a card to unbanish it and special summon it then you can use the \"once per turn\" effect again that very same turn.. nice work yugioh. Uninstalled. Create a game without Xyz and synchro and more people would play that.",
    "It is close to the game",
    "Gay",
    "v good",
    "Just remember to always take kiaba first it gives you a huge advantage and you can get yugi later on in the game",
    "Amazing",
    "Good game",
    "Good app",
    "For mobile data user, if you can't login to game, use vpn,,,",
    "Nice",
    "Good",
    "no pay to win also really fun game got me back in to Yu Gi Oh including both the anime and game.",
    "Network.",
    "Its beutiful and Ive played before but there a lot of glitches and I find it unfair that some decks cost real cash.",
    "Game won't load with mobile data, works only on wifi please fix",
    "So fun best version so far",
    "You don't want this. The makers changed the game and put ridiculous time limits on ranked matches that make it IMPOSSIBLE for slow readers to keep up. They also took two spell and monster slots away AND put a 30 card MAXIMUM on decks so if you were hoping to bring your in person deck and strategies to this app to play with others around the world, don't bother. You'd be better off finding a discord group so that you can play on cam. They should at least have the option for regular play. Sad.",
    "why I can not login, the bufering is forever and stack in first menu, can not play anything, this is bug, fix it!",
    "Good game",
    "I have never been so enraged by a game in my life. This game is a big joke I have never in my life seen a game so one sided they start you out with a little bit of a chance to win a few duels but after a certain amount of time if you're not paying cash money to purchase cards you can forget about winning any more I have played and deleted this app many times to prove my theory you creators of this game are sad sad people",
    "Good",
    "Could you please fix the bug where i can't connect unless on wifi?",
    "Cannot login with mi 10t pro phone, it works well with my old phone before..will change the rating once the problem solved",
    "Long story short I will not start over for a 3rd time due to and i quote \"Unfortunately, the conditions did not match\" when trying to recover my old accounts with customer support",
    "Good",
    "It's a great game, I've always loved it and also big fan of the anime and actual tcg",
    "The best Yu Gi Oh game for mobile",
    "It's a really fun game😻but the reason I rated it a 4 is because sometimes my internet goes bad then it really lags 😭but otherwise it is a really fun game 🎮",
    "Haven't tried it yet, known sayin.. but anyways, .. it's downloading currently lol, sorry. Like the monsters though. 4 star for now. Known Sayin .. over and out.",
    "Pls add more red eyes.... Compared to blue eyes it just has to much less of it. I would love to get more of red eye cards in the game if possible",
    "Really great game. Reminds me of playing Yu-Gi-Oh TCG when I was younger. Only thing I would like to see is more of the cards from the original card game",
    "Update: kill off the tutorial most of us all know how to play the game. 👑 Of games 🌍 You guys need to implement a Google lens to make the experience out of the screen and onto the lens, to bring the experience of real life dueling, it will bring the Google lens to an all time High, and finally a Yu-Gi-Oh Go game, that has the design of dueling in the real world, ( I hope these are things we can see in the future. Main Focus 1st !!! the Matt uses a 5 card zone Kill off the Tutorial. Download.",
    "Truly fantastic you don't even need to know about Yugioh to play",
    "Resets everytime i play, could have been a fun game but wont let me play past level 2..",
    "Best game going!",
    "Amazing App! I'm been playing with my sister, and her boyfriend today! i still lost though ;( but that doesn't matter. the game is perfect. and me and my friends recreate the duels in the actual series!",
    "Its so slow",
    "Love it",
    "Very good",
    "include VRAINS",
    "Can y'all bring dongeun dice",
    "It is a fun exiting experience for those who love the trading card game Yu-Gi-Oh.",
    "It's too good just add character unlock missions for kite tenjo and add yugioh vrains",
    "This game is so fun",
    "Make Astral stfu cuz he annoying fr and maybe I'll come back.",
    "Great",
    "tristan be hacking",
    "Exceptional",
    "epic game",
    "Doesnt work",
    "I think is super duper AWESOME",
];

const reviews2 = [
    "All right",
    "ads",
    "everytime the game starts to play it will always crash on my note 20 ultra",
    "the idea ia good but the game needs to be way cooler ,",
    "Too much ads and very laggy",
    "Nuuub game. With too many ads",
    "Crashing everywhere",
    "Nice",
    "Yeah... not gonna watch an ad after every race. Uninstalled.",
    "Theres an ad after every 10 second race.",
    "super outstanding",
    "After every game it shuts down",
    "Bekar hai bhai mat download karna",
    "Terrible game. App crashes constantly",
    "it crashes",
    "an awesome game, but it needs some car modifications",
    "Mildy entertaining. Ad every 15 seconds.",
    "good",
    "ads are already annoying after one race",
    "nife game",
    "I love itttt",
    "Super game",
    "Imma be honest this game wen i try to get the 3x thing at th end it does not let me and guess what A ADD POPS UP WEN I START A NEW LEVEL MAKE IT WORK IM UNSTAILING IT Yall need to rate 1 star 2",
    "This game sooooo bad 30s or 40s ad after every game is not like the ad I watched and it will waste your time for nothing",
    "ok",
    "Deleted before the 10 second training session ended 😅 so terrible and boring",
    "Not sure why I turn off the vibration and it continues to vibrate and I hate that so much!🤬 I loathe vibration in a game its just so damn annoying and the fact that in the settings you can \"turn it off\" even though it actually doesn't do anything is why I'm deleting this game and giving it such a terrible review!",
    "wow",
    "good",
    "too easy",
    "Yeah , like the other reviewers says. its all about Ads. i uninstall it quick, i just try the game.",
    "This game is for children and they asking to be over 16 to be able to play this game what the **** is this game.",
    "Not a good game",
    "Boring. Needs a lot of improvements.",
    "It sucks to many adds race after race and makes your phone glitch out",
    "boring game ever",
    "Ads suddenly pop out during game and it occur on every stage! N there is another one after each game! Seriously?",
    "Not like the advertisements. Too many ads within the game as well. But the game is a neat concept.",
    "Women spamming continuously. I wish i could upload the advertisement video which you guys put up in a game ad. Seriously if that is a way of luring users for your app you suck at it. I wish i could also upload screenshot of so called chats the girls or women in your app do. It sucks totally.",
    "Ads.",
    "sujith",
    "Nice game",
    "i downloaded this app just to rate one star for braindead advertisement gameplay",
    "awesome",
    "game per",
    "something is lacking",
    "Ads here and there. Need to watch ads after clearing any single stage. Not going to play.",
    "nice",
    "good",
    "to many ads",
    "Too many ads",
    "This is good one gaming app and top speed car racing",
    "MAS RAFFI",
    "they lied to us",
    "boring",
    "Boring, just the fact alone that turning off vibrating in the game doesnt actually do anything is enough for an uninstall",
    "gaer new",
    "cool",
    "Full of adds🖕🖕🖕🖕",
    "nice game and graphics too!",
    "Pathetic Game",
    "To many ads not enough game.",
    "Vjg",
    "nice",
    "Just keeps crashing",
    "2 add pop up minimum in 1 minute, this is a very horible game experience.",
    "I did 24 levels that took about ten seconds each, I had to watch a 30 second ad after each level.",
    "Im going to be honest its fun but tooooo much ads",
    "To easy after every \"Race\" theirs a ad",
    "Won all the cars except unique have up at 65 after not winning any new cars repeatedly. Took an hour to get bored of the game lol",
    "it's a cool game",
    "Worst game grafics is not at all good",
    "Somewhat broken. Needs a lot of work on game mechanics, and PLEASE less ads. The concept is fun, but very hard to progress without watching ads. If you play this, turn off wifi and data.",
    "Its ok but the option to turn off vibrations doesn't work, I even tried opening and closing app and clicking option to turn vibro off again and it does not work, I can't deal with the games constant vibration",
    "nice",
    "so, many, ads.",
    "💕",
    "Crashed more than a derby car... Literally crashed 8 times in about 3 minutes. Only made it through one race. Downloaded it, and immediately needed a 44mb update...",
    "hell",
    "Ok, its an AMAZING idea but seriosly what car person would even give this three stars because literally all you do is tap you cant even swipe from gear to gear and you cant really slow down for the ramps so you dont hit the nose of the car or anything and you dont get that sweet feel when you get a perfect shift or am i the only person who gets that? But still its a very half assed crapy game",
    "hredysk",
    "Ok",
    "This sucks. Any car you get has the same speed limit. To dang easy. So many ads.",
    "nice move",
    "Fun for a little but way too many ads, physics don't even try to make sense (ie car standing on its nose for 5 hours), vibration doesn't actually turn off",
    "this game is terrible I playee 2 levels and now my life expectancy went down 20 years do not recommend",
    "In the settings you provide an option to turn off the vibrations but it doesn't turn them off",
    "Cool",
    "Very nice game",
    "To many ads there shouldn't be an ad after every single race and no option to pay to not have any ads",
    "ads",
    "The boys are too easy their soo trash🗑️",
    "Good concept, bad game Every time I start a race the game crashes, ads aren't a problem, there's a glitch where you can exit out of the app and restart in less than a few seconds while skipping the ad, very poorly made though",
    "More ads than actual gameplay (if you can call it that). You actually just press a few buttons and wait for it to be over.",
    "To many adds",
    "Typical, way to many ads and overall repetitive",
    "Keeps crashing on a new pixel 4a. Can't play past 2nd level, can't put in name. Uninstalling",
    "Game crashes seconds after loading. It is unplayable",
    "fun so far",
    "Some advertismemts don't work to claim a car... I click the video but doesn't pull up last one was for a dragster lvl 15 fix it???",
    "game just crashes non stop",
    "Downloaded it and then automatically had to update what the heck",
    "To many ads",
    "Game keeps crashing",
    "So Awesome",
    "Epic butt cheeks",
    "too many ads and sells your data",
    "glitchy",
    "Awful game. Way too easy, crashes constantly, nothing but ads. Stupid waste of time cash grab",
    "Car constantly flips if you get too much air even if you try and down shift to cut things back. I enjoy the concept but executed poorly",
    "Lame",
    "it crashes every second",
    "I say no thanks and get ads anyway? But no extra reward lmao this game is trash",
    "Good idea, horrible game. Game crashes after every race for me.",
    "Force close, can not even play the game. Note20Ultra",
    "Keeps crashing right off the start,",
    "Fun idea, but crashes after EVERY race. Idk if just me, but it's a real shame.",
    "Boring",
    "Game is a serious joke.... when you finish, there is a multiplier at the end. Each time I have it the full way up and I only get it to 9×... sorry but this is very sad...",
    "Horrible, I have a note 20 ultra and the game won't even play. If you are going to make a game, at least make it work for newer phones.",
    "Terrible",
    "I love this game",
    "Pretty dull and repetitive.",
    "nothing but ads smh",
    "Nice 👍",
    "One run, one ad.",
    "So bad",
    "I am not impressed by this",
    "This is the worst game I have ever played and only exists to scam kids out of money through ads or their parents credit cards",
    "App keeps closing...bye",
    "too many ads",
    "hella ads but still fun tho",
    "Constantly crashes. Not playable.",
    "Don't download... It's keep crashing",
    "Crashed to much and had an ad every 10 seconds.",
    "Its stupid",
    "I said I didn't want an ad gave me one right after anyways",
    "I like this game",
    "Kul",
    "It's more like there is a game in the ads than ads in the game",
    "very cool",
    "drag race.... 👍👍👍",
    "ကိုသဲ",
    "this game wasting our time",
    "cool",
    "Awful, an ad after every race. Couldn't double, couldn't get another car that I bet. Just frustrating overall.",
    "Mythpat",
    "I don't want it again!",
    "Too many ads",
    "MORE ADDS"
];


const v1Approach = (text) => {

        // init
        const spellCorrector = new SpellCorrector();

        spellCorrector.loadDictionary('./dictionary.txt');

        // expand contractions - e.g. I'm -> I am
        const lexedReview = aposToLexForm(text);
        // console.log(lexedReview);
        // force to lower case
        const casedReview = lexedReview.toLowerCase();
        // console.log(casedReview);
        // remove non letters
        // const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
        // const alphaOnlyReview = casedReview;
        // console.log(alphaOnlyReview);
        // string sentence to array of words
        const { WordTokenizer } = natural;
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(casedReview);
        // console.log(tokenizedReview);
        // spell check each word
        tokenizedReview.forEach((word, index) => {
            tokenizedReview[index] = spellCorrector.correct(word);
        })
        
        // console.log(tokenizedReview);
        // console.log(filteredReview);
        // console.log(analysis);
        
        let result = isMatchedWord(tokenizedReview, casedReview);
        if (result.matches.length > 0) {
            // filter out stop words - e.g. but, a, what
            const filteredReview = SW.removeStopwords(tokenizedReview);
            // sentiment analysis
            var sentiment = new Sentiment();
            var options = {
                extras: {
                  'like': 0,
                }
              };
            var analysis = sentiment.analyze(casedReview, options);
            let modifiedResult = analysis.score + result.matches.value;
            console.log(text);
            console.log(modifiedResult);    // Sentiment
            console.log('MATCH');
            console.log(matches);
            console.log('________');
        }
    
}

const analyse = (text, keywords) => {
    try {
        const lexedReview = aposToLexForm(text);
        const casedReview = lexedReview.toLowerCase();
    
    
        const { WordTokenizer } = natural;
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(casedReview);
    
        return isMatchedWord(tokenizedReview, keywords);
        
    } catch (error) {
        console.log('error trying to analyse text:');
        console.log(text);
        console.log(error);
    }

}

const pullKeywords = async () => {
    const result = await database.getKeywordTargets();
    const keywords = [];
    result.forEach((row) => {
        if (!keywords.some(e => e.key === row.key)) {
            keywords.push({
                keywordId: row.keywordId,
                name: row.name,
                key: row.key,
                keywords: [],
                phrases: []
            });
        }
        let targetRow = keywords.find(e => e.key === row.key);
        if (row.isPhrase) {
            targetRow.phrases.push(row.target);
        } else {
            targetRow.keywords.push(row.target);
        }
    });
    // console.log(keywords);
    return keywords;
}

module.exports.main = async (reviews) => {
// const main = async () => {
    // const reviews = reviews1;
    const keywords = await pullKeywords();
    // console.log(keywords);

    let keywordCount = {};
    keywords.forEach((keyword) => {
        keywordCount[keyword.key] = {
            count: 0,
            id: keyword.keywordId
        }
    });
    // console.log(keywordCount);

    // console.log(keywords)
    const out = reviews.map((text) => {
        // console.log(keywords);
        
        const result = analyse(text, keywords);
        // console.log(result);
        return { text, result };
    
    });

    // console.log(out[0]);
    // console.log(keywordCount);
    out.forEach((review) => {
        for (const [key, value] of Object.entries(keywordCount)) {
            keywordCount[key].count += review.result[key];
        }
    })
    // console.log('keywordCount');   
    // console.log(keywordCount);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    // 56.85 MB
//     { grindy: { count: 1, id: 1 },
//   adverts: { count: 0, id: 2 },
//   lootboxes: { count: 0, id: 3 },
//   timers: { count: 1, id: 4 },
//   payToWin: { count: 4, id: 5 },
//   freeToPlay: { count: 1, id: 6 } }
    return keywordCount;

};

// main();


