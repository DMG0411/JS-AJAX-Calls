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

document.getElementById("logoutButton").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

const token = localStorage.getItem("token");

function parseJwt(token) {
    if (!token){ 
      return;
    }
    console.log(token);
    const base64 = token.split('.')[1]; // extracting payload
    return JSON.parse(window.atob(base64));
  }

var hashedPass = 0;
var role = 0;

document.addEventListener("DOMContentLoaded",async (event) => {
    event.preventDefault();
    var url = 'http://127.0.0.1:8080/api/users';
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
            }else if(response.status === 404){
              console.log("NOT FOUND");
              window.location.href = "index.html";
            }
            return;
        }
        var data = await response.json();
        console.log(data);
        hashedPass = data.passwordHash;
        var email = data.email;
        var name = data.name;
        var city = data.city;
        role = data.role;
        var phoneNumber = data.phoneNumber;
        document.getElementsByName('fullName')[0].value = name;
        document.getElementsByName('email')[0].textContent += email;
        document.getElementsByName('city')[0].value = city;
        document.getElementsByName('phoneNumber')[0].value = phoneNumber;
        document.getElementsByName('accountPurpose')[0].textContent += role;

        if(role == "Customer"){
          var statusBtn = document.getElementById('statusButton');
          statusBtn.style.display = 'none';
        }
  });

var counter = 0;
function toggleEdit(){
    counter++;
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popupEdit = document.getElementById('popupEdit');
    popupEdit.classList.toggle('active');
}


var counter1 = 0;
function toggleDelete(){
    counter1++;
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popupDelete = document.getElementById('deletePopup');
    popupDelete.classList.toggle('active');
     confirmBtn.addEventListener("click", async (event) =>{
         if(counter1%2 == 0){
          event.preventDefault();
          var url = 'http://127.0.0.1:8080/api/users';
                var response1 = await fetch(url,{
                        method : 'DELETE',
                         headers:{
                             'Content-Type' : 'application/json',
                             'Authorization' : 'Bearer ' + token
                        }
                     });
                     if(!response1.ok){
                          if(response1.status === 401){
                            console.log("Authorization refused!");
                            window.location.href = "index.html";
                          }
                        return;
                     }
                     var data = await response1.json();
                     window.location.href = "index.html";
                }
});
}

const editButton = document.getElementById('editButton')
editButton.addEventListener("click", async (event) => {
        event.preventDefault();
        var emailElement = document.getElementById("email"); // Obține elementul <h5> după ID
        var emailText = emailElement.textContent.trim(); // Preia textul și înlătură spațiile inutile

        var emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/; // Expresie regulată pentru identificarea adresei de email
        var emailMatch = emailText.match(emailRegex); // Aplică expresia regulată pentru a găsi potrivirile

        var emailValue = emailMatch ? emailMatch[0] : ""; // Preia prima potrivire sau returnează un șir vid dacă nu s-a găsit nicio potrivire

        var url = 'http://127.0.0.1:8080/api/users';
        const toChangeData = {
            "email" : emailValue,
            "name" : document.getElementsByName('fullName')[0].value,
            "passwordHash" : hashedPass,
            "city" : document.getElementsByName('city')[0].value,
            "phoneNumber" : document.getElementsByName('phoneNumber')[0].value,
            "role" : role
        }
        const response = fetch(url,{
            method : 'PUT',
            headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'Bearer ' + token
            },
            body: JSON.stringify(toChangeData)
        });
        toggleEdit();        
        if(!response.ok){
            if(response.status === 401){
                console.log("Authorization refused!");
            }
            return;
        }
    })


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
  var data = await response1();
  window.location.href = "index.html";


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