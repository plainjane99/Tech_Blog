// file that dashboard uses to create new posts
async function newFormHandler(event) {
    event.preventDefault();

    // on form submission, grab post-title and post-url values from form
    // and send them with a POST request
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('input[name="post-text"]').value;

    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_text
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);