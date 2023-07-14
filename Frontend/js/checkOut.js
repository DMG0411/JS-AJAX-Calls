const countryInput = document.getElementById("country");
const cityInput = document.getElementById("city");
const addressInput = document.getElementById("address");
const nameInput = document.getElementById("name");
const cardInput = document.getElementById("card");
const ccvInput = document.getElementById("ccv");
const expirationInput = document.getElementById("start");
//const checkoutForm = document.getElementById("placeOrder");
const placeOrderButton = document.getElementById('placeOrder');

placeOrderButton.addEventListener('click', () => {
console.log('eventListener');
    if(validateCheckout()) {
        console.log("Checkout form is valid");
        removeItemsFromFavorites();
        sellFlowers();
        clearCart();
        window.location.href = 'done.html';
    }
});

function validateCheckout() {
    let valid = true;

    if(countryInput.value === "") {
        document.getElementById("countryError").textContent = "Invalid country";
        valid = false;
    } else {
        document.getElementById("countryError").textContent = "";
    }

    if(cityInput.value === "") {
        document.getElementById("cityError").textContent = "Invalid city";
        valid = false;
    } else {
        document.getElementById("cityError").textContent = "";
    }

    if(addressInput.value === "") {
        document.getElementById("addressError").textContent = "Invalid address";
        valid = false;
    } else {
        document.getElementById("addressError").textContent = "";
    }

    if(nameInput.value === "") {
        document.getElementById("nameError").textContent = "Invalid name";
        valid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    if(!validateCardNumber(cardInput.value)) {
        document.getElementById("cardError").textContent = "Invalid card number";
        valid = false;
    } else {
        document.getElementById("cardError").textContent = "";
    }

    if(!validateCardNumber(ccvInput.value)) {
        document.getElementById("ccvError").textContent = "Invalid CCV";
        valid = false;
    } else {
        document.getElementById("ccvError").textContent = "";
    }


    if(!validateExpirationDate()) {
        document.getElementById("expirationError").textContent = "Invalid expiration date";
        valid = false;
    } else {
        document.getElementById("expirationError").textContent = "";
    }

    return valid;
}


function validateCardNumber(cardNumber) {
    var cardNumberRegex = /^[0-9]{3,16}$/;
    return cardNumberRegex.test(cardNumber);
  }
  

function validateExpirationDate(){
    const date = new Date(expirationInput.value);
    const currentDate = new Date();
    if(date <= currentDate) return false;
    else return true;
}

function clearCart() {
    localStorage.removeItem('cartItems');
    
    const cartItemsContainer = document.querySelector('.cart-items-container');

  
  }


    function sellFlowers() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('sellFlowers');
    
    cartItems.forEach(item => {
      const productName = item.name;
      const itemId = cartItems.findIndex(cartItem => cartItem.name === productName);
      console.log('Call sellFlower with itemId:', itemId + 1);
      sellFlower(itemId + 1);
    });
  }
  

  async function sellFlower(id) {
    let token = localStorage.getItem('token');
    let data;
    let email = parseJwt(token).sub;

    console.log(email);
    if (token == null) {
        window.location.href = 'index.html'; 
        return;
    }
    const selledFlowerInfo = {"product_id":id, "user_email":email};
    var apiUrl = 'http://127.0.0.1:8080/api/flowers/sellFlower/{id}';
  var url = apiUrl.replace("{id}", id);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(selledFlowerInfo)
        });
        if (!response.ok) {
            console.log('An error occurred:', response.statusText);
            return;
        }
        data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('An error occurred:', error.message);
    }

};

async function removeItemsFromFavorites() {
    let token = localStorage.getItem('token');

     if (token === null) {
         window.location.href = 'index.html'; 
        return;
     }
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cartItemNames = cartItems.map(item => item.name.split(' ')[0]);

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

for (let i = 0; i < favoriteFlowers.length; i++) {
    for (let j = 0; j < cartItemNames.length; j++) {
      if (favoriteFlowers[i] === cartItemNames[j]) {
        removeFromFavorite(favoriteFlowers[i]);
      }
    }
  }
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
  
function parseJwt(token) {
    if (!token) {
        return;
    }
    const base64 = token.split('.')[1]; 
    return JSON.parse(window.atob(base64));
}
