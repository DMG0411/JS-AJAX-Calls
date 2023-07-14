let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    //searchForm.classList.remove('active');
    //cartItem.classList.remove('active');
}

/*let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}
*/
window.onscroll = () =>{
    navbar.classList.remove('active');
    //searchForm.classList.remove('active');
    //cartItem.classList.remove('active');
}

localStorage.removeItem("token");

function parseJwt(token) {
    if (!token){ 
      return;
    }
    console.log(token);
    const base64 = token.split('.')[1]; // extracting payload
    return JSON.parse(window.atob(base64));
  }

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("submitButton");


loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const loginData = {
        "email" : formData.get('email'),
        "password" : formData.get('password')
    };
    try{
        const response = await fetch('http://127.0.0.1:8080/api/authenticate',{
            method : 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        if(!response.ok){
            if(response.status === 404){
                let error = document.getElementById("passwordErrorLogin");
                error.textContent = ("Email or password invalid!");
            }
            return;
        }
        // console.log(response);
        // const data = await response.json();
        // console.log(data);
        const token = await response.text();
        console.log(token);
        localStorage.setItem('token', token);
        if(token != null){
            let role = parseJwt(token).role.toLowerCase();
            if(role === "admin"){
            window.location.href = 'home.html';
        } else{
            window.location.href = 'home.html';
        }
        }
        else{
            let error = document.getElementById("passwordErrorLogin");
            error.textContent = ("Email or password invalid!");
        }
    }catch(error){
        console.error("An error has occured", error.message);
        let error1 = document.getElementById("passwordErrorLogin");
            error1.textContent = ("Email or password invalid!");
    }
});


function validateLogin(){
    const emailInput = document.getElementById("emailLogin");
    const passwordInput = document.getElementById("passwordLogin");
    let valid = true;

    if(!validateEmail(emailInput.value)){
        document.getElementById("emailErrorLogin").textContent = "Invalid email address"
        valid = false;
    } else{
        document.getElementById("emailErrorLogin").textContent = "";
    }

    if(!validatePassword(passwordInput.value)){
        document.getElementById("passwordErrorLogin").textContent = "Password must be at least 8 characters"
        valid = false;
    } else {
        document.getElementById("passwordErrorLogin").textContent = "";
    }

    return valid;

}

function validateEmail(email){
    var emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

function validatePassword(password){
    return password.length >= 8;
}