function checkValid(){
    const dropDownOption = document.getElementById("name");
    const kind = document.getElementById("kind");
    const date = document.getElementById("date");
    if(dropDownOption.value == "choose_option"){
        document.getElementById("dropDownErrorFlower").textContent = ("Please choose an option");
        valid = false;
    }
    else{
        document.getElementById("dropDownErrorFlower").textContent = ("");
    }
    if(kind.value == null || kind.value == ""){
        document.getElementById("kindError").textContent = ("Please enter a name of a kind");
        valid = false;
    }
    else{
        document.getElementById("kindError").textContent = ("");
    }
    if(isNaN(Date.parse(date.value))){
        document.getElementById("dateError").textContent = ("Please select a valid date");
        valid = false;
    }
    else{
       document.getElementById("dateError").textContent = ("");
    }
}

const token = localStorage.getItem("token");

function parseJwt(token) {
    if (!token){ 
      return;
    }
    const base64 = token.split('.')[1]; // extracting payload
    return JSON.parse(window.atob(base64));
  }

  function getMonthIndex(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.findIndex(m => m === month) + 1; // Adăugăm 1 pentru a obține indexul corect al lunii
  }

  document.addEventListener("DOMContentLoaded",async (event) => {
    event.preventDefault();
    var today = new Date().toISOString().split('T')[0]; // Obțineți data de astăzi în formatul specificat

    var dateInput = document.getElementById("date");
    dateInput.setAttribute("max", today);

    var apiUrl = 'http://127.0.0.1:8080/api/flowersByEmail/{email}';
    var userEmail = parseJwt(token).sub.toLowerCase();
    var url = apiUrl.replace("{email}", userEmail);
    var response = await fetch(url,{
            method : 'GET',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        });
        if(!response.ok){
            if(response.status === 401){
                console.log("Authorization refused!");
                window.location.href = "index.html";
            }
            return;
        }
        var data = await response.json();
        data.forEach(json => {
            const cardContainer = document.getElementById('informationWrapper');
            const template = document.getElementById('card-template');
            const cardClone = template.content.cloneNode(true);
          
            const titleElement = cardClone.querySelector('.title h2');
            titleElement.textContent = json.name;
          
            const dateElement = cardClone.querySelector('.information p:first-child');
            dateElement.textContent = 'Date: ' + json.plantingDate;
          
            const soiElement = cardClone.querySelector('.information p:nth-child(2)');
            soiElement.textContent = 'Kind: ' + json.kind;

            var statusBtn = cardClone.getElementById("statusBtn");
            statusBtn.textContent = json.status;
          
            const optionsButton = cardClone.querySelector('.options-button');
            optionsButton.addEventListener('click', function () {
              // Preia datele din boxul respectiv folosind indexul corespunzător
              const boxTitle = titleElement.textContent;
              const boxDate = dateElement.textContent;
              const boxKind = soiElement.textContent;
              const boxHumidity = 'Good';
          
              // Poți efectua acțiuni cu datele preluate, cum ar fi afișarea lor în consolă
              localStorage.setItem("id", json.id);
              localStorage.setItem("name", boxTitle);
              localStorage.setItem("date", boxDate);
              localStorage.setItem("kind", boxKind);
              localStorage.setItem("humidity", boxHumidity);
              localStorage.setItem("status",json.status);
              window.location.href = "flowerInfoActions.html";
            });
          
            cardContainer.appendChild(cardClone);
          });
          
  });

  function getFirstTwoWords(str) {
    const words = str.split(' ');
  
    const firstTwoWords = words.slice(0, 2);
  
    return firstTwoWords.join(' ');
  }

//   window.onload = function(){
//   Caman(img, function() {
//     console.log("Am intrat");
//   // Calculează culoarea predominantă
//   var pixeli = this.getImageData();
//   var pixeliData = pixeli.data;
//   var culoare = { R: 0, G: 0, B: 0 };
//   var numarPixeli = pixeliData.length / 4;


//   for (var i = 0; i < pixeliData.length; i += 4) {
//       culoare.R += pixeliData[i];
//       culoare.G += pixeliData[i + 1];
//       culoare.B += pixeliData[i + 2];
//   }

//   culoare.R = Math.round(culoare.R / numarPixeli);
//   culoare.G = Math.round(culoare.G / numarPixeli);
//   culoare.B = Math.round(culoare.B / numarPixeli);
  
//   console.log("Culoarea predominanta este: ");
//   console.log(culoare);
// });
//   }
const addFlowerForm = document.getElementById("addFlowerForm");

addFlowerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    var userEmail = parseJwt(token).sub.toLowerCase();
    console.log(userEmail);
        var url = 'http://127.0.0.1:8080/api/flowers';
        var kind = document.getElementById('kind');
        var name = document.getElementById('name');
        var formDate = document.getElementById('date');
        var dateVal = formDate.value;
        var date = new Date(dateVal);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        var formattedDate = day + '-' + month + '-' + year;
        const flowerData = {
            "name" : (name.options[name.selectedIndex].text).toLowerCase(),
            "kind" : kind.value.toLowerCase(),
            "plantingDate" : formattedDate,
            "ownerEmail" : userEmail,
            "status" : ""
        }
        console.log(flowerData);
        var response = await fetch(url,{
            method : 'POST',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            },
            body: JSON.stringify(flowerData)
        });
        if(!response.ok){
            if(response.status === 401){
                console.log("Authorization refused!");
            }
            return;
        }
        toggleAdd();
})

var counter = 0;
function toggleAdd(){
    counter++;
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popupAdd = document.getElementById('popupAddFlower');
    popupAdd.classList.toggle('active');
    addFlowerForm.style.display = "none";
}



function closeForm() {

    document.getElementById("overlay").style.display = 'none';
    document.getElementById("div-form").style.display = 'none';
}

var openForm = function () {
    document.getElementById("overlay").style.display = 'initial';
    document.getElementById("div-form").style.display = 'initial';
}

document.getElementById("login").onclick = () => {
    if(token === null){
        window.location.href = "index.html";
    } else{
        window.location.href = "profile.html";
    }
}

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