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
        window.location.href = "login.html";
    } else{
        window.location.href = "profile.html";
    }
}
const token = localStorage.getItem('token');
function isLoggedIn() {
     if (token === null) {
         window.location.href = 'login.html'; 
         return;
     }
}
isLoggedIn();

document.getElementById("login").onclick = () => {
    if(token === null){
        window.location.href = "index.html";
    } else{
        window.location.href = "profile.html";
    }
}

var inputPrice = document.getElementById('price');
var putOnSale = document.getElementById('putOnSale');

var counter = 0;
function toggle(){
    counter++;
    var blur = document.getElementById('blur');
    blur.classList.toggle('active');
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
        putOnSale.addEventListener("click", async (event) =>{
            if(counter%2 == 0 && inputPrice != null){
        event.preventDefault();
         var apiUrl = 'http://127.0.0.1:8080/api/flowers/listFlower/{id}';
                var flowerId = localStorage.getItem("id"); 
                var url = apiUrl.replace("{id}", flowerId);
                var response1 = await fetch(url,{
                        method : 'POST',
                        headers:{
                            'Content-Type' : 'application/json',
                            'Authorization' : 'Bearer ' + token
                        },
                        body : inputPrice.value
                    });
                    if(!response1.ok){
                        if(response1.status === 401){
                            console.log("Authorization refused!");
                            window.location.href = "index.html";
                        }
                        return;
                    }
                    window.location.href = "flowerTool.html";
                }
});
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
         var apiUrl = 'http://127.0.0.1:8080/api/flowers/{id}';
                var flowerId = localStorage.getItem("id"); 
                var url = apiUrl.replace("{id}", flowerId);
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
                    window.location.href = "flowerTool.html";
                }
});
}
var actionRecommended = document.getElementById("actions_recommended");

document.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();

    var name = localStorage.getItem("name");
    var kind = localStorage.getItem("kind");
    var plantingDate = localStorage.getItem("date");
    var status = localStorage.getItem("status");

    var flowerName = document.getElementById("name");
    var flowerKind = document.getElementById("kind");
    var flowerDate = document.getElementById("date");
    var flowerHumidity = document.getElementById("humidity");
    var flowerTemp = document.getElementById("temperature");
    var actionHistory = document.getElementById("actions_history");

    var apiUrl = 'http://127.0.0.1:8080/api/sensorValuesForFlower/{id}';
    var flowerId = localStorage.getItem("id"); 
    var url = apiUrl.replace("{id}", flowerId);
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
        console.log(data);

        flowerName.textContent += name;
        flowerKind.textContent += kind;
        flowerDate.textContent += plantingDate;
        flowerHumidity.textContent += data.humidityPercent + "%";
        flowerTemp.textContent += data.temperatureCelsiusGrades + "°C";
        var ok = false;
        if(data.actionsHistory.length == 0){
          actionHistory.textContent += "No data found"
        }else{
        for(let i = 0; i < data.actionsHistory.length; i++){
          if(data.actionsHistory[i] != ""){
          ok = true;
          const words =  data.actionsHistory[i].split(" ");
          actionHistory.textContent += words[0]+ " " + words[1] + words[4] + " | ";
          }
          if(!ok){
            actionHistory.textContent += "No data found";
          }
        }
      }
        var dayPassed = data.daysPassedFromPlantedDate;

        var apiUrl1 = 'http://127.0.0.1:8080/api/flowerSpec/{name}';
        var url1 = apiUrl1.replace("{name}",name);
        var response1 = await fetch(url1,{
          method : 'GET',
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
      var data1 = await response1.json();
      var requiredTime = data1.requiredDays;

        var firstPhase = document.getElementById("firstPhase");
        var secondPhase = document.getElementById("secondPhase");
        var thirdPhase = document.getElementById("thirdPhase");
        var forthPhase = document.getElementById("forthPhase");
        var finalPhase = document.getElementById("finalPhase");

        firstPhase.style.display = "none";
        secondPhase.style.display = "none";
        thirdPhase.style.display = "none";
        forthPhase.style.display = "none";
        finalPhase.style.display = "none";

        showImages(name,dayPassed,requiredTime);

           if(status == "listed"){
            actionRecommended.textContent += "On sale";
            actionRecommended.disabled = true;
        }
        else{
        actionRecommended.textContent += data.actionRequired;
        actionRecommended.disabled = false;
        }

        if(actionRecommended.textContent == "Plant is ready to be harvested" || actionRecommended.textContent == "On sale"){
            flowerHumidity.style.display = "none";
            flowerTemp.style.display = "none";
            deleteButton.style.display = "none";
            actionRecommended.addEventListener("click", async(event) =>{
                event.preventDefault();
                toggle();
            });
        }
});
      actionRecommended.addEventListener("click", async(event) =>{
            event.preventDefault();
            console.log(actionRecommended.textContent);
            if(actionRecommended.textContent != "No action required" && actionRecommended.textContent != "Plant is ready to be harvested" && actionRecommended.textContent != "On sale"){
            var id = localStorage.getItem("id");
            var apiUrl = 'http://127.0.0.1:8080/api/actions/{id}';
            var url = apiUrl.replace("{id}",id);
            var response1 = await fetch(url,{
              method : 'POST',
              headers:{
                  'Content-Type' : 'application/json',
                  'Authorization' : 'Bearer ' + token
              },
              body: actionRecommended.textContent
          });
          if(!response1.ok){
              if(response1.status === 401){
                  console.log("Authorization refused!");
                  window.location.href = "index.html";
              }
              return;
          }
          var data1 = response1;
          console.log(data1);
          location.reload();
        }
      });

const deleteButton = document.getElementById('deleteFlower');
deleteButton.addEventListener("click", async(event) => {
    event.preventDefault();

});

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
function showImages(name,dayPassed,requiredTime){
  
  if(name == "narcisa"){
    console.log((dayPassed/requiredTime)*100);
    if((dayPassed/requiredTime)*100 < 20){
    firstPhase.src="images/firstPhase.jpg";
    firstPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
      firstPhase.src="images/firstPhase.jpg";
      secondPhase.src="images/secondPhase_narcisa.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
      firstPhase.src="images/firstPhase.jpg";
      secondPhase.src="images/secondPhase_narcisa.jpg";
      thirdPhase.src="images/thirdPhase_narcisa.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
      firstPhase.src="images/firstPhase.jpg";
      secondPhase.src="images/secondPhase_narcisa.jpg";
      thirdPhase.src="images/thirdPhase_narcisa.jpg";
      forthPhase.src="images/forthPhase_narcisa.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
      forthPhase.style.display = "block";
    }else{
      firstPhase.src="images/firstPhase.jpg";
      secondPhase.src="images/secondPhase_narcisa.jpg";
      thirdPhase.src="images/thirdPhase_narcisa.jpg";
      forthPhase.src="images/forthPhase_narcisa.jpg";
      finalPhase.src="images/narcisa.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
      forthPhase.style.display = "block";
      finalPhase.style.display = "block";
    }
  }if(name == "lalea"){
      console.log((dayPassed/requiredTime)*100);
      if((dayPassed/requiredTime)*100 < 20){
      firstPhase.src="images/firstPhase_lalea.jpg";
      firstPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
        firstPhase.src="images/firstPhase_lalea.jpg";
        secondPhase.src="images/secondPhase_lalea.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
        firstPhase.src="images/firstPhase_lalea.jpg";
        secondPhase.src="images/secondPhase_lalea.jpg";
        thirdPhase.src="images/thirdPhase_lalea.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
        firstPhase.src="images/firstPhase_lalea.jpg";
        secondPhase.src="images/secondPhase_lalea.jpg";
        thirdPhase.src="images/thirdPhase_lalea.jpg";
        forthPhase.src="images/forthPhase_lalea.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
        forthPhase.style.display = "block";
      }else{
        firstPhase.src="images/firstPhase_lalea.jpg";
        secondPhase.src="images/secondPhase_lalea.jpg";
        thirdPhase.src="images/thirdPhase_lalea.jpg";
        forthPhase.src="images/forthPhase_lalea.jpg";
        finalPhase.src="images/lalea.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
        forthPhase.style.display = "block";
        finalPhase.style.display="block";
      }
  }else if(name == "zambila"){
    console.log((dayPassed/requiredTime)*100);
    if((dayPassed/requiredTime)*100 < 20){
    firstPhase.src="images/firstPhase_zambila.jpg";
    firstPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
      firstPhase.src="images/firstPhase_zambila.jpg";
      secondPhase.src="images/secondPhase_zambila.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
      firstPhase.src="images/firstPhase_zambila.jpg";
      secondPhase.src="images/secondPhase_zambila.jpg";
      thirdPhase.src="images/thirdPhase_zambila.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
      firstPhase.src="images/firstPhase_zambila.jpg";
      secondPhase.src="images/secondPhase_zambila.jpg";
      thirdPhase.src="images/thirdPhase_zambila.jpg";
      forthPhase.src="images/forthPhase_zambila.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
      forthPhase.style.display = "block";
    }else{
      firstPhase.src="images/firstPhase_zambila.jpg";
      secondPhase.src="images/secondPhase_zambila.jpg";
      thirdPhase.src="images/thirdPhase_zambila.jpg";
      forthPhase.src="images/forthPhase_zambila.jpg";
      finalPhase.src="images/zambila.jpg";
      firstPhase.style.display = "block";
      secondPhase.style.display = "block";
      thirdPhase.style.display = "block";
      forthPhase.style.display = "block";
      finalPhase.style.display="block";
    }
}else if(name == "panseluta"){
  console.log((dayPassed/requiredTime)*100);
  if((dayPassed/requiredTime)*100 < 20){
  firstPhase.src="images/firstPhase.jpg";
  firstPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
    firstPhase.src="images/firstPhase.jpg";
    secondPhase.src="images/secondPhase_panseluta.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
    firstPhase.src="images/firstPhase.jpg";
    secondPhase.src="images/secondPhase_panseluta.jpg";
    thirdPhase.src="images/thirdPhase_panseluta.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
    firstPhase.src="images/firstPhase.jpg";
    secondPhase.src="images/secondPhase_panseluta.jpg";
    thirdPhase.src="images/thirdPhase_panseluta.jpg";
    forthPhase.src="images/forthPhase_panseluta.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
    forthPhase.style.display = "block";
  }else{
    firstPhase.src="images/firstPhase.jpg";
    secondPhase.src="images/secondPhase_panseluta.jpg";
    thirdPhase.src="images/thirdPhase_panseluta.jpg";
    forthPhase.src="images/forthPhase_panseluta.jpg";
    finalPhase.src="images/panseluta.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
    forthPhase.style.display = "block";
    finalPhase.style.display="block";
  }
}else if(name == "brandusa"){
console.log((dayPassed/requiredTime)*100);
if((dayPassed/requiredTime)*100 < 20){
firstPhase.src="images/firstPhase.jpg";
firstPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_brandusa.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_brandusa.jpg";
  forthPhase.src="images/forthPhase_brandusa.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
}else{
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_brandusa.jpg";
  forthPhase.src="images/forthPhase_brandusa.jpg";
  finalPhase.src="images/brandusa.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
  finalPhase.style.display="block";
}
}else if(name == "violeta"){
console.log((dayPassed/requiredTime)*100);
if((dayPassed/requiredTime)*100 < 20){
firstPhase.src="images/firstPhase.jpg";
firstPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_violeta.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_violeta.jpg";
  forthPhase.src="images/forthPhase_violeta.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
}else{
  firstPhase.src="images/firstPhase.jpg";
  secondPhase.src="images/secondPhase_panseluta.jpg";
  thirdPhase.src="images/thirdPhase_violeta.jpg";
  forthPhase.src="images/forthPhase_violeta.jpg";
  finalPhase.src="images/violeta.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
  finalPhase.style.display="block";
}
}else if(name == "orhidee"){
console.log((dayPassed/requiredTime)*100);
if((dayPassed/requiredTime)*100 < 20){
firstPhase.src="images/firstPhase_orhidee.jpg";
firstPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
firstPhase.src="images/firstPhase_orhidee.jpg";
secondPhase.src="images/secondPhase_orhidee.jpg";
firstPhase.style.display = "block";
secondPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
firstPhase.src="images/firstPhase_orhidee.jpg";
secondPhase.src="images/secondPhase_orhidee.jpg";
thirdPhase.src="images/thirdPhase_orhidee.jpg";
firstPhase.style.display = "block";
secondPhase.style.display = "block";
thirdPhase.style.display = "block";
}else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
firstPhase.src="images/firstPhase_orhidee.jpg";
secondPhase.src="images/secondPhase_orhidee.jpg";
thirdPhase.src="images/thirdPhase_orhidee.jpg";
forthPhase.src="images/forthPhase_orhidee.jpg";
firstPhase.style.display = "block";
secondPhase.style.display = "block";
thirdPhase.style.display = "block";
forthPhase.style.display = "block";
}else{
firstPhase.src="images/firstPhase_orhidee.jpg";
secondPhase.src="images/secondPhase_orhidee.jpg";
thirdPhase.src="images/thirdPhase_orhidee.jpg";
forthPhase.src="images/forthPhase_orhidee.jpg";
finalPhase.src="images/orhidee.jpg";
firstPhase.style.display = "block";
secondPhase.style.display = "block";
thirdPhase.style.display = "block";
forthPhase.style.display = "block";
finalPhase.style.display="block";
}
}else if(name == "crizantema"){
  console.log((dayPassed/requiredTime)*100);
  if((dayPassed/requiredTime)*100 < 20){
  firstPhase.src="images/firstPhase_crizantema.jpg";
  firstPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
  firstPhase.src="images/firstPhase_crizantema.jpg";
  secondPhase.src="images/secondPhase_crizantema.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
  firstPhase.src="images/firstPhase_crizantema.jpg";
  secondPhase.src="images/secondPhase_crizantema.jpg";
  thirdPhase.src="images/thirdPhase_crizantema.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
  firstPhase.src="images/firstPhase_crizantema.jpg";
  secondPhase.src="images/secondPhase_crizantema.jpg";
  thirdPhase.src="images/thirdPhase_crizantema.jpg";
  forthPhase.src="images/forthPhase_crizantema.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
  }else{
  firstPhase.src="images/firstPhase_crizantema.jpg";
  secondPhase.src="images/secondPhase_crizantema.jpg";
  thirdPhase.src="images/thirdPhase_crizantema.jpg";
  forthPhase.src="images/forthPhase_crizantema.jpg";
  finalPhase.src="images/crizantema.jpg";
  firstPhase.style.display = "block";
  secondPhase.style.display = "block";
  thirdPhase.style.display = "block";
  forthPhase.style.display = "block";
  finalPhase.style.display="block";
  }
  }else if(name == "azalee"){
    console.log((dayPassed/requiredTime)*100);
    if((dayPassed/requiredTime)*100 < 20){
    firstPhase.src="images/firstPhase_azalee.jpg";
    firstPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
    firstPhase.src="images/firstPhase_azalee.jpg";
    secondPhase.src="images/secondPhase_azalee.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
    firstPhase.src="images/firstPhase_azalee.jpg";
    secondPhase.src="images/secondPhase_azalee.jpg";
    thirdPhase.src="images/thirdPhase_azalee.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
    }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
    firstPhase.src="images/firstPhase_azalee.jpg";
    secondPhase.src="images/secondPhase_azalee.jpg";
    thirdPhase.src="images/thirdPhase_azalee.jpg";
    forthPhase.src="images/forthPhase_azalee.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
    forthPhase.style.display = "block";
    }else{
    firstPhase.src="images/firstPhase_azalee.jpg";
    secondPhase.src="images/secondPhase_azalee.jpg";
    thirdPhase.src="images/thirdPhase_azalee.jpg";
    forthPhase.src="images/forthPhase_azalee.jpg";
    finalPhase.src="images/azalee.jpg";
    firstPhase.style.display = "block";
    secondPhase.style.display = "block";
    thirdPhase.style.display = "block";
    forthPhase.style.display = "block";
    finalPhase.style.display="block";
    }
    }else if(name == "ghiocel"){
      console.log((dayPassed/requiredTime)*100);
      if((dayPassed/requiredTime)*100 < 20){
      firstPhase.src="images/firstPhase.jpg";
      firstPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 20 && (dayPassed/requiredTime)*100 < 40){
        firstPhase.src="images/firstPhase.jpg";
        secondPhase.src="images/secondPhase_panseluta.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 40 && (dayPassed/requiredTime)*100 < 80){
        firstPhase.src="images/firstPhase.jpg";
        secondPhase.src="images/secondPhase_panseluta.jpg";
        thirdPhase.src="images/thirdPhase_panseluta.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
      }else if((dayPassed/requiredTime)*100 >= 80 && (dayPassed/requiredTime)*100 < 100){
        firstPhase.src="images/firstPhase.jpg";
        secondPhase.src="images/secondPhase_panseluta.jpg";
        thirdPhase.src="images/thirdPhase_panseluta.jpg";
        forthPhase.src="images/forthPhase_ghiocel.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
        forthPhase.style.display = "block";
      }else{
        firstPhase.src="images/firstPhase.jpg";
        secondPhase.src="images/secondPhase_panseluta.jpg";
        thirdPhase.src="images/thirdPhase_panseluta.jpg";
        forthPhase.src="images/forthPhase_ghiocel.jpg";
        finalPhase.src="images/ghiocel.jpg";
        firstPhase.style.display = "block";
        secondPhase.style.display = "block";
        thirdPhase.style.display = "block";
        forthPhase.style.display = "block";
        finalPhase.style.display="block";
      }
  }
}

// const colorThief = new ColorThief();
// const img = document.getElementById('firstPhase');

// img.onload = function() {
//   const dominantColor = colorThief.getColor(img);
//   console.log(dominantColor); // Rezultatul este un array [R, G, B]
// };