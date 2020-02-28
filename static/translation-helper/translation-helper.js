const normalFontColor = 'rgb(0, 0, 0)'; // black
const fadedFontColor = 'rgb(170, 170, 170)'; // a grey (NOTE: used in jQuery color check)

let translationTimer = null;
let translationsInARow = 0;

$('#engAnn').on('input', function() {
  suggestTranslation(editedLanguage='English');
  setNormalStyle('#engAnn');
  hideSuggestionNote(targetLanguageCode='en')
});

$('#chAnn').on('input', function() {
  suggestTranslation(editedLanguage='Chinese');
  setNormalStyle('#chAnn');
  hideSuggestionNote('zh-tw')
});

function suggestTranslation(editedLanguage) {
  // delay translations to avoid getting blocked
  let delay = 2000;
  translationsInARow++;
  if (translationsInARow % 10 === 0) delay = 15000;
  clearTimeout(translationTimer); // so sends when user stops typing
  translationTimer = setTimeout(function() {
    fillInTheOtherLanguage(editedLanguage);
  }, delay);
}

function fillInTheOtherLanguage(editedLanguage) {
  const englishFilled = $('#engAnn').val() !== '';
  const chineseFilled = $('#chAnn').val() !== '';
  const englishTranslationSuggested = ($('#engAnn').css('color') === fadedFontColor);
  const chineseTranslationSuggested = ($('#chAnn').css('color') === fadedFontColor);
  if ((englishFilled && !chineseFilled && !englishTranslationSuggested) || chineseTranslationSuggested) {
    translate($('#engAnn').val(), from='en', to='zh-tw', '#chAnn');
    setSuggestionStyle('#chAnn');
    showSuggestionNote(targetLanguageCode='zh-tw');
    hideSuggestionNote(targetLanguageCode='en');
    $('button.engAnnSuggestion').css('display', 'none');
    $('button.chAnnSuggestion').css('display', 'none');
  } else if ((chineseFilled && !englishFilled && !chineseTranslationSuggested) || englishTranslationSuggested) {
    translate($('#chAnn').val(), from='zh-tw', to='en', '#engAnn');
    setSuggestionStyle('#engAnn');
    showSuggestionNote(targetLanguageCode='en');
    hideSuggestionNote(targetLanguageCode='zh-tw');
    $('button.engAnnSuggestion').css('display', 'none');
    $('button.chAnnSuggestion').css('display', 'none');
  } else if (englishFilled && chineseFilled && editedLanguage === 'English') {
    translate($('#engAnn').val(), from='en', to='zh-tw', 'span.chAnnSuggestion', suggestLineReplacementTranslation);
    hideSuggestionNote(targetLanguageCode='en');
    hideSuggestionNote(targetLanguageCode='zh-tw');
  } else if (englishFilled && chineseFilled && editedLanguage === 'Chinese') {
    translate($('#chAnn').val(), from='zh-tw', to='en', 'span.engAnnSuggestion', suggestLineReplacementTranslation);
    hideSuggestionNote(targetLanguageCode='en');
    hideSuggestionNote(targetLanguageCode='zh-tw');
  }
}

function translate(text, sourceLanguage, targetLanguage, targetSelector, callback) {
  if (!translationTimer) return;
  let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd';
  url += '&sl=' + encodeURIComponent(sourceLanguage);
  url += '&tl=' + encodeURIComponent(targetLanguage);
  url += '&q=' + encodeURIComponent(text);
  return fetch(url)
    .then(function(response) {return response.json();})
    .then(function(response) {
      const translationSuggestion = response[0].map(function(value) {
        return value[0];
      }).join('');
      $(targetSelector).val(translationSuggestion);
      $(targetSelector).text(translationSuggestion);
      if ($(targetSelector).is('[data-full-suggestion]')) {
        $(targetSelector).attr('data-full-suggestion', translationSuggestion);
      }
      if (callback) callback(targetLanguage);
      return translationSuggestion;
    });
}

function setNormalStyle(selector) {
  $(selector).css('color', normalFontColor);
}

function setSuggestionStyle(selector) {
  $(selector).css('color', fadedFontColor);
}

function showSuggestionNote(targetLanguageCode) {
  if (targetLanguageCode === 'zh-tw') {
    const hoverMessage = 'Chinese - Draft translation automatically added. Edit before projecting.';
    $('label:contains("Chinese")').text(hoverMessage);
  } else if (targetLanguageCode === 'en') {
    const hoverMessage = 'English - Draft translation automatically added. Edit before projecting.';
    $('label:contains("English")').text(hoverMessage);
  }
}

function hideSuggestionNote(targetLanguageCode) {
  if (targetLanguageCode === 'zh-tw') {
    $('label:contains("Chinese")').text('Chinese');
  } else if (targetLanguageCode === 'en') {
    $('label:contains("English")').text('English');
  }
}

function suggestLineReplacementTranslation(targetLanguageCode) {
  let langSrc = '';
  let langTgt = '';
  if (targetLanguageCode === 'zh-tw') {
    langSrc = 'eng';
    langTgt = 'ch';
  } else if (targetLanguageCode === 'en') {
    langSrc = 'ch';
    langTgt = 'eng';
  }
  const noChange = String($('#' + langTgt + 'Ann').val()) === String($('span.' + langTgt + 'AnnSuggestion').attr('data-full-suggestion'));
  if (noChange) {
    $('button.' + langTgt + 'AnnSuggestion').css('display', 'none');
    $('span.' + langTgt + 'AnnSuggestion').text('');
    $('span.' + langTgt + 'AnnSuggestion').attr('data-full-suggestion', '');
    hideSuggestionNote(targetLanguageCode);
    return;
  }
  const suggestionOverride = getOneLineChange(langSrc, langTgt);
  setUpLineSuggestionButton(langSrc, langTgt, suggestionOverride);
  hideSuggestionNote(targetLanguageCode);
}

/**
 * Replace just one line of the target language translation (instead of multiple lines at once).
 * suggestionOverride should contain all of the original lines, with just one line added/changed.
 */
function getOneLineChange(langSrcPrefix, langTgtPrefix) {
  let suggestionOverride = '';
  const sourceArray = $('#' + langSrcPrefix + 'Ann').val().split('\n');
  const targetArray = $('#' + langTgtPrefix + 'Ann').val().split('\n');
  const fullTranslation = $('span.' + langTgtPrefix + 'AnnSuggestion').attr('data-full-suggestion').split('\n');
  if (fullTranslation.length > targetArray.length + 1) {
    return; // escape if something weird is happening
  }
  if (fullTranslation.length === targetArray.length + 1) {
    // add new last line to target:
    suggestionOverride = [];
    for (let i = 0; i < targetArray.length; i++) {
      suggestionOverride[i] = targetArray[i];
    }
    suggestionOverride[fullTranslation.length - 1] = fullTranslation[fullTranslation.length - 1];
    suggestionOverride = suggestionOverride.join('\n');
  } else if (fullTranslation.length === targetArray.length) {
    // if edited a line in the middle, use suggestions starting from the bottom:
    const diffIndices = getLineDiffIndices(fullTranslation, targetArray);
    suggestionOverride = applyLastDiff(fullTranslation, targetArray, diffIndices);
  }
  return suggestionOverride;
}

function getLineDiffIndices(fullTranslationArray, targetArray) {
  const numberOfLines = Math.min(fullTranslationArray.length, targetArray.length);
  const diffIndices = [];
  for (let i = 0; i < numberOfLines; i++) {
    if (fullTranslationArray[i] !== targetArray[i]) {
      diffIndices.push(i);
    }
  }
  return diffIndices;
}

function applyLastDiff(fullTranslationArray, targetArray, diffIndices) {
  const i = diffIndices[diffIndices.length - 1];
  targetArray[i] = fullTranslationArray[i];
  return targetArray.join('\n');
}

function setUpLineSuggestionButton(langSrcPrefix, langTgtPrefix, suggestionOverride) {
  // set up full suggestion:
  const suggestion = suggestionOverride || $('span.' + langTgtPrefix + 'AnnSuggestion').attr('data-full-suggestion');
  $('span.' + langTgtPrefix + 'AnnSuggestion').attr('data-full-suggestion', suggestion);
  // set up text of just the one line diff:
  const fullTranslation = suggestion.split('\n');
  const targetArray = $('#' + langTgtPrefix + 'Ann').val().split('\n');
  const diffIndices = getLineDiffIndices(fullTranslation, targetArray);
  const lastDiffIndex = (diffIndices.length > 0) ? diffIndices[diffIndices.length - 1] : -1;
  const lastDiffSuggestion = (diffIndices.length > 0) ? fullTranslation[lastDiffIndex] : fullTranslation[fullTranslation.length - 1];
  $('span.' + langTgtPrefix + 'AnnSuggestion').text(lastDiffSuggestion);
  // set up display of line number of diff:
  const lineNumberMessage = (lastDiffIndex > -1) ? ' on line ' + (lastDiffIndex + 1) : '';
  $('span.' + langTgtPrefix + 'AnnSuggestion-line').text(lineNumberMessage);
  // set up button click listener:
  $('button.' + langTgtPrefix + 'AnnSuggestion')
    .css('display', 'block')
    .off('click')
    .on('click', function() {
      const suggestion = $('span.' + langTgtPrefix + 'AnnSuggestion').attr('data-full-suggestion');
      $('#' + langTgtPrefix + 'Ann').val(suggestion);
      $('button.' + langTgtPrefix + 'AnnSuggestion').css('display', 'none');
      $('span.' + langTgtPrefix + 'AnnSuggestion').text('');
      $('span.' + langTgtPrefix + 'AnnSuggestion-line').text('');
      $('span.' + langTgtPrefix + 'AnnSuggestion').attr('data-full-suggestion', '');
    });
  // make the SOURCE language button disappear:
  $('button.' + langSrcPrefix + 'AnnSuggestion').css('display', 'none');
}
