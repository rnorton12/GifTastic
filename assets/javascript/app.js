$(document).ready(function () {

    // this is what the default animal list will contain
    var animalTypeArray = ["dog", "cat", "rabbit", "chicken", "bird", "sugar glider", "frog"];

    // define animal object array to store objects that will contain relevant information for each query item returned
    var animalObjectArray = [];

    // define a gif api object that will hold information needed for the AJAX query.
    // also this object will define the gif display state (still or animated)
    var gifApiObject = {
        gifState: {
            still: "still",
            animated: "animated"
        },
        apiKey: "X1V2BUS0MZ6grwEYwEVTno1za1ICpU2N",
        searchTerm: "", // current search term
        resultsLimit: 10,  // number of gifs to retrieve for each query
        resultsOffset: 0  // results offset defines where to start the query
    };

    var headingCharacters = ["G", "I", "F", "T", "A", "S", "T", "I", "C"];
    headingObjectArray = [];

    // animated letters for the page heading
    // will be used to spell out the heading characters
    gifLetterImageObject = {
        letterA: "./assets/images/animated-letter-image-A.gif",
        letterC: "./assets/images/animated-letter-image-C.gif",
        letterF: "./assets/images/animated-letter-image-F.gif",
        letterG: "./assets/images/animated-letter-image-G.gif",
        letterI: "./assets/images/animated-letter-image-I.gif",
        letterS: "./assets/images/animated-letter-image-S.gif",
        letterT: "./assets/images/animated-letter-image-T.gif"
    };

    // hide Back button on the page
    function hideBackButton() {
        $("#back-button").hide();
    }

    // show the Back button on the page
    function showBackButton() {
        $("#back-button").show();
    }

    // disable the Back button on the page so it is not clickable
    function disableBackButton() {
        $("#back-button").prop("disabled", true);
    }

    // enable the Back button on the page so it is clickable
    function enableBackButton() {
        $("#back-button").prop("disabled", false);
    }

    // hide Next button on the page
    function hideNextButton() {
        $("#next-button").hide();
    }

    // show Next button on the page
    function showNextButton() {
        $("#next-button").show();
    }

    // remove all animal buttons from the page
    function removeButtons() {
        $(".animal").remove();
    }

    // remove any gifs currently being displayed
    function removeGifs() {
        $(".button-image").remove();
    }

    // create the objects for the page heading
    function createHeading() {
        for (var i = 0; i < headingCharacters.length; i++) {

            // define an object for each letter in the heading
            var letterObject = {
                letter: headingCharacters[i],
                image: "",
                width: "65px",
                height: "65px"
            };

            // select the appropriate image gif for the current letter
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

            // append the letter object to the heading object array
            headingObjectArray.push(letterObject);
        }
    }

    // display the heading characters as image gifs
    function displayHeading() {
        createHeading();
        for (var i = 0; i < headingObjectArray.length; i++) {
            var $image = $("<img>");
            $image.attr("src", headingObjectArray[i].image);
            $image.attr("alt", headingObjectArray[i].letter);
            $image.attr("width", headingObjectArray[i].width);
            $image.attr("height", headingObjectArray[i].height);

            $("#heading").append($image);
        }
    }

    // make an API call to retrieve the gifs
    function queryGifs(searchTerm, api_key, limit, offset) {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + api_key + "&limit=" + limit + "&offset=" + offset;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {

            // reset the object array
            animalObjectArray = [];

            console.log(response.data.length);
            for (var i = 0; i < response.data.length; i++) {

                // define a gifObject that stores information for the gif
                var gifObject = {
                    title: "",
                    picture: {  // still picture for the gif at a compressed size (fixed_width_still)
                        url: "",
                        width: "",
                        height: ""
                    },
                    gif: {  // animated gif at a compressed size (fixed_width_small)
                        url: "",
                        width: "",
                        height: ""
                    },
                    original: { // orignal size of the animated gif
                        url: "",
                        width: "",
                        height: ""
                    },
                    rating: "",
                    state: "" // will track the state of image (still or animated)
                };

                // fill in the object with the data retrieve from the API query
                gifObject.title = response.data[i].title;
                gifObject.picture.url = response.data[i].images.fixed_width_still.url;
                gifObject.picture.width = response.data[i].images.fixed_width_still.width;
                gifObject.picture.height = response.data[i].images.fixed_width_still.height;

                gifObject.gif.url = response.data[i].images.fixed_width_small.url;
                gifObject.gif.width = response.data[i].images.fixed_width_small.width;
                gifObject.gif.height = response.data[i].images.fixed_width_small.height;

                gifObject.original.url = response.data[i].images.original.url;
                gifObject.original.width = response.data[i].images.original.width;
                gifObject.original.height = response.data[i].images.original.height;

                gifObject.rating = response.data[i].rating.toUpperCase();
                gifObject.state = gifApiObject.gifState.still;

                // append the gif object to the animal object array
                animalObjectArray.push(gifObject);

                // display the image
                displayGifs(i);

                // increment the results offset by 1
                offset++;
            } // end for loop

            console.log(offset);
            // store the results offset
            gifApiObject.resultsOffset = offset;
        });
    }

    function renderButtons() {
        hideBackButton();
        hideNextButton();
        for (var i = 0; i < animalTypeArray.length; i++) {
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var $button = $("<button>");
            // set the class
            $button.addClass("btn btn-primary animal m-1");
            $button.attr("type", "button");
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
        $btn.addClass("btn btn-light button-image m-1"); // set the class
        $btn.attr("type", "button"); // set the bootstrap "type" attribute
        $btn.attr("value", index);

        // add a figure to the button element.
        // the figure will contain the character's image
        var $figure = $("<figure>");
        $figure.attr("id", "figure-" + index);
        $figure.addClass("figure");

        // add a caption to the top of the character image.
        // the top caption will contain the name of the character
        var $figCaptionTop = $("<figcaption>");
        $figCaptionTop.addClass("figure-caption text-dark"); // set the class
        $figCaptionTop.text("Rated: " + animalObjectArray[index].rating);

        // add a caption to the bottom of the character image.
        // the bottom caption will contain the characters starting health points
        var $figCaptionBottom = $("<figcaption>");
        $figCaptionBottom.addClass("figure-caption");
        $figCaptionBottom.text("");

        // Add an image to the button element
        var $image = $("<img>");
        $image.addClass("myImage");
        $image.attr("id", "img-" + index);
        $image.attr("src", animalObjectArray[index].picture.url);
        $image.attr("value", index);
        $image.attr("width", "125");
        $image.attr("height", "125");
       // <button type="button" class="btn btn-primary expand" data-toggle="modal" data-target=".my-modal"></button>
        
        // add a button to the bottom of the image
        var $expand = $("<button>");
         $expand.addClass("btn btn-primary btn-sm expand my-1");
         $expand.attr("id", "expand-" + index);
         $expand.attr("type", "button");
         $expand.attr("value", index);
         $expand.attr("data-toggle", "modal");
         $expand.attr("data-target", "#my-modal");
         $expand.text("Expand");

        $("#gifs").append($btn);

        var elementId = "#button-" + index;
        $(elementId).append($figCaptionTop);
        $(elementId).append($figure);
        $(elementId).append($image);
        $(elementId).append($figCaptionBottom);
        $(elementId).append($expand);
    }

    function animateGif(index) {
        console.log("animateGif");

        var imageSrc = "";

        if (animalObjectArray[index].state === gifApiObject.gifState.still) { // still
            // switch to animated image
            imageSrc = animalObjectArray[index].gif.url;

            // update the state
            animalObjectArray[index].state = gifApiObject.gifState.animated;

        } else { // animated
            // switch to still image
            imageSrc = animalObjectArray[index].picture.url;

            // update the state
            animalObjectArray[index].state = gifApiObject.gifState.still;
        }
        // update the image src attribute
        $("#img-" + index).attr("src", imageSrc);
    }

    function getMoreGifsBack() {
        var searchTerm = gifApiObject.searchTerm;
        var apiKey = gifApiObject.apiKey;
        var limit = gifApiObject.resultsLimit;
        var offset = gifApiObject.resultsOffset;

        offset -= (2 * limit);
        if (offset <= 0) {
            offset = 0;
            disableBackButton();
        }
        gifApiObject.resultsOffset = offset;

        console.log("back-offset: " + offset);
        removeGifs();
        queryGifs(searchTerm, apiKey, limit, offset);
    }

    function getMoreGifsNext() {
        var searchTerm = gifApiObject.searchTerm;
        var apiKey = gifApiObject.apiKey;
        var limit = gifApiObject.resultsLimit;
        var offset = gifApiObject.resultsOffset;

        //      offset += limit;
        //       gifApiObject.resultsOffset = offset;

        //       console.log("next-offset: " + offset);
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

    $(document).on("click", ".button-image", ".myImage", function () {
        var gifValue = $(this).attr("value");

        console.log("gifValue = " + gifValue);
        animateGif(gifValue);
    });

    $(document).on("click", "#back-button", function () {
        getMoreGifsBack();
    });

    $(document).on("click", "#next-button", function () {
        getMoreGifsNext();
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

    $(document).on("click", ".expand", function () {
        var index = $(this).attr("value");
        console.log("index = " + index);

        var $image = $("<img>");
        $image.addClass("img-fluid myImage");
        $image.attr("id", "img-" + index);
        $image.attr("src", animalObjectArray[index].original.url);
        $image.attr("value", index);
        $image.attr("width", animalObjectArray[index].original.width);
        $image.attr("height", animalObjectArray[index].original.height);

        $(".expanded-gif").append($image);
        $(".modal-title").text(animalObjectArray[index].title);
    });

    $(document).on("click", ".close-modal", function () {
        $(".expanded-gif").empty();
    });
});
