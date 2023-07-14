let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    cartItem.classList.remove('active');
    favoriteItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    favoriteItem.classList.remove('active');
}

let favoriteItem = document.querySelector('.favorite-items-container');

document.querySelector('#favorites').onclick = () =>{
    favoriteItem.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
    favoriteItem.classList.remove('active');
}

document.getElementById("login").onclick = () => {
    if(localStorage.getItem("token") === null){
        window.location.href = "index.html";
    } else{
        window.location.href = "profile.html";
    }
}

function isLoggedIn() {
    let token = localStorage.getItem('token');

     if (token === null) {
         window.location.href = 'index.html'; 
         return;
     }
}

isLoggedIn();


const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

cartItems.forEach(item => {
  const newCartItem = document.createElement('div');
  newCartItem.className = 'cart-item';
  newCartItem.innerHTML = `
    <span class="fas fa-times"></span>
    <img src="images/${item.name.split(' ')[0]}.jpg" alt="">
    <div class="content">
      <h3>${item.name}</h3>
      <div class="price">${item.price}</div>
    </div>
  `;

  const cartItemsContainer = document.querySelector('.cart-items-container');
  cartItemsContainer.insertBefore(newCartItem, cartItemsContainer.lastElementChild);
});

calculateTotalPrice();
 
function removeFromCart(productName) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const itemIndex = cartItems.findIndex(item => item.name === productName);
console.log(itemIndex);
  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    const cartItemElement = document.querySelector(`[data-name="${productName}"]`);
    if (cartItemElement) {
      cartItemElement.remove();
      calculateTotalPrice();
    }
  }
}

const cartItemRemove = document.querySelectorAll('.fas.fa-times');

cartItemRemove.forEach(icon => {
  icon.addEventListener('click', () => {
      console.log('remove event listener');
    const cartItem = icon.parentElement;
    const productName = cartItem.querySelector('h3').innerText;

    removeFromCart(productName);
    refreshCart();
  });
});

function calculateTotalPrice() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let totalPrice = 0;

  cartItems.forEach(item => {
    totalPrice += parseFloat(item.price);
  });

  const totalPriceElement = document.getElementById('totalPrice');
  totalPriceElement.innerHTML = 'Total: ' + totalPrice + ' RON';
}


function refreshCart() {
  const cartItemsContainer = document.querySelector('.cart-items-container');

  cartItemsContainer.innerHTML = `<div id="totalPrice"></div>
    <a href="checkOut.html" class="btn">Checkout now</a>`;

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  cartItems.forEach(item => {
    const newCartItem = document.createElement('div');
    newCartItem.className = 'cart-item';
    newCartItem.innerHTML = `
      <span class="fas fa-times"></span>
      <img src="images/${item.name.split(' ')[0]}.jpg" alt="">
      <div class="content">
        <h3>${item.name}</h3>
        <div class="price">${item.price}</div>
        
      </div>
    `;
    
    cartItemsContainer.insertBefore(newCartItem, cartItemsContainer.lastElementChild);
  });

  
  calculateTotalPrice();
  const cartItemRemove = document.querySelectorAll('.fas.fa-times');
  cartItemRemove.forEach(icon => {
    icon.addEventListener('click', () => {
      const cartItem = icon.parentElement;
      const productName = cartItem.querySelector('h3').innerText;
      
      removeFromCart(productName);
      refreshCart(); 
    });
  });
}


/////favorite
loadFavoriteItems();

async function loadFavoriteItems() {
  let token = localStorage.getItem('token');

  if (token === null) {
      window.location.href = 'index.html'; 
     return;
  }


 
  const response2 = await fetch(`http://127.0.0.1:8080/api/users/getUserFavoriteFlowers`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  });

  if (!response2.ok) {
      console.log('An error occurred:', response2.statusText);
      return;
  }

  const data = await response2.json();
  console.log(data);


 data.forEach(item => {
  const newFavoriteItem = document.createElement('div');
  newFavoriteItem.className = 'favorite-item';
  newFavoriteItem.innerHTML = `
    <span class="fas fa-times"></span>
    <img src="images/${item.flowerName}.jpg" alt="">
    <div class="content">
      <h3>${item.flowerName}</h3>
      
    </div>
  `;

  const favoriteItemsContainer = document.querySelector('.favorite-items-container');
  favoriteItemsContainer.insertBefore(newFavoriteItem, favoriteItemsContainer.lastElementChild);
});
attachFavoriteItemEventListeners();
}
 
async function removeFromFavorite(productName) {
  let token = localStorage.getItem('token');

  if (token === null) {
      window.location.href = 'index.html'; 
     return;
  }
  var apiUrl = 'http://127.0.0.1:8080/api/users/removeFlowerFromWishList/{flowerName}';
  var url = apiUrl.replace("{flowerName}", productName);
  var response1 = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  if (!response1.ok) {
    if (response1.status === 401) {
      console.log("Authorization refused!");
      window.location.href = "index.html";
    }
    return;
  }
}

const favoriteItemRemove = document.querySelectorAll('.favorite-item .fas.fa-times');

favoriteItemRemove.forEach(icon => {
  icon.addEventListener('click', () => {
      console.log('remove from favorites');
    const favoriteItem = icon.parentElement;
    const productName = favoriteItem.querySelector('h3').innerText;

    removeFromFavorite(productName);
    refreshFavorite();
  });
});

function refreshFavorite() {
  const favoriteItemsContainer = document.querySelector('.favorite-items-container');

  favoriteItemsContainer.innerHTML = ` `;

  loadFavoriteItems();
}

function attachFavoriteItemEventListeners() {
  const favoriteItemRemove = document.querySelectorAll('.favorite-item .fas.fa-times');

  favoriteItemRemove.forEach(icon => {
    icon.addEventListener('click', () => {
      console.log('remove from favorites');
      const favoriteItem = icon.parentElement;
      const productName = favoriteItem.querySelector('h3').innerText;

      removeFromFavorite(productName);
      refreshFavorite();
    });
  });
}

if (window.location.href.endsWith('home.html')) getNotification();
async function getNotification() {
  let token = localStorage.getItem('token');
 console.log('notificare?');
     if (token === null) {
         window.location.href = 'index.html'; 
        return;
     }
  const response1 = await fetch(`http://127.0.0.1:8080/api/flowers/listed`, {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
         }
     });

     if (!response1.ok) {
         console.log('An error occurred:', response1.statusText);
         return;
     }

     const data1 = await response1.json();
     console.log(data1);

     const flowersListed = data1.map(flower => flower.name);
console.log(flowersListed);

const response2 = await fetch(`http://127.0.0.1:8080/api/users/getUserFavoriteFlowers`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  });

  if (!response2.ok) {
      console.log('An error occurred:', response2.statusText);
      return;
  }

  const data2 = await response2.json();
  console.log(data2);

  const favoriteFlowers = data2.map(flower => flower.flowerName);
console.log(favoriteFlowers);

let ok = 1;
for (let i = 0; i < favoriteFlowers.length; i++) {
  for (let j = 0; j < flowersListed.length; j++) {
    if (favoriteFlowers[i] === flowersListed[j]) {
      ok = 0;
      break;
    }
  }
  if (ok === 0) {
    break;
  }
}

if(ok === 0){
  toggle();
}
function toggle(){
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
}
var doneBtn = document.getElementById('done');
doneBtn.addEventListener("click", (event) =>{
  event.preventDefault();
  toggle();
})
}