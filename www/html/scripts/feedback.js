window.onload = function() {
    const form = document.getElementById('feedback_form');
    const submit = document.getElementById('form_submit');

    function validateForm(event) {
        event.preventDefault();

        form.hidden = true;
        console.log("Form submitted!");
    }

    // Hide form once submitted
    form.addEventListener('submit', validateForm);

    console.log("hello");
};