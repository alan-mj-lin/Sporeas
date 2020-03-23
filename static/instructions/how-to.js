const onAdminPage = window.location.href.endsWith('/admin');
const onHowToPage = window.location.href.endsWith('/how-to');
const whichTour = localStorage.getItem('sporeas-tour');
let tourObject;

if (onAdminPage && whichTour) {
  setTimeout(() => {
    startTour();
  }, 500);
} else if (onHowToPage) {
  $(document).ready(function() {
    mapHowToPageButtons();
  });
}

function mapHowToPageButtons() {
  const howToSectionIds = [
    'morning-prayer',
    'hymn-singing',
    'service',
    'verse-display',
    'announcements',
    'dark-mode',
  ];
  for (let i = 0; i < howToSectionIds.length; i++) {
    const sectionId = howToSectionIds[i];
    const siblingButton = 'a#' + sectionId + ' + button';
    $(siblingButton).click(function() {
      const tourId = sectionId;
      localStorage.setItem('sporeas-tour', tourId);
      window.location.href = '/admin';
    })
  }
}

function startTour() {
  const whichTour = localStorage.getItem('sporeas-tour');
  initializeTour(whichTour);
  simulateClickableArea();
}

function backAStepInTour() {
  simulateClickableArea();
  localStorage.removeItem('sporeas-tour');
  tourObject.back();
}

function nextStepInTour() {
  simulateClickableArea();
  localStorage.removeItem('sporeas-tour');
  tourObject.next();
}

function endTour() {
  alert("Now it's up to you.\n\nThis new tab was just a demo.\n\nIt will automatically close after you hit OK.");
  localStorage.removeItem('sporeas-tour');
  cleanUpClones();
  tourObject.complete();
  window.close();
}

function initializeTour(whichTour) {
  tourObject = new Shepherd.Tour({
    defaultStepOptions: {
      classes: 'shepherd-theme-custom',
      scrollTo: true,
      useModalOverlay: true,
      keyboardNavigation: false,
      shepherdElementZIndex: 3,
    }
  });
  addTourSteps(tourObject, whichTour);
  tourObject.start();
}

function addTourSteps(tourObject, whichTour) {
  if (whichTour === 'morning-prayer') {
    morningPrayerTourSteps(tourObject);
  } else if (whichTour === 'hymn-singing') {
    hymnSingingTourSteps(tourObject);
  } else if (whichTour === 'service') {
    serviceTourSteps(tourObject);
  } else if (whichTour === 'verse-display') {
    verseDisplayTourSteps(tourObject);
  } else if (whichTour === 'announcements') {
    announcementsTourSteps(tourObject);
  } else if (whichTour === 'dark-mode') {
    darkModeTourSteps(tourObject);
  }
}

function morningPrayerTourSteps(tourObject) {
  $('a[data-tab="utility"]').click();
  tourObject.addStep({
    text: 'Click on the "Utility" tab.',
    attachTo: { element: 'a[data-tab="utility"]', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in hymn numbers next to the button labelled "Morning Prayer" (please click in the input box).',
    attachTo: { element: '#m_hymn_input', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the "Morning Prayer" button.',
    attachTo: { element: '#morning_prayer', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Now you would go to the projection page to see it update live (example: http://127.0.0.1:9000/toronto). <br/><br/>Otherwise go back to the "Main" tab and hit the "New Window" button.',
    buttons: [
      { text: '🛑 End', action: endTour },
    ]
  });
}

function hymnSingingTourSteps(tourObject) {
  $('a[data-tab="utility"]').click();
  tourObject.addStep({
    text: 'Click on the "Utility" tab.',
    attachTo: { element: 'a[data-tab="utility"]', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in hymn numbers next to the button labelled "Hymn Singing" (please click in the input box).',
    attachTo: { element: '#hymn_input', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the "Hymn Singing" button.',
    attachTo: { element: '#hymn_singing', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Now you would go to the projection page to see it update live (example: http://127.0.0.1:9000/toronto). <br/><br/>Otherwise go back to the "Main" tab and hit the "New Window" button.',
    buttons: [
      { text: '🛑 End', action: endTour },
    ]
  });
}

function serviceTourSteps(tourObject) {
  tourObject.addStep({
    text: 'Click on the "Main" tab.',
    attachTo: { element: '#mainitem', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the English Title (please click in the input box).',
    attachTo: { element: '#title', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the Chinese Title (please click in the input box).',
    attachTo: { element: '#ch_title', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the Hymns (please click in the input box).',
    attachTo: { element: '#hymn', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'And finally, hit the "Submit" button.',
    attachTo: { element: '#update button[type="submit"]', on: 'bottom' },
    buttons: [
      { text: '🛑 End', action: endTour },
    ]
  });
}

function verseDisplayTourSteps(tourObject) {
  $('a[data-tab="utility"]').click();
  tourObject.addStep({
    text: 'Click on the "Utility" tab.',
    attachTo: { element: 'a[data-tab="utility"]', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would click on the toggle button (which is "Off" by default) to enable/disable Verse Display.',
    attachTo: { element: '#toggle', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Now you would go to the projection page to see it update live (example: http://127.0.0.1:9000/toronto). <br/><br/>Otherwise go back to the "Main" tab and hit the "New Window" button. <br/><br/>While on the projection page, hit the spacebar button on your keyboard to show/hide the verse overlay.',
    buttons: [
      { text: '🛑 End', action: endTour },
    ]
  });
}

function announcementsTourSteps(tourObject) {
  $('a[data-tab="announcements"]').click();
  tourObject.addStep({
    text: 'Click on the "Announcements" tab.',
    attachTo: { element: 'a[data-tab="announcements"]', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the English announcement (please click in the input box).',
    attachTo: { element: '#engAnn', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the Chinese announcement (please click in the input box).',
    attachTo: { element: '#chAnn', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would select a Department (please click on the dropdown button).',
    attachTo: { element: '#department-area', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the "Clear" button to start from an empty list of announcements.',
    attachTo: { element: '#clear_announce', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the "Add" button to add the announcement to the projection.',
    attachTo: { element: '#add_announce', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would select a Book (please click on the dropdown button).',
    attachTo: { element: '#bible-reading-area', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the chapter/verse, like 12:34-56 (please click in the input box).',
    attachTo: { element: '#bible_reading', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would select a Cleaning Group (please click on the dropdown button).',
    attachTo: { element: '#cleaning-group-area', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'You would type in the names of the people doing Dish Washing (please click in the input box).',
    attachTo: { element: '#dish_washing', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the "Update" button to update the footer of the projection.',
    attachTo: { element: '#ann_update', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Now you would go to the projection page to see it update live (example: http://127.0.0.1:9000/toronto). <br/><br/>Otherwise go back to the "Main" tab and hit the "New Window" button. <br/><br/>While on the projection page, hit the spacebar button on your keyboard to show/hide the verse overlay.',
    buttons: [
      { text: '🛑 End', action: endTour },
    ]
  });
}

function darkModeTourSteps(tourObject) {
  $('a[data-tab="utility"]').click();
  tourObject.addStep({
    text: 'To find the "Dark Mode" button, click on the "Utility" tab.',
    attachTo: { element: 'a[data-tab="utility"]', on: 'bottom' },
    buttons: [
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
  tourObject.addStep({
    text: 'Hit the toggle button that enables/disables Dark Mode.',
    attachTo: { element: '#toggle-dark-mode-button', on: 'bottom' },
    buttons: [
      { text: '◁ Back', action: backAStepInTour },
      // { text: '▶ Next', action: nextStepInTour },
      { text: '🛑 End', action: endTour },
    ]
  });
}

function cleanUpClones() {
  $('.shepherd-target.clone').remove();
}

function simulateClickableArea() {
  setTimeout(() => {
    // get position and size info before creating clone
    const targetArea = $('.shepherd-target');
    // if (!targetArea.is('body')) return;
    const positionInfo = $('.shepherd-target').offset();
    const left = positionInfo.left;
    const top = positionInfo.top;
    const outerWidth = targetArea.outerWidth();
    const outerHeight = targetArea.outerHeight();
    // create an invisible overlay that the user can click
    cleanUpClones();
    const computedStyles = getComputedStyles(document.querySelector('.shepherd-target'));
    const clickableArea = $('.shepherd-target').clone().addClass('clone');
    clickableArea.css({
      ...computedStyles,
      ...{
        position: 'absolute',
        left: left,
        top: top,
        width: outerWidth,
        height: outerHeight,
        zIndex: '9999'
      }
    });
    // add clickable area to body to escape having to fight parent z-index and stacking
    clickableArea.appendTo(document.body);
    clickableArea.click(function() {
      const atLastStep = tourObject.steps.indexOf(tourObject.currentStep) === tourObject.steps.length - 1;
      if (atLastStep) {
        endTour();
      } else {
        nextStepInTour();
      }
      simulateClickableArea();
    });
  }, 250);
}

function getComputedStyles(element) {
  const computedStylesMap = window.getComputedStyle(element, null);
  const computedStyles = {};
  for (let i = 0; i < computedStylesMap.length; i++) {
    const property = computedStylesMap.item(i);
    const propertyValue = computedStylesMap.getPropertyValue(property);
    let camelCaseProperty = '';
    for (let j = 0; j < property.length; j++) {
      if (property[j] === '-' && j === 0) {
        j++;
        camelCaseProperty += property[j];
      } else if (property[j] === '-' && j > 0) {
        j++;
        camelCaseProperty += property[j].toUpperCase();
      } else {
        camelCaseProperty += property[j];
      }
    }
    computedStyles[camelCaseProperty] = propertyValue;
  }
  return computedStyles;
}
