"use strict";

import Swiper from "https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsReataurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("login");

const getData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${respons.status}`);
  }
  return await response.json();
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}

function autorized() {
  function logOut() {
    login = "";
    localStorage.removeItem("login");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function notAutorized() {
  function logIn(event) {
    event.preventDefault();
    if (loginInput.value.trim()) {
      login = loginInput.value;
      localStorage.setItem("login", login);
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      loginForm.removeEventListener("submit", logIn);
      loginForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "#ff0000";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", (event) => {
    if (event.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  });
}

function clearForm() {
  loginInput.style.borderColor = "";
  loginForm.reset();
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `
  <a class="card card-restaurant" data-products="${products}">
    <img
      src=${image}
      alt="image"
      class="card-image"
    />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">${stars}</div>
        <div class="price">${price} Р</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;

  cardsReataurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood({ description, image, name, price }) {
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "beforeend",
    `
    <img
      src=${image}
      alt="image"
      class="card-image"
    />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
        ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");
    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      getData(`./db/${restaurant.dataset.products}`).then((data) => {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function init() {
  getData("./db/partners.json").then((data) => {
    data.forEach(createCardRestaurant);
  });

  buttonAuth.addEventListener("click", clearForm);

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsReataurants.addEventListener("click", openGoods);

  logo.addEventListener("click", returnMain);

  checkAuth();

  new Swiper(".swiper-container", {
    loop: true,
    sliderPerView: 1,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    grabCursor: true,
  });
}

init();
