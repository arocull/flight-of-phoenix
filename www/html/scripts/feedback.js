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


window.onload = function() {
    /** @type {HTMLForm} */
    const form = document.getElementById('feedback_form');
    const thanks = document.getElementById('thanks');

    /** @type {HTMLInputElement} */
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

    overall.oninput = function () {
        overallLabel.textContent = overall.value;
    }
    recommend.oninput = function () {
        recommendLabel.textContent = recommend.value;
    }
    comments.onfocus = function() {
        if (comments.textContent == 'Type here.') {
            comments.value = '';
            comments.textContent = '';
        }

        comments.value = comments.value.trim();
    };


    // Run setup
    overall.oninput();
    recommend.oninput();


    function validateForm(event) {
        event.preventDefault();

        let verified = true;

        controlsLabel.classList = '';
        discoveryLabel.classList = '';
        featureLabel.classList = '';

        // Gather and process form data
        comments.onfocus(); // Clear out default text if there, and trim

        const controlsScore = checkRadio(radio_controls);
        const discoveryScore = checkRadio(radio_discovery);
        const featureScore = checkRadio(radio_feature);
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

        // Submit form data using an XMLHttpRequest()
        const data = JSON.stringify({
            overall: overall.value,
            recommend: recommend.value,
            controls: controlsScore,
            discovery: discoveryScore,
            feature: featureScore,
            comment: comments.value,
        });

        console.log("Feedback accepted! Form data:\n", data);
    }

    // Hide form once submitted
    form.addEventListener('submit', validateForm);
};