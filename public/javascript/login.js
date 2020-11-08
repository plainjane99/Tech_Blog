// handle the sign up submission
async function signupFormHandler(event) {
    event.preventDefault();

    // grab the data from the sign-up/log-in form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // make sure all fields have values before making the post request
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(response);

        // error handling 
        // check the response status
        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}

// handle the login submission
async function loginFormHandler(event) {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
            email,
            password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}
 
// listen for the submit event for sign up
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
// listen for the submit event for login
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);