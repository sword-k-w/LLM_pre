const slides = Array.from(document.querySelectorAll(".slide"));
const counter = document.getElementById("slide-counter");
const presenter = document.getElementById("slide-presenter");
const progressFill = document.getElementById("progress-fill");

let currentIndex = 0;

function renderSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentIndex);
  });

  const activeSlide = slides[currentIndex];
  const presenterLabel = activeSlide.dataset.presenter || "-";
  const title = activeSlide.dataset.title || document.title;
  const progress = ((currentIndex + 1) / slides.length) * 100;

  document.title = `${title} | Prompt / Context / Harness Engineering`;
  counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  presenter.textContent = `Presenter ${presenterLabel}`;
  progressFill.style.width = `${progress}%`;
  window.location.hash = `slide-${currentIndex + 1}`;
}

function goNext() {
  renderSlide(currentIndex + 1);
}

function goPrev() {
  renderSlide(currentIndex - 1);
}

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    goNext();
  }

  if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    goPrev();
  }

  if (event.key === "Home") {
    renderSlide(0);
  }

  if (event.key === "End") {
    renderSlide(slides.length - 1);
  }
});

window.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest("a, button")) {
    return;
  }

  goNext();
});

function initFromHash() {
  const match = window.location.hash.match(/slide-(\d+)/);

  if (!match) {
    renderSlide(0);
    return;
  }

  renderSlide(Number(match[1]) - 1);
}

initFromHash();
