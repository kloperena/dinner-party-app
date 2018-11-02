$(document).ready(function () {
    var count = 1;
    var veggieOrNot = "";
    var cuisine = "";
    var dinnerOrApps = "";
    var coursesArray = [];

// ********** kayla giphy **********
    var choices = ["Herbivore", "Omnivore", "Vegan", "Appetizer", "Dinner", "Dessert", "American", "Italian", "Asian", "Mexican"];

    for (var i = 0; i < choices.length; i++) {
        var searchTerm = choices[i];
        GetApi(searchTerm);
    }

    function GetApi(item) {
        // var api = "http://api.giphy.com/v1/gifs/search?q=";
        var api = "http://api.giphy.com/v1/gifs/random?tag="
        var apiKey = "&api_key=970OuGvqNpkZ47otDRIUa6oiY05z35bq";
        var limit = "&limit=5";
        // var queryURL = api + item + apiKey + limit;
        var queryURL = api + item + apiKey;

        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            // var randImageIndex = Math.floor(Math.random() * response.data.length);
            // var url = response.data[randImageIndex].images.fixed_width_small.url;
                        var url = response.data.fixed_width_small_url;
            console.log(url);
           
            $("#" + item).attr("src", url);
            console.log("#" + item)
           
           }); //end of .then
    }

    // ********* end of giphy ***************
    //  MODAL *********
    function runModal() {
        $("#myModal").modal("show");
    }
 
    function checkModal() {
        var numberOfCheckedRadio = $('input:radio:checked').length;
        var numberOfCheckedBoxes = $('input:checkbox:checked').length;
        console.log('Checked Radio ' + numberOfCheckedRadio);
        console.log('Checked Checkboxes ' + numberOfCheckedBoxes);
 
        if (numberOfCheckedRadio < 2 || numberOfCheckedBoxes === 0) {
 
            console.log('RUN MODAL');
            runModal();
        }
        else {
            console.log('No Modal Need');
            checkingCourses();

        }
    }

    // ***********

    $("#menu").hide();
    $("#search-result").hide();
    $("#questionaire").hide();
    $('.toggle').hide();
    $("#jumbo").show();

$(".random-search").on('click', function (){
    console.log('Button Pressed');
});

function clickHide () {
    $('.show-hide').on('click', function () {
        console.log('Working!')
        var nameOfCourse = $(this).attr('value');

        console.log("clicked menu item: " + nameOfCourse);
        $('.toggle').hide();
        $('#' + nameOfCourse).show();
    });
};

    // start by pressing the start button // CSS should have its visibiity to hidden
    $("#start-button").on("click", function () {
        $("#questionaire").show();
        $('#jumbo').hide();
        // RESET RADIO BUTTONS WHEN CLICKED
        $("input[type='radio']").prop("checked", false);
    });

    $('.question1').on('click', function () {
        veggieOrNot = $(this).attr('value');
        console.log(veggieOrNot);

    });

    $('.question3').on('click', function () {
        cuisine = $(this).attr('value');
        cuisine = "%2C" + cuisine;
        console.log(cuisine);
    });

    function checkingCourses() {
        $(".question5:checked").each(function () {
            var chosenCourses = $(this).attr('value');
            coursesArray.push(chosenCourses);
            console.log(coursesArray);
        });

        coursesArray.forEach(function (eachCourse) {
            console.log(eachCourse);
            callAjax(eachCourse);
        });

        console.log('right before next page');
        $("#questionaire").hide();
        $("#menu").show();
    }

    $("#submit-button").on("click", function () {
        checkModal();
        // checkingCourses();
    })
    // ********************  Spoonacular Giphy  *******************************
    function callAjax(runCourses) {
        var spoonacularWeb = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/"
        // var typeOfSearch = "recipes/search?";
        var typeOfSearch = "recipes/random?";

        var searchQuery = "&tags=" + veggieOrNot + "%2C" + runCourses + cuisine;


        // var apiKey = "jXZdEQqqoLmshtu7H4S8PHFq5IIop1C2dOKjsn2Qq68up9LGVL"; //myapi
        var apiKey = "f7R9NvaY4kmshpAVod9aYMQNbpoPp1H1NKRjsnX54hIkp2rdQJ"; //heesub api
        var host = "spoonacular-recipe-food-nutrition-v1.p.mashape.com";


        var queryURL = spoonacularWeb + typeOfSearch + "number=1" + searchQuery;
        console.log(queryURL);
        console.log("BEFORE CALL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function (request) {
                request.setRequestHeader("X-Mashape-Key", apiKey);
                request.setRequestHeader("X-Mashape-Host", host)
            }
        }).then(function (response) {
            console.log(response);
            // food - contains objects
            var food = response.recipes[0];

            //create title
            var title = food.title;

            // adds title to .list-courses
            var h3gotoCourse = "#"+count;
            console.log(h3gotoCourse);
            count++;
            $(h3gotoCourse).attr('value', runCourses);
            $(h3gotoCourse).addClass('title show-hide');
            $(h3gotoCourse).text(runCourses);
            $('.list-courses').prepend($(h3gotoCourse));

            //adds Course Info (newDIV) to .each-course
            var newDIV = $('<div>')
            newDIV.addClass('toggle');
            newDIV.attr('id', runCourses);
            $('.each-course').prepend(newDIV);
            
            //adds title of recipe to corresponding id course
            var newH4 = $('<h4>');
            newH4.addClass('title');
            $(newH4).text(title);
            $('#' + runCourses).append(newH4);


            // Add the Image
            var imageFood = food.image;
            var newImg = $('<img>');
            newImg.attr("src", imageFood);
            $('#' + runCourses).append(newImg);
            // Create a place to put ingredients
            var newUL = $('<ul>');
            newUL.addClass('list-ingredients');
            $('#' + runCourses).append(newUL);
            // Add Ingredients
            var manyIngredients = food.extendedIngredients.length;
            for (var i = 0; i < manyIngredients; i++) {
                var items = food.extendedIngredients[i].name
                newListItem = $('<li>');
                newListItem.text(items);
                newListItem.attr('value', items);
                $(newUL).append(newListItem);
            }
            // Add the Instructions
            var theInstuctions = food.instructions;
            var newP = $('<p>');
            newP.addClass('instructions');
            newP.html(theInstuctions);
            $('#' + runCourses).append(newP);
            $('.toggle').hide();


            // ********CONSOLE LOG STUFF **********
            var splitInstructions = food.analyzedInstructions[0];
            console.log(splitInstructions);

            var idOfFood = food.id;
            console.log('ID of food ' + idOfFood);
            var howLongTakes = food.readyInMinutes;
            console.log('Takes ' + howLongTakes + ' mins');

            var howManyServings = food.servings;
            console.log('This Recipe Will Feed ' + howManyServings + ' people.');

            var manyIngredients = food.extendedIngredients.length;
            console.log('How Many Ingredients ' + manyIngredients);

            //tells you if vegan vegetarian or not
            var isVegetarian = food.vegetarian;
            var isVegan = food.vegan;
            if (isVegetarian === true) {
                console.log('Is Vegetarian!');
            }
            else {
                console.log('NOT Vegetrian!!');
            }
            if (isVegan === true) {
                console.log('Is Vegan!');
            }
            else {
                console.log('NOT Vegan!!');
            }
            //tells you what cuisines this recipe is categorised as
            var whatCuisine = food.cuisines;
            whatCuisine.forEach(function (eachCuisine) {
                console.log('list of cuisines: ' + eachCuisine);
            })
            //tells you what course this recipe is categorised as
            var whatCourses = food.dishTypes;
            whatCourses.forEach(function (eachCourse) {
                console.log('list of Course: ' + eachCourse);
            })
            clickHide();
        }) // end of .then


    } // end of function

    // *************** random function
    function randomAjax() {
        var spoonacularWeb = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/"
        // var typeOfSearch = "recipes/search?";
        var typeOfSearch = "recipes/random?";
        // var apiKey = "jXZdEQqqoLmshtu7H4S8PHFq5IIop1C2dOKjsn2Qq68up9LGVL"; //myapi
        var apiKey = "f7R9NvaY4kmshpAVod9aYMQNbpoPp1H1NKRjsnX54hIkp2rdQJ"; //heesub api
        var host = "spoonacular-recipe-food-nutrition-v1.p.mashape.com";


        var queryURL = spoonacularWeb + typeOfSearch + "number=1";
        console.log("BEFORE CALL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function (request) {
                request.setRequestHeader("X-Mashape-Key", apiKey);
                request.setRequestHeader("X-Mashape-Host", host)
            }
        }).then(function (response) {
            console.log(response);
            var food = response.recipes[0];
            var title = food.title;
            var searchResult = "#search-result"
            
            //adds title of recipe to corresponding id course
            var newH4 = $('<h4>');
            newH4.addClass('title');
            $(newH4).text(title);
            $(searchResult).append(newH4);


            // Add the Image
            var imageFood = food.image;
            var newImg = $('<img>');
            newImg.attr("src", imageFood);
            $('#' + runCourses).append(newImg);
            // Create a place to put ingredients
            var newUL = $('<ul>');
            newUL.addClass('list-ingredients');
            $('#' + runCourses).append(newUL);
            // Add Ingredients
            var manyIngredients = food.extendedIngredients.length;
            for (var i = 0; i < manyIngredients; i++) {
                var items = food.extendedIngredients[i].name
                newListItem = $('<li>');
                newListItem.text(items);
                newListItem.attr('value', items);
                $(newUL).append(newListItem);
            }
            // Add the Instructions
            var theInstuctions = food.instructions;
            var newP = $('<p>');
            newP.addClass('instructions');
            newP.html(theInstuctions);
            $('#' + runCourses).append(newP);
            $('.toggle').hide();

            clickHide();
        }) // end of .then


    } // end of function

}) // end of document.ready


// "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?number=1&tags=dinner%2C+vegan",
 