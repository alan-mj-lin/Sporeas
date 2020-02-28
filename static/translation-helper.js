const normalFontColor = 'rgb(0, 0, 0)'; // black
const fadedFontColor = 'rgb(170, 170, 170)'; // a grey (NOTE: used in jQuery color check)

let translationTimer = null;
let translationsInARow = 0;

$('#engAnn').on('input', function() {
  suggestTranslation();
  setNormalStyle('#engAnn');
  hideEnglishSuggestionNote();
});

$('#chAnn').on('input', function() {
  suggestTranslation();
  setNormalStyle('#chAnn');
  hideChineseSuggestionNote();
});

function suggestTranslation() {
  // delay translations to avoid getting blocked
  let delay = 2000;
  translationsInARow++;
  if (translationsInARow % 10 === 0) delay = 15000;
  clearTimeout(translationTimer); // so sends when user stops typing
  translationTimer = setTimeout(function() {
    fillInTheOtherLanguage();
  }, delay);
}

function fillInTheOtherLanguage() {
  const onlyEnglishNoChinese = ($('#engAnn').val() !== '') && !$('#chAnn').val();
  const onlyChineseNoEnglish = ($('#chAnn').val() !== '') && !$('#engAnn').val();
  const englishTranslationSuggested = ($('#engAnn').css('color') === fadedFontColor);
  const chineseTranslationSuggested = ($('#chAnn').css('color') === fadedFontColor);
  if ((onlyEnglishNoChinese && !englishTranslationSuggested) || chineseTranslationSuggested) {
    translate($('#engAnn').val(), 'en', 'zh-tw', '#chAnn');
    setSuggestionStyle('#chAnn');
    showChineseSuggestionNote();
    hideEnglishSuggestionNote();
  } else if ((onlyChineseNoEnglish && !chineseTranslationSuggested) || englishTranslationSuggested) {
    translate($('#chAnn').val(), 'zh-tw', 'en', '#engAnn');
    setSuggestionStyle('#engAnn');
    showEnglishSuggestionNote();
    hideChineseSuggestionNote();
  }
}

function translate(text, sourceLanguage, targetLanguage, selector) {
  if (!translationTimer) return;
  let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd';
  url += '&sl=' + encodeURIComponent(sourceLanguage);
  url += '&tl=' + encodeURIComponent(targetLanguage);
  url += '&q=' + encodeURIComponent(text);
  return fetch(url)
    .then(function(response) {return response.json();})
    .then(function(response) {
      const translationSuggestion = response[0].map(value => value[0]).join('');
      // if (!$(selector).val()) {
        $(selector).val(translationSuggestion);
      // }
      return translationSuggestion;
    });
}

function setNormalStyle(selector) {
  $(selector).css('color', normalFontColor);
}

function setSuggestionStyle(selector) {
  $(selector).css('color', fadedFontColor);
}

function showEnglishSuggestionNote() {
  const hoverMessage = 'English - Draft translation automatically added. Edit before projecting.';
  $('label:contains("English")').text(hoverMessage);
}

function showChineseSuggestionNote() {
  const hoverMessage = 'Chinese - Draft translation automatically added. Edit before projecting.';
  $('label:contains("Chinese")').text(hoverMessage);
}

function hideEnglishSuggestionNote() {
  $('label:contains("English")').text('English');
}

function hideChineseSuggestionNote() {
  $('label:contains("Chinese")').text('Chinese');
}
