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
  slideNumber--;
  if (slideNumber < 1) {
    slideNumber = 1;
    const temp = $("#previous").text();
    $("#previous").text("At first slide");
    $("#previous").effect(
      "shake",
      { distance: 5, times: 1 },
      1000,
      function () {
        $("#previous").text(temp);
      }
    );
    // cancel:
    return;
  }
  goToSlide(slideNumber);
}

function next() {
  slideNumber++;
  const previousSlideNumber = slideNumber - 1;
  addSlide(slideNumber, previousSlideNumber);
  if (slideNumber > numberOfSlides) {
    slideNumber = numberOfSlides;
    const temp = $("#next").text();
    $("#next").text("Last slide (this slide hasn't been edited)");
    $("#next").effect("shake", { distance: 5, times: 1 }, 1000, function () {
      $("#next").text(temp);
    });
    // cancel:
    return;
  }
  goToSlide(slideNumber);
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
  slideNumberElement.text(slideNumberTarget);
}

function goToSlide(slideNumber) {
  if (slideNumber > numberOfSlides) {
    slideNumber = numberOfSlides;
    return;
  } else if (slideNumber < 1) {
    slideNumber = 1;
    return;
  }
  $("#slides > div:not(#slide-" + slideNumber + ")").css("top", "100vh");
  $("#slide-" + slideNumber).css("top", "7.5%");
  $("#slide-number").text(slideNumber);
}

function addSlide(slideNumber, previousSlideNumber) {
  if (slideNumber <= numberOfSlides) return; // cancel
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
  if (!headerChanged && !textChanged && !imageAdded) return; //cancel
  numberOfSlides++;
  $("#slides").append(`
  <div id="slide-${numberOfSlides}">
    <h2 id="header-${numberOfSlides}" contenteditable>Type here</h2>
    <pre id="text-${numberOfSlides}" onchange="editText(${numberOfSlides})" contenteditable>Type here</pre>
    <img id="image-${numberOfSlides}" src="">
    <button id="image-button-add-${numberOfSlides}" class="ui secondary button add-image" onclick="addImage(${numberOfSlides})">Or choose an image</button>
    <button id="image-button-remove-${numberOfSlides}" class="ui secondary button" onclick="removeImage(${numberOfSlides})" style="display: none;">Remove image</button>
    <input id="image-input-${numberOfSlides}" onchange="readImage(${numberOfSlides}, this)" type="file" accept="image/*" style="visibility: hidden;"/>
  </div>
  `);
  setupHoverEffects();
}

function editText(slideNumber) {
  // '#text-' + slideNumber
  // '#image-' + slideNumber
}

function addImage(slideNumber) {
  // '#text-' + slideNumber
  // '#image-' + slideNumber
  $("#image-input-" + slideNumber).click();
}

function readImage(slideNumber, input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#image-" + slideNumber).attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    showImage(slideNumber);
  }
}

function removeImage(slideNumber) {
  $("#image-" + slideNumber).attr("src", "");
  hideImage(slideNumber);
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
