$('#engAnn').on('input', function() {
  setNormalStyle('engAnn');
  suggestTranslation();
});

$('#chAnn').on('input', function() {
  setNormalStyle('chAnn');
  suggestTranslation();
});

let translationTimer = null;
let translationsInARow = 0;
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
  const onlyEnglishNoChinese = $('#engAnn').val() !== '' && !$('#chAnn').val();
  const onlyChineseNoEnglish = $('#chAnn').val() !== '' && !$('#engAnn').val();
  if (onlyEnglishNoChinese) {
    translate($('#engAnn').val(), 'en', 'zh-tw', 'chAnn');
    setSuggestionStyle('chAnn');
  } else if (onlyChineseNoEnglish) {
    translate($('#chAnn').val(), 'zh-tw', 'en', 'engAnn');
    setSuggestionStyle('engAnn');
  }
}

function translate(text, sourceLanguage, targetLanguage, elementId) {
  if (!translationTimer) return;
  let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd';
  url += '&sl=' + encodeURIComponent(sourceLanguage);
  url += '&tl=' + encodeURIComponent(targetLanguage);
  url += '&q=' + encodeURIComponent(text);
  return fetch(url)
    .then((response) => response.json())
    .then((response) => {
      let result = response[0].map(value => value[0]).join('');
      if (!$('#' + elementId.replace('#', '')).val()) {
        $('#' + elementId.replace('#', '')).val(result);
      }
      return result;
    });
}

function setNormalStyle(elementId) {
  const normalFontColor = 'black';
  $('#' + elementId.replace('#', '')).css('color', normalFontColor);
}

function setSuggestionStyle(elementId) {
  const fadedFontColor = '#aaa';
  $('#' + elementId.replace('#', '')).css('color', fadedFontColor);
}
