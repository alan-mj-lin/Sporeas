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
    translate($('#engAnn').val(), from='en', to='zh-tw', 'span.chAnnSuggestion', suggestReplacementTranslation);
    hideSuggestionNote(targetLanguageCode='en');
    hideSuggestionNote(targetLanguageCode='zh-tw');
  } else if (englishFilled && chineseFilled && editedLanguage === 'Chinese') {
    translate($('#chAnn').val(), from='zh-tw', to='en', 'span.engAnnSuggestion', suggestReplacementTranslation);
    hideSuggestionNote(targetLanguageCode='en');
    hideSuggestionNote(targetLanguageCode='zh-tw');
  }
}

function translate(text, from, to, targetSelector, callback) {
  if (!translationTimer) return;
  let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd';
  url += '&sl=' + encodeURIComponent(from);
  url += '&tl=' + encodeURIComponent(to);
  url += '&q=' + encodeURIComponent(text);
  return fetch(url)
    .then(function(response) {return response.json();})
    .then(function(response) {
      const translationSuggestion = response[0].map(value => value[0]).join('');
      $(targetSelector).val(translationSuggestion);
      $(targetSelector).text(translationSuggestion);
      if (callback) callback(to);
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

function suggestReplacementTranslation(targetLanguageCode) {
  let langTgt = '';
  let langSrc = '';
  if (targetLanguageCode === 'zh-tw') {
    langTgt = 'ch';
    langSrc = 'eng';
  } else if (targetLanguageCode === 'en') {
    langTgt = 'eng';
    langSrc = 'ch';
  }
  const noChange = String($('#' + langTgt + 'Ann').val()) === String($('span.' + langTgt + 'AnnSuggestion').text());
  if (noChange) {
    $('span.' + langTgt + 'AnnSuggestion').text('');
    $('button.' + langTgt + 'AnnSuggestion').css('display', 'none');
    hideSuggestionNote(targetLanguageCode);
    return;
  }
  $('button.' + langTgt + 'AnnSuggestion')
    .css('display', 'block')
    .off('click')
    .on('click', function() {
      $('#' + langTgt + 'Ann').val($('span.' + langTgt + 'AnnSuggestion').text());
      $('span.' + langTgt + 'AnnSuggestion').text('');
      $('button.' + langTgt + 'AnnSuggestion').css('display', 'none');
    });
  $('button.' + langSrc + 'AnnSuggestion').css('display', 'none');
  hideSuggestionNote(targetLanguageCode);
}
