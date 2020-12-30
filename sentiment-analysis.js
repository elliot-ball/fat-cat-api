const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

// init
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

// define text
const text = "I'm the king 420. The single gratest King in all of the land.";
console.log(text);
// expand contractions - e.g. I'm -> I am
const lexedReview = aposToLexForm(text);
console.log(lexedReview);
// force to lower case
const casedReview = lexedReview.toLowerCase();
console.log(casedReview);
// remove non letters
const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
// const alphaOnlyReview = casedReview;
console.log(alphaOnlyReview);
// string sentence to array of words
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();
const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
console.log(tokenizedReview);
// spell check each word
tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
})
console.log(tokenizedReview);
// filter out stop words - e.g. but, a, what
const filteredReview = SW.removeStopwords(tokenizedReview);
console.log(filteredReview);
// sentiment analysis
const { SentimentAnalyzer, PorterStemmer } = natural;
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
const analysis = analyzer.getSentiment(filteredReview);
console.log(analysis);
