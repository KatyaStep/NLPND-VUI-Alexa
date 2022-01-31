/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

// TODO: Add 10 facts each containing a four-digit year
const facts = [
    "October 4, 1957: First artificial satellite, Sputnik I, is launched by Soviet Union.",
    "April 12, 1961: Soviet cosmonaut Yuri Gagarin completes the first manned space flight, orbiting the Earth in 108 minutes.",
    "July 20, 1969: Man walks on the moon. Neil Armstrong and Edwin 'Buzz' Aldrin of Apollo XI spend 21 1/2 hours on the moon, 2 1/2 of those outside the capsule.",
    "Dec. 7-19, 1972: Apollo 17 mission that includes the longest and last stay of man on the moon—74 hours, 59 minutes—by astronauts Eugene Cernan and Harrison Schmitt.",
    "In 1877, Italian astronomer Giovanni Schiaparelli turned his telescope to Mars and saw signs of a potentially lush world.",
    "The German V2 was the first rocket to reach space in 1942",
    "In 1947, fruit flies were launched into space. Scientists wanted to see how they reacted to space travel",
    "In 1959, the Russian space craft, Luna 2, landed on the moon. It crashed at high speed. Fortunately, it was an unmanned craft with no astronauts inside.",
    "In 1963, the first woman, Valentina Tereshkova, entered space.",
    "In 1970, Apollo 13 was headed to the moon when an explosion on board caused serious problems. The astronauts fixed the problems with materials they had on hand and returned home safely."
];

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent';
  },
  handle(handlerInput) {
    const factArr = facts;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};




const GetNewYearFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewYearFactIntent');
  },
  handle(handlerInput) {
    const intent = handlerInput.requestEnvelope.request.intent;
    var returnRandomFact = false;

    // Check that we were provided with a year
    if ((typeof intent !== 'undefined') &&
        (typeof intent.slots !== 'undefined')&&
        (typeof intent.slots.FACT_YEAR !== 'undefined')){

          var year = handlerInput.requestEnvelope.request.intent.slots.FACT_YEAR.value

          var yearFacts = searchYearFact(facts, year)
          if (yearFacts.length > 0)
          {

            var randomFact = randomPhrase(yearFacts);

            // Create speech output
            var speechOutput =  randomFact;
          }
          else
            returnRandomFact = true
    }
    else
      returnRandomFact = true

    if (returnRandomFact){

      var factArr = facts;
      var randomFact = randomPhrase(factArr);
      var speechOutput = randomFact;
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};


function searchYearFact(facts, year){
  // Searches 'facts' for a fact containing a specific 'year'
  // Returns a list of facts for that year, or an empty array
  // if none is found.
  var yearsArr = [];
  for (var i = 0; i < facts.length; i++) {
      var yearFound = grepFourDigitNumber(facts[i], year);
      if (yearFound != null) {
          yearsArr.push(yearFound)
      }
  };
  return yearsArr
}

function grepFourDigitNumber(myString, year) {
  // Searches 'myString' for a specific 'year'
  var txt=new RegExp(year);
    if (txt.test(myString)) {
        return myString;
    }
    else {
        return null
    }
}


function randomPhrase(phraseArr) {
    // Returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};



const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'History Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a history fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    GetNewYearFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

exports.facts = facts
