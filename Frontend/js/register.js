let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
}

const dropdownInput = document.getElementById("dropDownRegister");
const phoneNumberInput = document.getElementById("phoneNumber");
const signUpForm = document.getElementById("registerForm");
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(validateRegister()){

    const data = new FormData(signUpForm);

    const signUpData = {
        "name" : data.get('name'),
        "email" : data.get('email'),
        "password" : data.get('passwordRegister'),
        "phoneNumber" : data.get('phoneNumberRegister').toString(),
        "city" : data.get('cityRegister'),
        "role" : dropdownInput.options[dropdownInput.selectedIndex].text
    }
    console.log(signUpData);
    console.log(phoneNumberInput.value);
    try{
        const response = await fetch('http://127.0.0.1:8080/api/register', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(signUpData)
        });
        if(!response.ok){
            if(response.status === 409){
                document.getElementById("emailErrorRegister").textContent = "An user with the specified email already exists!";
            }
            return;
        }
        // const info = await response.text();
        // const token = info.token;
        const token = await response.text();
        localStorage.setItem('token',token);
        console.log(token);
        if(token != null){
            window.location.href = 'index.html';
        }
        else{
            document.getElementById("emailErrorRegister").textContent = "Email address already in use!"
        }
    } catch(error){
        console.error('An error has occured:', error.message);
    }
}
});

function validateRegister(){
    const nameInput = document.getElementById("nameRegister");
    const emailInput = document.getElementById("emailRegister");
    const passwordInput = document.getElementById("passwordRegister");
    const cityInput = document.getElementById("city");
    let valid = true;

    if(nameInput.value == ""){
        document.getElementById("nameErrorRegister").textContent = "Invalid name"
        valid = false;
    } else{
        document.getElementById("nameErrorRegister").textContent = "";
    }

    if(!validateEmail(emailInput.value)){
        document.getElementById("emailErrorRegister").textContent = "Invalid email address"
        valid = false;
    } else{
        document.getElementById("emailErrorRegister").textContent = "";
    }

    if(!validatePassword(passwordInput.value)){
        document.getElementById("passwordErrorRegister").textContent = "Password must be at least 8 characters"
        valid = false;
    } else {
        document.getElementById("passwordErrorRegister").textContent = "";
    }

    if(!validatePhoneNumber(phoneNumberInput.value)){
        document.getElementById("phoneNumberErrorRegister").textContent = "Invalid phone number"
        valid = false;
    } else{
        document.getElementById("phoneNumberErrorRegister").textContent = "";
    }

    if(cityInput.value == ""){
        document.getElementById("cityErrorRegister").textContent = "Invalid city"
        valid = false;
    } else{
        document.getElementById("cityErrorRegister").textContent = "";
    }

    if(dropdownInput.value === "choose_option"){
        document.getElementById("dropDownErrorRegister").textContent = "Please choose an option";
        valid = false;
    } else{
        document.getElementById("dropDownErrorRegister").textContent = "";
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

function validatePhoneNumber(phoneNumber){
    var phoneNumberRegex = /^[+0-9]{7,15}$/;
    return phoneNumberRegex.test(phoneNumber);
}
