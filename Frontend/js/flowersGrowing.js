sessionStorage.removeItem("id-prod");

let items = document.getElementsByClassName("box-container")[0];


async function loadItems() {
    let token = localStorage.getItem('token');

    if (token === null) {
        window.location.href = 'index.html'; 
       return;
    }


   
    const response2 = await fetch(`http://127.0.0.1:8080/api/flowers/listed`, {
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
    const flowerNames = data.map(flower => flower.name);
console.log(flowerNames);

    const flowerTypes = ['zambila', 'lalea', 'panseluta', 'brandusa', 'narcisa', 'orhidee', 'azalee', 'violeta', 'crizantema', 'ghiocel'];

    let ok = 1;
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < flowerNames.length; j++) {
    if (flowerTypes[i] === flowerNames[j]) {
      ok = 0;
    }
  }
  if (ok === 1) {
    createItem(flowerTypes[i]);
  }
  ok = 1;
}


}



function createItem(productName) {
    //let id = product.id;
    let item = document.createElement("div");
    let icons = document.createElement("div");
    let icon1 = document.createElement("a");
    let imageBox = document.createElement("div");
    let image = document.createElement("img");
    let content = document.createElement("div");
    let name = document.createElement("h3");
    item.classList.add("box");
    icons.classList.add("icons");
    icon1.classList.add("fas");
    icon1.classList.add("fa-heart");
    //console.log(id);
    icons.appendChild(icon1);
    imageBox.classList.add("image");
    image.src = `images/${productName}.jpg`;
    imageBox.appendChild(image);
    content.classList.add("content");
    name.innerHTML = productName;
    content.appendChild(name);
    item.appendChild(icons);
    item.appendChild(imageBox);
    item.appendChild(content);
    items.appendChild(item);
    
    icon1.addEventListener('click', () => {
       const favoriteItem = icon1.parentElement.parentElement;
       const productName = favoriteItem.querySelector('h3').innerText;
       console.log(productName);

       addToFavorite(productName);
     });
   
    
}

async function addToFavorite(productName) {
  let token = localStorage.getItem('token');
    let data;
    let email = parseJwt(token).sub;
    console.log(token);
    console.log(email);
    if (token == null) {
        window.location.href = 'index.html'; //login/sign up
        return;
    }
    const favoriteData = {"flowerName":productName, "email":email};
    var apiUrl = 'http://127.0.0.1:8080/api/users/addToWishList/{flowerName}';
    var url = apiUrl.replace("{flowerName}", productName);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(favoriteData)
        });
        if (!response.ok) {
            console.log('An error occurred:', response.statusText);
            return;
        }
        data = await response;
        console.log(data);

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
    refreshFavorite();

}



loadItems();


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

const cartItemRemove = document.querySelectorAll('.cart-item .fas.fa-times');

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
  const cartItemRemove = document.querySelectorAll('.cart-item .fas.fa-times');
  cartItemRemove.forEach(icon => {
    icon.addEventListener('click', () => {
      const cartItem = icon.parentElement;
      const productName = cartItem.querySelector('h3').innerText;
      
      removeFromCart(productName);
      refreshCart(); 
    });
  });
}
//base js

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

//

// search filter
document.getElementById("search-box").addEventListener("change", filterSearch);
function filterSearch(ev) {
    var value = ev.target.value;
    var cards = document.getElementsByClassName("flower");

    for(var i=0; i<cards.length; i++) {
        var card = cards[i];

        if(card.id.toUpperCase() === "add-card".toUpperCase()) {
            continue;
        }
        
        if(card.innerHTML.toUpperCase().includes(value.toUpperCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    }
}

function parseJwt(token) {
  if (!token) {
      return;
  }
  const base64 = token.split('.')[1]; // extracting payload
  return JSON.parse(window.atob(base64));
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
  //var data = await response1();
  //window.location.href = "index.html";


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