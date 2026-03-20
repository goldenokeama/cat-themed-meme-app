import { catsData } from "/data.js";

const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyOption = document.getElementById("gifs-only-option");
const memeModal = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");

const mainImg = document.getElementById("current-image");

document.addEventListener("click", function (event) {
  if (!memeModal.contains(event.target)) {
    closeModal();
  }
});

emotionRadios.addEventListener("change", highlightCheckedOption);

memeModalCloseBtn.addEventListener("click", closeModal);

getImageBtn.addEventListener("click", openGalleryModal);

function highlightCheckedOption(e) {
  // removing the disabled style from the button
  getImageBtn.disabled = false;

  const radios = document.getElementsByClassName("radio");
  for (let radio of radios) {
    radio.classList.remove("highlight");
  }
  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

function closeModal() {
  memeModal.style.display = "none";
}

function updateActiveImage(catObject, clickedThumbnail) {
  // Find the current active thumb and strip its active class
  const currentActiveThumbnail = document.querySelector(
    ".thumbnail-grid img.active"
  );
  if (currentActiveThumbnail) {
    currentActiveThumbnail.classList.remove("active");
  }

  // Add the active class to the thumbnail we just clicked
  clickedThumbnail.classList.add("active");

  mainImg.src = `./images/${catObject.image}`;
  mainImg.alt = `${catObject.alt}`;
}

function openGalleryModal(e) {
  // stopping the click event from bubbling up to the document and closing the modal
  e.stopPropagation();

  const thumbContainer = document.getElementById("thumbnail-container");

  const catsArray = getMatchingCatsArray();

  // Set the initial large image
  const catObject = catsArray[0];

  mainImg.src = `./images/${catObject.image}`;
  mainImg.alt = `${catObject.alt}`;

  // Clear previous thumbnails
  thumbContainer.innerHTML = "";

  // Conditional Rendering: Only build thumbnails if there's more than one
  if (catsArray.length > 1) {
    catsArray.forEach((catObject, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = `./images/${catObject.image}`;
      thumbnail.alt = `${catObject.alt}`;

      // make the thumbnail focusable via the Tab key
      thumbnail.tabIndex = 0;

      // adding the active class to the first thumbnail
      if (index === 0) thumbnail.classList.add("active");

      // Interaction: Change active image on click
      thumbnail.addEventListener("click", () => {
        updateActiveImage(catObject, thumbnail);
      });

      thumbnail.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          updateActiveImage(catObject, thumbnail);
        }
      });

      thumbContainer.appendChild(thumbnail);
    });
  }

  // display the meme modal
  memeModal.style.display = "block";
}

function getMatchingCatsArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const selectedEmotion = document.querySelector(
      'input[type="radio"]:checked'
    ).value;
    const isGif = gifsOnlyOption.checked;

    const matchingCatsArray = catsData.filter(function (cat) {
      if (isGif) {
        return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
      } else {
        return cat.emotionTags.includes(selectedEmotion);
      }
    });
    return matchingCatsArray;
  }
}

function getEmotionsArray(cats) {
  const emotionsArray = [];
  for (let cat of cats) {
    for (let emotion of cat.emotionTags) {
      if (!emotionsArray.includes(emotion)) {
        emotionsArray.push(emotion);
      }
    }
  }
  return emotionsArray;
}

function renderEmotionsRadios(cats) {
  let radioItems = ``;
  const emotions = getEmotionsArray(cats);
  for (let emotion of emotions) {
    radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
            type="radio"
            id="${emotion}"
            value="${emotion}"
            name="emotions"
            >
        </div>`;
  }
  emotionRadios.innerHTML = radioItems;
}

renderEmotionsRadios(catsData);
