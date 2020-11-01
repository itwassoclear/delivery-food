"use strict";

import Swiper from "https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js";

const ERROR_COLOR = "#ff0000";

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
const restaurantTitle = document.querySelector(".restaurant-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("login");

let cart = JSON.parse(localStorage.getItem(`cart_${login}`)) || [];
// if (localStorage.getItem("cart") != null) {
//   cart = JSON.parse(localStorage.getItem("cart"));
// }
// localStorage.getItem(`cart_${login}`);

function saveCart() {
  localStorage.setItem(`cart_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (localStorage.getItem(`cart_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`cart_${login}`));
    cart.push(...data);
  }
}

const getData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${respons.status}`);
  }
  return await response.json();
};

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z)-9-_\.]{1,20}$/;
  return regName.test(str);
}

function validPass(str) {
  const regPass = /^[a-zA-Z][a-zA-Z)-9-_\.]{1,20}$/;
  return regPass.test(str);
}

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
    clearCart();
    localStorage.removeItem("login");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
}

function notAutorized() {
  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value) && validPass(passwordInput.value)) {
      login = loginInput.value;
      localStorage.setItem("login", login);
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      loginForm.removeEventListener("submit", logIn);
      loginForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = ERROR_COLOR;
      loginInput.value = "";
      passwordInput.style.borderColor = ERROR_COLOR;
      passwordInput.value = "";
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

function createCardGood({ description, image, name, price, id }) {
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
        <button class="button button-primary button-add-cart" id=${id}>
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
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

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find((item) => {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
  }
  // localStorage.setItem("cart", JSON.stringify(cart));
  saveCart();
}

function renderCart() {
  modalBody.textContent = "";

  cart.forEach(({ id, title, cost, count }) => {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id=${id}>+</button>
      </div>
    </div>
    `;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  const totalPrice = cart.reduce((result, item) => {
    {
      return result + parseFloat(item.cost) * item.count;
    }
  }, 0);
  modalPrice.textContent = totalPrice + " Р";
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) {
      food.count++;
    }
    renderCart();
    saveCart();
  }
}
function clearCart() {
  cart.length = 0;
  localStorage.removeItem(`cart_${login}`);
  renderCart();
}

function init() {
  getData("./db/partners.json").then((data) => {
    data.forEach(createCardRestaurant);
  });

  buttonAuth.addEventListener("click", clearForm);

  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", clearCart);

  modalBody.addEventListener("click", changeCount);

  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  cardsReataurants.addEventListener("click", openGoods);

  logo.addEventListener("click", returnMain);

  inputSearch.addEventListener("keyup", (event) => {
    const value = event.target.value.trim();

    if (!value) {
      event.target.style.backgroundColor = ERROR_COLOR;
      event.target.value = "";
      setTimeout(() => {
        event.target.style.backgroundColor = "";
      }, 1500);
      return;
    }

    if (value.length < 3) {
      return;
    }

    getData("./db/partners.json")
      .then((data) => {
        return data.map((partner) => {
          return partner.products;
        });
      })
      .then((linksProduct) => {
        cardsMenu.textContent = "";
        linksProduct.forEach((link) => {
          getData(`./db/${link}`).then((data) => {
            const resultSearch = data.filter((item) => {
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase());
            });
            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = "Результат поиска";
            restaurantRating.textContent = "";
            restaurantPrice.textContent = "";
            restaurantCategory.textContent = "разная кухня";

            resultSearch.forEach(createCardGood);
          });
        });
      });
  });

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
