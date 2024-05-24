// this function checks if the form is completed and prints into the console the selected values
// if some questions are left unanswered a message is sent to the user
function update() {
    var form = document.getElementById("myForm");
    let isValid = true
    // Accessing selected age group
    var selectedAge = form.querySelector('#age').value;
    if (selectedAge == "") {
        alert("Per favore, indica la tua età");
        isValid = false
    }

    // Accessing selected gender
    var selectedGender = form.querySelector('#gender').value;
    if (selectedGender == "") {
        alert("Per favore, indica il tuo genere");
        isValid = false
    }

    // Accessing selected education level
    var selectedEducation = form.querySelector('#education').value;
    if (selectedEducation == "") {
        alert("Per favore, indica il tuo livello d'istruzione");
        isValid = false
    }

    // Accessing selected political orientation
    var selectedPolitics = form.querySelector('#politics').value;
    if (selectedPolitics == "") {
        alert("Per favore, indica il tuo orientamento politico");
        isValid = false
    }
    // Accessing region
    var selectedRegion = form.region.value;
    if (selectedRegion == "") {
        alert("Per favore, indica la tua regione");
        isValid = false
    }
    // Accessing view on question
    var opinion1 = form.pol.value;
    if (opinion1 == "") {
        alert("Per favore, indica la tua opinione");
        isValid = false
    }

    if (isValid == false) {preventDefault()}
    console.log("Selected Age: ", selectedAge);
    console.log("Selected Gender: ", selectedGender);
    console.log("Selected Education Level: ", selectedEducation);
    console.log("Selected Political Orientation: ", selectedPolitics);
    console.log(selectedRegion)
    console.log(opinion1);
}

// Run update() function when the submit button is pressed
document.getElementById("submitQuestionnaireButton").addEventListener('click', update);
