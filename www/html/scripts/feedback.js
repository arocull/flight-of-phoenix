/**
 * @function checkRadio
 * @summary Checks a list of radio inputs and returns the selected one's value
 * @param {String[]} radioNameList Document IDs of radio buttons
 * @returns {String} Selected radio's value, or undefined if none have been checked
 */
function checkRadio(radioNameList) {
    let selected = undefined;

    radioNameList.forEach((value, index, arr) => {
        const radio = document.getElementById(value);
        if (radio && radio.checked) {
            selected = radio.value;
        }
    });

    return selected;
}


// Wait for document to load before form becomes active
window.onload = function() {
    /** @type {HTMLForm} */
    const form = document.getElementById('feedback_form');
    const thanks = document.getElementById('thanks');

    // Gather all the HTML elements ahead of time for speedy processing later
    const overall = document.getElementById('overall_score');
    const overallLabel = document.getElementById('overall_score_value');
    const recommend = document.getElementById('recommend_score');
    const recommendLabel = document.getElementById('recommend_score_value');
    const controlsLabel = document.getElementById('controls_label');
    const radio_controls = [
        "controls_good",
        "controls_okay",
        "controls_bad",
        "controls_unsure",
    ];
    const discoveryLabel = document.getElementById('discovery_label');
    const radio_discovery = [
        "discovery_friend",
        "discovery_git",
        "discovery_web",
        "discovery_other",
    ];
    const featureLabel = document.getElementById('feature_label');
    const radio_feature = [
        "feature_levels",
        "feature_movement",
        "feature_obstacles",
        "feature_art",
        "feature_unsure",
    ];
    const comments = document.getElementById('comments');

    // Update slider value labels
    overall.oninput = function () {
        overallLabel.textContent = overall.value;
    }
    recommend.oninput = function () {
        recommendLabel.textContent = recommend.value;
    }

    // Clear the "Type here" text on the comments section when focused
    // Note: causes visual errors when page is refreshed?
    comments.onfocus = function() {
        if (comments.textContent == 'Type here.') {
            comments.value = '';
            comments.textContent = '';
        }

        comments.value = comments.value.trim();
    };


    // Run setup (just sets up slider value indicators/labels)
    overall.oninput();
    recommend.oninput();


    function validateForm(event) {
        event.preventDefault(); // Don't let the form refresh the page! Bad HTML! Bad!

        let verified = true;

        // Clear errors to make future errors easier to identify
        controlsLabel.classList = '';
        discoveryLabel.classList = '';
        featureLabel.classList = '';

        // Verify form data real quick
        comments.onfocus(); // Clear out default text if there, and trim

        // Check radios
        const controlsScore = checkRadio(radio_controls);
        const discoveryScore = checkRadio(radio_discovery);
        const featureScore = checkRadio(radio_feature);

        // If a radio is unchecked, end verification, and indicate unanswered question
        if (controlsScore == undefined) {
            controlsLabel.classList = "error";
            verified = false;
        }
        if (discoveryScore == undefined) {
            discoveryLabel.classList = "error";
            verified = false;
        }
        if (featureScore == undefined) {
            featureLabel.classList = "error";
            verified = false;
        }


        if (!verified) return; // Allow form to be edited if not verified
        form.hidden = true; // Hide form so user does not submit multiple
        thanks.hidden = false; // Show thanks

        // Gather data together and stringify it for sending (so there aren't JS object stuff packed inside)
        const data = JSON.stringify({
            overall: overall.value,
            recommend: recommend.value,
            controls: controlsScore,
            discovery: discoveryScore,
            feature: featureScore,
            comment: comments.value,
        });
        // Submit form data using an XMLHttpRequest()
        // No spot on server to accept it because idk how to do that haha

        // Print data out in output, just incase you want to see
        console.log("Feedback accepted! Form data:\n", data);
    }

    // Process form when submitted
    form.addEventListener('submit', validateForm);
};