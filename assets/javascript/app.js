$(document).ready(function () {

    var animalTypeArray = ["dog", "cat", "rabbit", "chicken", "bird", "sugar glider", "frog"];
    var animalObjectArray = [];
    var GIFSTATE = ["still", "animated"];
    var API_KEY = "X1V2BUS0MZ6grwEYwEVTno1za1ICpU2N";
    var currentSearchTerm = "";
    var LIMIT = 10;
    var increment = 0;
    
    function removeButtons() {
        $(".animal").remove();
    }

    function removeGifs() {
        // remove any previous gifs displayed
        $(".button-image").remove();
    }
    function queryGifs(searchTerm, api_key, offset) {
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + api_key + "&limit=10&offset=" + offset;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {


            // reset the object array
            animalObjectArray = [];

            console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                var gifObject = {
                    type: "",
                    picture: "",
                    gif: "",
                    title: "",
                    rating: "",
                    state: "" // still
                };
                gifObject.picture = response.data[i].images.fixed_width_still.url;
                gifObject.gif = response.data[i].images.fixed_width_small.url;
                gifObject.title = response.data[i].title;
                gifObject.rating = response.data[i].rating;
                gifObject.state = GIFSTATE[0];

                animalObjectArray.push(gifObject);
                displayGifs(i);
            } // end for loop
            increment++;
        });
    }

    function renderButtons() {
        //removeGifs();

        for (var i = 0; i < animalTypeArray.length; i++) {
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var $button = $("<button>");
            // Adding a class of movie to our button
            $button.addClass("animal");
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

        //               $image.attr("width", response.data[i].images.original_still.width);
        $image.attr("width", "100");
        //               $image.attr("height", response.data[i].images.original_still.height);
        $image.attr("height", "100");

        $("#gifs").append($btn);
        $("#button-" + index).append($figCaptionTop);
        $("#button-" + index).append($figure);
        $("#button-" + index).append($image);
        $("#button-" + index).append($figCaptionBottom);
    }

    function animateGif(id, index) {
        console.log("animateGif");
        
        var imageSrc = "";

        if (animalObjectArray[index].state === GIFSTATE[0]) { // still
            // switch to animated image
            imageSrc = animalObjectArray[index].gif;

            // update the state
            animalObjectArray[index].state = GIFSTATE[1];

        } else { // animated
            // switch to still image
            imageSrc = animalObjectArray[index].picture;

            // update the state
            animalObjectArray[index].state = GIFSTATE[0];
        }
        // update the image src attribute
        $("#" + id).attr("src", imageSrc);
    }

    function getMoreGifs(searchTerm) {
        removeGifs();
        
            offset = increment * LIMIT;
            increment++;
        
        
        queryGifs(searchTerm, API_KEY, offset);

    }

    renderButtons();

    // Adding a click event listener to all elements with a class of "movie"
    $(document).on("click", ".animal", function () {
        currentSearchTerm = $(this).attr("data-name");
        offset = 0;
        increment = 0;
        removeGifs();

        queryGifs(currentSearchTerm, API_KEY, offset);
    });

    $(document).on("click", ".myImage", function () {
        var gifId = $(this).attr("id");
        var gifValue = $(this).attr("value");

        console.log("gidId = " + gifId);
        console.log("gifValue = " + gifValue);
        animateGif(gifId, gifValue);
    });

    $(document).on("click", ".moreGifs", function () {
        getMoreGifs(currentSearchTerm);
    });

    $("#user-input").on("click", function () {
        removeGifs();
        removeButtons();
        console.log($(this).val());
        animalTypeArray.push($(this).val());
        renderButtons();
    });

});