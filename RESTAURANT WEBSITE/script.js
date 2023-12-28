"use strict";

// TO DO LIST:

// RESTAURANT NAME TRANSITION (typing it in...)

// SECTIONS FADING IN UPWARDS

//

// -------------------------------------------------------- //

// * SELECTIONS //

const navContainer = document.querySelector(".dropdown");
const navList = document.querySelector(".menu");

const navBrunch = document.querySelector(".nav-brunch");
const navDinner = document.querySelector(".nav-dinner");
const navCatering = document.querySelector(".nav-catering");
const subMenuTab = document.querySelector(".submenu");

const allSections = document.querySelectorAll(".section");
const section1 = document.getElementById("section-1");
const section2 = document.getElementById("section-2");
const section3 = document.getElementById("section-3");

const lazyImgs = document.querySelectorAll(".img-section-1[data-src]");

const tabsContainer = document.querySelector(".tabs-container");
const allTabBtns = document.querySelectorAll(".btn-tab");
const allTabContent = document.querySelectorAll(".content-container");

const slides = document.querySelectorAll(".slide");
const sliderBtnLeft = document.querySelector(".slider-btn-left");
const sliderBtnRight = document.querySelector(".slider-btn-right");

const dots = document.querySelector(".dots");

const tabsArray = Array.from(allTabContent);

// ! PREVENT DEFAULT FOR NAV LINKS

const navLinks = document.querySelectorAll(".dropdown a");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
  });
});

// ! STICKY NAVIGATION

function stickyNav(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) navContainer.classList.add("dropdown-sticky");
}

const navObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.2,
  rootMargin: "-180px",
});

navObserver.observe(section1);

// ! FADING IN SECTIONS

function fadeInSections(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  const sectionToReveal = entry.target;
  sectionToReveal.classList.remove("section-hidden");
  observer.unobserve(sectionToReveal);
}

const sectionObserver = new IntersectionObserver(fadeInSections, {
  root: null,
  threshold: 0.2,
  rootMargin: "200px",
});

allSections.forEach((section) => {
  section.classList.add("section-hidden");
  sectionObserver.observe(section);
});

// ! LAZY LOADING IMAGES

function loadImg(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  const target = entry.target;
  target.src = target.dataset.src;

  // remove filter only after loading is finished

  target.addEventListener("load", function () {
    target.classList.remove("lazy-img");
  });

  observer.unobserve(target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

lazyImgs.forEach((img) => imgObserver.observe(img));

// ! NAV LINKS TO OPEN TABS

subMenuTab.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target;
  if (!clicked) return;
  const number = clicked.dataset.tab;
  // ? selecting the right button
  allTabBtns.forEach((tab) => tab.classList.remove("btn-tab-active"));

  //
  const tabBtnToOpen = document.querySelector(`.btn-tab-${number}`);
  tabBtnToOpen.classList.add("btn-tab-active");
  const tabToOpen = tabsArray.find((tab) => tab.dataset.tab === number);
  allTabContent.forEach((tab) =>
    tab.classList.remove("content-container-active")
  );
  tabToOpen.classList.add("content-container-active");

  section2.scrollIntoView({ behavior: "smooth" });
});

// ! TABBED COMPONENT

tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();

  const tabBtnClicked = e.target.closest(".btn-tab");
  if (!tabBtnClicked) return;
  allTabBtns.forEach((tab) => tab.classList.remove("btn-tab-active"));
  tabBtnClicked.classList.add("btn-tab-active");

  const number = tabBtnClicked.dataset.tab;

  const tabToOpen = tabsArray.find((tab) => tab.dataset.tab === number);
  allTabContent.forEach((tab) =>
    tab.classList.remove("content-container-active")
  );
  tabToOpen.classList.add("content-container-active");
});

// ! SLIDER

// 0% , 100%, 200%
let currSlide = 0;
const maxSlide = slides.length - 1;
const minSlide = 0;

slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

function init() {}

init();

function goToSlide(goTo) {
  currSlide = goTo;
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - goTo) * 100}%)`)
  );
  // activateDot(currSlide);
}
goToSlide(0);

function nextSlide() {
  if (currSlide === maxSlide) goToSlide(0);
  else {
    currSlide++;
    goToSlide(currSlide);
    activateDot(currSlide);
  }
}

function prevSlide() {
  if (currSlide === 0) goToSlide(maxSlide);
  else {
    currSlide--;
    goToSlide(currSlide);
    activateDot(currSlide);
  }
}

// ! DOTS

function createDots() {
  slides.forEach((_, i) => {
    const html = `<button class="dot" data-slide="${i}"></button>`;

    dots.insertAdjacentHTML("beforeend", html);
  });
}
createDots();

function activateDot(slide) {
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.classList.remove("dot-active");
  });

  document
    .querySelector(`.dot[data-slide="${slide}"]`)
    .classList.add("dot-active");
}

activateDot(currSlide);

dots.addEventListener("click", function (e) {
  e.preventDefault();
  const clickedDot = e.target.closest(".dot");
  if (!clickedDot) return;
  const dotNumber = clickedDot.dataset.slide;
  goToSlide(dotNumber);
  activateDot(dotNumber);
});

sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  e.preventDefault();
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
  activateDot(currSlide);
});
