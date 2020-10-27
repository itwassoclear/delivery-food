const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("login");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

buttonAuth.addEventListener("click", toggleModalAuth);
closeAuth.addEventListener("click", toggleModalAuth);

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
    login = loginInput.value;

    localStorage.setItem("login", login);

    toggleModalAuth();
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    loginForm.removeEventListener("submit", logIn);
    loginForm.reset();
    checkAuth();
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

checkAuth();
