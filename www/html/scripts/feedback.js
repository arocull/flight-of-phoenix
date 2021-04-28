window.onload = function() {
    /** @type {HTMLForm} */
    const form = document.getElementById('feedback_form');
    const thanks = document.getElementById('thanks');

    function validateForm(event) {
        event.preventDefault();

        // Hide form so user does not submit multiple
        form.hidden = true;


        // Gather and process form data
        // console.log(FormData(form));


        // Submit using an XMLHttpRequest()


        // Show thanks
        thanks.hidden = false;
    }

    // Hide form once submitted
    form.addEventListener('submit', validateForm);
};