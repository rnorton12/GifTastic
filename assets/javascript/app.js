$(document).ready(function () {

    var animalTypeArray = ["dog", "cat", "rabbit", "chicken", "bird", "sugar glider", "frog"];
    var animalObjectArray = [];

    var gifApiObject = {
        gifState: {
            still: "still",
            animated: "animated"
        },
        apiKey: "X1V2BUS0MZ6grwEYwEVTno1za1ICpU2N",
        searchTerm: "",
        resultsLimit: 10,
        resultsOffset: 0
    };

    var headingCharacters = ["G", "I", "F", "T", "A", "S", "T", "I", "C"];
    headingObjectArray = [];

    // animated letters for the page heading
    // will spell GIFTASTIC
    gifLetterImageObject = {
        letterA: "./assets/images/animated-letter-image-A.gif",
        letterC: "./assets/images/animated-letter-image-C.gif",
        letterF: "./assets/images/animated-letter-image-F.gif",
        letterG: "./assets/images/animated-letter-image-G.gif",
        letterI: "./assets/images/animated-letter-image-I.gif",
        letterS: "./assets/images/animated-letter-image-S.gif",
        letterT: "./assets/images/animated-letter-image-T.gif"
    };

    function hideBackButton() {
        $("#back-button").hide();
    }

    function showBackButton() {
        $("#back-button").show();
    }

    function disableBackButton() {
        $("#back-button").prop("disabled", true);
    }

    function enableBackButton() {
        $("#back-button").prop("disabled", false);
    }

    function hideNextButton() {
        $("#next-button").hide();
    }

    function showNextButton() {
        $("#next-button").show();
    }

    function removeButtons() {
        $(".animal").remove();
    }

    function removeGifs() {
        // remove any previous gifs displayed
        $(".button-image").remove();
    }

    function createHeading() {
        for (var i = 0; i < headingCharacters.length; i++) {
            var letterObject = {
                letter: headingCharacters[i],
                image: "",
                width: "65px",
                height: "65px"
            };

            if (headingCharacters[i].toUpperCase() === "A") {
                letterObject.image = gifLetterImageObject.letterA;
            } else if (headingCharacters[i].toUpperCase() === "C") {
                letterObject.image = gifLetterImageObject.letterC;
            } else if (headingCharacters[i].toUpperCase() === "F") {
                letterObject.image = gifLetterImageObject.letterF;
            } else if (headingCharacters[i].toUpperCase() === "G") {
                letterObject.image = gifLetterImageObject.letterG;
            } else if (headingCharacters[i].toUpperCase() === "I") {
                letterObject.image = gifLetterImageObject.letterI;
            } else if (headingCharacters[i].toUpperCase() === "S") {
                letterObject.image = gifLetterImageObject.letterS;
            } else {
                letterObject.image = gifLetterImageObject.letterT;
            }

            headingObjectArray.push(letterObject);
        }
    }

    function displayHeading() {
        createHeading();
        for (var i = 0; i < headingObjectArray.length; i++) {
            var $imageTag = $("<img>");
            $imageTag.attr("src", headingObjectArray[i].image);
            $imageTag.attr("alt", headingObjectArray[i].letter);
            $imageTag.attr("width", headingObjectArray[i].width);
            $imageTag.attr("height", headingObjectArray[i].height);

            $("#heading").append($imageTag);
        }
    }

    function queryGifs(searchTerm, api_key, limit, offset) {
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + api_key + "&limit=" + limit + "&offset=" + offset;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {


            // reset the object array
            animalObjectArray = [];

            console.log(response.data.length);
            for (var i = 0; i < response.data.length; i++) {
                var gifObject = {
                    type: "",
                    picture: "",
                    gif: "",
                    rating: "",
                    state: "" // still
                };
                gifObject.picture = response.data[i].images.fixed_width_still.url;
                gifObject.gif = response.data[i].images.fixed_width_small.url;
                gifObject.rating = response.data[i].rating;
                gifObject.state = gifApiObject.gifState.still;

                animalObjectArray.push(gifObject);
                displayGifs(i);
                offset++;
            } // end for loop
            console.log(offset);
        });
    }

    function renderButtons() {
        hideBackButton();
        hideNextButton();
        $("#main-gif-row").hide();

        for (var i = 0; i < animalTypeArray.length; i++) {
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var $button = $("<button>");
            // Adding a class of movie to our button
            $button.addClass("btn btn-primary animal mx-1");
            // Adding a data-attribute
            $button.attr("data-name", animalTypeArray[i]);
            // Providing the initial button text
            $button.text(animalTypeArray[i]);
            // Adding the button to the buttons div
            $("#buttons").append($button);
        }
    }

    function displayGifs(index) {
        // Create a new button element
        var $btn = $("<button>"); //Equivalent: $(document.createElement('button'))
        $btn.attr("id", "button-" + index); // set the button id
        $btn.addClass("button-image"); // set the class
        $btn.attr("type", "button"); // set the bootstrap "type" attribute

        // add a figure to the button element.
        // the figure will contain the character's image
        var $figure = $("<figure>");
        $figure.attr("id", "figure-" + index);
        $figure.addClass("figure");

        // add a caption to the top of the character image.
        // the top caption will contain the name of the character
        var $figCaptionTop = $("<figcaption>");
        $figCaptionTop.addClass("figure-caption"); // set the class
        $figCaptionTop.text("Rated: " + animalObjectArray[index].rating);

        // add a caption to the bottom of the character image.
        // the bottom caption will contain the characters starting health points
        var $figCaptionBottom = $("<figcaption>");
        $figCaptionBottom.addClass("figure-caption");
        //        $figCaptionBottom.text(animalObjectArray[index].title);
        $figCaptionBottom.text("");

        // Add an image to the button element
        var $image = $("<img>");
        $image.addClass("myImage");
        $image.attr("id", "img-" + index);
        $image.attr("src", animalObjectArray[index].picture);
        $image.attr("value", index);
        $image.attr("width", "125");
        $image.attr("height", "125");

        $("#gifs").append($btn);
        $("#button-" + index).append($figCaptionTop);
        $("#button-" + index).append($figure);
        $("#button-" + index).append($image);
        $("#button-" + index).append($figCaptionBottom);
    }

    function animateGif(id, index) {
        console.log("animateGif");

        var imageSrc = "";

        if (animalObjectArray[index].state === gifApiObject.gifState.still) { // still
            // switch to animated image
            imageSrc = animalObjectArray[index].gif;

            // update the state
            animalObjectArray[index].state = gifApiObject.gifState.animated;

        } else { // animated
            // switch to still image
            imageSrc = animalObjectArray[index].picture;

            // update the state
            animalObjectArray[index].state = gifApiObject.gifState.still;
        }
        // update the image src attribute
        $("#" + id).attr("src", imageSrc);
    }

    function getMoreGifsBack(searchTerm) {
        var searchTerm = gifApiObject.searchTerm;
        var apiKey = gifApiObject.apiKey;
        var limit = gifApiObject.resultsLimit;
        var offset = gifApiObject.resultsOffset;

        offset -= limit;
        if (offset <= 0) {
            offset = 0;
            disableBackButton();
        }
        gifApiObject.resultsOffset = offset;

        console.log("back-offset: " + offset);
        removeGifs();
        queryGifs(searchTerm, apiKey, limit, offset);
    }

    function getMoreGifsNext(searchTerm) {
        var searchTerm = gifApiObject.searchTerm;
        var apiKey = gifApiObject.apiKey;
        var limit = gifApiObject.resultsLimit;
        var offset = gifApiObject.resultsOffset;

        offset += limit;
        gifApiObject.resultsOffset = offset;

        console.log("next-offset: " + offset);
        removeGifs();
        queryGifs(searchTerm, apiKey, limit, offset);
        enableBackButton();
    }

    displayHeading();
    renderButtons();

    // Adding a click event listener to all elements with a class of "animal"
    $(document).on("click", ".animal", function () {
        var searchTerm = $(this).attr("data-name");
        var apiKey = gifApiObject.apiKey;
        var limit = gifApiObject.resultsLimit;
        var offset = 0;

        gifApiObject.searchTerm = searchTerm;
        gifApiObject.resultsOffset = offset;

        console.log("animal-offset: " + offset);
        showBackButton();
        disableBackButton();
        showNextButton();
        removeGifs();
        queryGifs(searchTerm, apiKey, limit, offset);
    });

    $(document).on("click", ".myImage", function () {
        var gifId = $(this).attr("id");
        var gifValue = $(this).attr("value");

        console.log("gidId = " + gifId);
        console.log("gifValue = " + gifValue);
        animateGif(gifId, gifValue);
    });

    $(".myImage").mouseenter(function () {
        var gifId = $(this).attr("id");
        console.log(mouse);
        $("#main-gif-row").show();
        $(gifId).clone().appendTo("#main-gif-image");
    });

    $(document).on("click", "#back-button", function () {
        var searchTerm = gifApiObject.searchTerm;
        getMoreGifsBack(searchTerm);
    });

    $(document).on("click", "#next-button", function () {
        var searchTerm = gifApiObject.searchTerm;
        getMoreGifsNext(searchTerm);
    });

    $("#submit").on("click", function (event) {
        event.preventDefault();
        var newItem = $("#new-item").val().trim();

        if (newItem.length) {
            console.log(newItem);
            removeGifs();
            removeButtons();
            animalTypeArray.push(newItem);
            renderButtons();
        }
    });

});