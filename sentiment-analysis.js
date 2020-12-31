const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

// init
const spellCorrector = new SpellCorrector();

spellCorrector.loadDictionary('./dictionary.txt');


// find keywords in reviews
function isMatchedWord (tokenizedReview, stringReview) {
    let match = false;
    let matches = [];
    const keyWords = [
        { name: 'grindy', words: ['grindy', 'grind'], phrases: [] },
        { name: 'adverts', words: ['advert', 'adverts', 'ad', 'ads', 'advertisement', 'advertisements'], phrases: [] },
        { name: 'lootboxes', words: ['lootbox', 'lootboxes', 'crate'], phrases: [] },
        { name: 'timers', words: ['wait', 'timers'], phrases: [] },
        { name: 'pay to win', words: ['p2w'], phrases: ['pay to win']},
        { name: 'free to play', words: ['f2p',], phrases: ['free to play'] },

    ];

    keyWords.forEach((keyWord) => {
        keyWord.words.forEach((word) => {
            tokenizedReview.forEach((token) => {
                // console.log(`${tokenizedReview} === ${word}`);
                if (token === word) {
                    match = true;
                    matches.push(keyWord.name);
                }
            });
        });
        keyWord.phrases.forEach((phrase) => {
            if (stringReview.indexOf(phrase) > 0) {
                match = true;
                matches.push(keyWord.name);
            }
        });
    });
    return matches;
};

// define text
// const text = "I'm the king 420. The single gratest King in all of the land.";
const reviews = [
    "Worst game I've ever played. Grindy and greedy. Everthing need gem, if not, you lose everytime or wait for years so you can get the card you want. Even so, the chance of win is small. Event sucks ass, too many strong AI opponent too with little to no worthy rewards. Event exclusive cards and character, because if you don't play this game long enough then f u. Whales everywhere. Cancerous community, especially Indonesian. Go play offline games, or if you love ygo just play offline ygo tcg",
    "Very bad game, lost all my data spent hours over hours playing and they won't even help me get my data back I wouldn't recommend this game at all, its also a pay to win game.",
    "Love how you can have fun even as a f2p",
    "Too pay to win",
    "Pay to win , you need 50k gems for a complete competitive deck (2000$).",
];

const unhelpfulReviews = [
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
reviews.forEach((text) => {

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
    // filter out stop words - e.g. but, a, what
    const filteredReview = SW.removeStopwords(tokenizedReview);
    // sentiment analysis
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);
    
    console.log(text);
    console.log(tokenizedReview);
    console.log(filteredReview);
    console.log(analysis);

    let matches = isMatchedWord(tokenizedReview, casedReview);
    if (matches.length > 0) {
        console.log('MATCH');
        console.log(matches);
    }

    console.log('________')

});

