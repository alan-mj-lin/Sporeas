let slideNumber = 1;
let numberOfSlides = 1;

setup();

function setup() {
  const slidesInfo = JSON.parse(sessionStorage.getItem("slidesInfo"));
  const englishTitle = slidesInfo.englishTitle || "Type here";
  const chineseTitle = slidesInfo.chineseTitle || "在此輸入";
  const hymns = slidesInfo.hymns || "";
  $("#english-title").text("Title: " + englishTitle);
  $("#chinese-title").text("主題: " + chineseTitle);
  $("#hymns").text("讚美詩 Hymn: " + hymns);
  setupHoverEffects();
}

function setupHoverEffects() {
  const snackbar = $("#snackbar");
  $("h1, h2, h3, pre")
    .attr("contenteditable", true)
    .attr("title", "Click to edit")
    .off("mouseover")
    .on("mouseover", function () {
      $(this).addClass("editable");
      snackbar.addClass("show");
    })
    .off("mouseleave")
    .on("mouseleave", function () {
      $(this).removeClass("editable");
      snackbar.removeClass("show");
    });
}

function previous() {
  const previousSlideNumber = slideNumber;
  slideNumber--;
  if (slideNumber < 1) {
    slideNumber = 1;
    // cancel:
    return;
  }
  goToSlide(slideNumber, previousSlideNumber);
}

function next() {
  const previousSlideNumber = slideNumber;
  slideNumber++;
  addSlide(slideNumber);
  if (slideNumber > numberOfSlides) {
    slideNumber = numberOfSlides;
    // cancel:
    return;
  }
  goToSlide(slideNumber, previousSlideNumber);
}

function jumpToSlideNumberTyped() {
  const slideNumberElement = $("#slide-number");
  let slideNumberTarget = slideNumberElement.text();
  if (isNaN(slideNumberTarget)) return;
  goToSlide(slideNumberTarget);
  if (slideNumberTarget > numberOfSlides) {
    slideNumberTarget = numberOfSlides;
  } else if (slideNumberTarget < 1) {
    slideNumberTarget = 1;
  }
  slideNumber = slideNumberTarget;
}

function goToSlide(slideNumber) {
  if (slideNumber > numberOfSlides) {
    slideNumber = numberOfSlides;
    return;
  } else if (slideNumber < 1) {
    slideNumber = 1;
    return;
  }

  if (slideNumber === numberOfSlides) {
    $("#next").text("＋ Add slide");
  } else {
    $("#next").text("▶ Next slide");
  }

  enableControlButtons(slideNumber);

  $("#slides > div:not(#slide-" + slideNumber + ")").css("top", "100vh");
  $("#slide-" + slideNumber).css("top", "7.5%");
  $("#slide-number").text(slideNumber);
}

function enableControlButtons(slideNumber) {
  // previous:
  const previous = $("#previous");
  if (slideNumber === 1) {
    previous.attr("disabled", true);
  } else {
    previous.attr("disabled", false);
  }

  // next:
  const next = $("#next");
  if (slideNumber === 1 || isSlideEdited(slideNumber)) {
    next.css("display", "block");
  } else if (slideNumber < numberOfSlides) {
    // if not edited but between other slides that might be:
    next.css("display", "block");
  } else {
    // > 1 and not edited:
    next.css("display", "none");
  }
}

function isSlideEdited(previousSlideNumber) {
  const previousSlide = $("#slide-" + previousSlideNumber);
  const headerChanged =
    previousSlide.find("#header-" + previousSlideNumber).text() !== "Type here";
  const textChanged =
    previousSlide.find("#text-" + previousSlideNumber).text() !== "Type here";
  const previousImgSrc = previousSlide
    .find("#image-" + previousSlideNumber)
    .attr("src");
  const imageAdded =
    typeof previousImgSrc === "undefined" || previousImgSrc !== "";
  console.log(headerChanged);
  console.log(textChanged);
  console.log(imageAdded);
  return headerChanged || textChanged || imageAdded;
}

function addSlide(slideNumber) {
  if (slideNumber <= numberOfSlides) return; // cancel
  numberOfSlides++;
  $("#slides").append(`
  <div id="slide-${numberOfSlides}">
    <h2 id="header-${numberOfSlides}" contenteditable>Type here</h2>
    <pre id="text-${numberOfSlides}" onkeyup="editText(${numberOfSlides})" contenteditable>Type here</pre>
    <img id="image-${numberOfSlides}" src="">
    <button id="image-button-add-${numberOfSlides}" class="ui secondary button add-image" onclick="addImage(${numberOfSlides})">Or choose an image</button>
    <button id="image-button-remove-${numberOfSlides}" class="ui secondary button" onclick="removeImage(${numberOfSlides})" style="display: none;">Remove image</button>
    <input id="image-input-${numberOfSlides}" onchange="readImage(${numberOfSlides}, this)" type="file" accept="image/*" style="visibility: hidden;"/>
  </div>
  `);
  setupHoverEffects();
  $("#next").css("display", "none");
}

function editText(slideNumber) {
  if (isSlideEdited(slideNumber) || slideNumber < numberOfSlides) {
    $("#next").css("display", "block");
  } else {
    $("#next").css("display", "none");
  }

  if (isSlideEdited(slideNumber)) {
    $("#image-button-add-" + slideNumber).css("display", "none");
  } else {
    $("#image-button-add-" + slideNumber).css("display", "block");
  }
}

function addImage(slideNumber) {
  $("#image-input-" + slideNumber).click();
  if (isSlideEdited(slideNumber) || slideNumber < numberOfSlides) {
    $("#next").css("display", "block");
  } else {
    $("#next").css("display", "none");
  }
}

function readImage(slideNumber, input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#image-" + slideNumber).attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    showImage(slideNumber);
    $("#next").css("display", "block");
  }
}

function removeImage(slideNumber) {
  $("#image-" + slideNumber).attr("src", "");
  hideImage(slideNumber);
  if (isSlideEdited(slideNumber)) {
    $("#next").css("display", "block");
  } else {
    $("#next").css("display", "none");
  }
}

function showImage(slideNumber) {
  $("#image-" + slideNumber).css("display", "block");
  $("#image-button-add-" + slideNumber).css("display", "none");
  $("#image-button-remove-" + slideNumber).css("display", "block");
  $("#header-" + slideNumber).css("display", "none");
  $("#text-" + slideNumber).css("display", "none");
}

function hideImage(slideNumber) {
  $("#image-" + slideNumber).css("display", "none");
  $("#image-button-add-" + slideNumber).css("display", "block");
  $("#image-button-remove-" + slideNumber).css("display", "none");
  $("#header-" + slideNumber).css("display", "block");
  $("#text-" + slideNumber).css("display", "block");
}

const reader = new FileReader();
const fileInput = document.getElementById("file");
const img = document.getElementById("img");
reader.onload = (e) => {
  img.src = e.target.result;
};
fileInput.addEventListener("change", (e) => {
  const f = e.target.files[0];
  reader.readAsDataURL(f);
});
