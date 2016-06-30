$(document).ready(function() {

  //////////////////////////////////////////////////////////////////////////////
  // Modifies the DOM to show the given quote and source.
  //
  //  Arguments:
  //    quote: the quote to be displayed.
  //    source: the person whom the quote originates from.
  //
  //  Returns: nothing.
  //////////////////////////////////////////////////////////////////////////////
  var setQuoteDOM = function(quote, source) {

    // Set quote.
    $("#container-quote").text(quote);

    // If a quote source was provided, add it to the DOM, and unhide quote and
    // source.
    if (source) {

      // Set the quote.
      $("#container-quote-source").html("&ndash;" + source);

      // Unhide.
      $("#container-quote-source").removeClass("hidden");
      $("#container-social-media").removeClass("hidden");

    } else { // No quote source provided.

      // Blank the quote and hide.
      $("#container-quote-source").text("");
      $("#container-quote-source").addClass("hidden");
      $("#container-social-media").addClass("hidden");
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Modifies the Social Media buttons to include quote information
  //
  //  Arguments:
  //    quote: the quote to be displayed.
  //    source: the person whom the quote originates from.
  //
  //  Returns: nothing.
  //////////////////////////////////////////////////////////////////////////////
  var setSocialMediaDOM = function(quote, source) {
    $("#container-social-media > a").attr("href", "https://twitter.com/intent/tweet?text=" + encodeURI(quote + " " + "-" + source));
  }

  //////////////////////////////////////////////////////////////////////////////
  // Given an array of quotes, return a randomly selected quote.
  //
  //  Arguments:
  //    arrayQuotes: an array of quotes.
  //
  //  Returns:
  //    randomly selected quote.
  //////////////////////////////////////////////////////////////////////////////
  var randomlySelectQuote = function(arrayQuotes) {

    // Randomly select one number from 0 to quotes.length.
    var idx = Math.floor(Math.random() * arrayQuotes.length);

    // Return quote.
    return arrayQuotes[idx];
  }

  //////////////////////////////////////////////////////////////////////////////
  // Meta-function which randomly selects a quote from a given array of quotes,
  // modifies the DOM to display it, modifies social media links as well.
  //
  //  Arguments:
  //    arrayQuotes: an array of quotes.
  //
  //  Returns: nothing.
  //////////////////////////////////////////////////////////////////////////////
  var randomlySelectQuoteAndModifyDOM = function(arrayQuotes) {

    // Get a randomly selected quote.
    var quote = randomlySelectQuote(arrayQuotes);

    // Modify the DOM.
    setQuoteDOM(quote["quote"], quote["source"]);

    // Modify Social Media Buttons.
    setSocialMediaDOM(quote["quote"], quote["source"]);

  }

  //////////////////////////////////////////////////////////////////////////////
  // AJAX callabacks.
  //////////////////////////////////////////////////////////////////////////////

  // When quotes have been successfully been retrieved, use this function.
  //
  // Gets the quotes, modifies DOM, sets background video.
  var callbackSuccessGetQuotes = function(data) {

      // If the request succeeds, store the quotes in the global quotes variable.
      quotes = data;

      // Modify DOM to display a message that the user is permitted to generate
      // a quote.
      setQuoteDOM("Click here to generate a quote.");

      // If the array of quotes is not empty, enable events.
      if (quotes.length > 0) {

        // Generate quotes in permitted clickable areas.
        $("#area-generate-quote, #mask").on("click", function() {

          // Randomly select a quote and modify the DOM.
          randomlySelectQuoteAndModifyDOM(quotes);

          // Play sound on click.
          audioClick.trigger("play");
        });

        // Generate quotes on key release.
        $("body").on("keyup", function() {

          // Randomly select a quote and modify the DOM.
          randomlySelectQuoteAndModifyDOM(quotes);

          // Play sound on click.
          audioClick.trigger("play");
        });
      }
    }// end callbackSuccessGetQuotes().

  // If quotes were not able to be retrieved, use this function.
  //
  // Modify DOM to show error message. Remove background image/video.
  var callbackFailGetQuotes = function(e) {

    // Display error message on the DOM.
    setQuoteDOM("Error. Unable to load quote data.");

    // Remove background video.
    $("#bg-video").remove();

    // Remove background image.
    $("body").css("background-image", "none");

    // Set quote container to middle since videos.
    $(".container").css("top", "50%");
  } // end callbackFailGetQuotes.

  // If videos have been successfully retrieved, use this function.
  //
  // Randomly select a video to be used as a background.
  // Check if using a mobile device, if on mobile, remove video and fall back
  // to static background image.
  var callbackSuccessGetVideos = function(data) {

      // Check for mobile device.
      if ( (/iphone|ipod|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) ) {

        // If mobile, remove video container.
        //$("#container-video").remove();

      } else { // If not mobile, set video background.

        // Randomly select a video.
        var idx = Math.floor(Math.random() * data.length);

        // Get the video id.
        var videoId = data[idx]["video_id"];

        // Generate embedded URL.
        var embedUrl = "https://youtube.com/embed/" + videoId + "?autoplay=1&controls=0&showinfo=0&autohide=1";

        // Check if the video has a logo.
        // This is a property of data[video_id].
        //
        // This signifies that the video has a game logo at the top,
        // and an offset must be applied so the text does not overlap.
        //
        // Shift down from 50% to 60%.
        if (data[idx]["logo"] === true) {
          $(".container").css("top", "60%");
        }

        // Show the video
        $("#bg-video").attr("src", embedUrl);

      }// done checking for mobile.
    } // end callbackSuccessGetVideos().

  // If videos could not be obtained, use this function.
  //
  // Remove video container.
  var callbackFailGetVideos = function(e) {

    // If the video list cannot be obtained, delete the video container
    // to prevent black background.
    //
    // Since a background image is already loaded, it will be the fallback
    // option.
    $("#container-video").remove();

  }









  // Array of quotes in JSON format.
  var quotes = [];

  // Load audio click sound.
  var audioClick = $("#audio-click");

  //////////////////////////////////////////////////////////////////////////////
  // Load quotes via AJAX request.
  //
  // If quotes are successfully loaded, enable mouse and keyboard events to
  // randomly select a quote.
  //
  // If loading was not successful, show error message, remove all backgrounds.
  //////////////////////////////////////////////////////////////////////////////
  var ajaxGetQuotes = $.getJSON("data/quotes.json");
  ajaxGetQuotes.done(callbackSuccessGetQuotes);
  ajaxGetQuotes.fail(callbackFailGetQuotes);

  //////////////////////////////////////////////////////////////////////////////
  // Load video background via AJAX request.
  //
  // If list of videos were successul, randomly select a video and set it as
  // the background.
  //
  // If loading was not successful, remove the video background container,
  // and fall back to the static background image.
  //////////////////////////////////////////////////////////////////////////////
  var ajaxGetVideos = $.getJSON("data/videos.json");
  ajaxGetVideos.done(callbackSuccessGetVideos);
  ajaxGetVideos.fail(callbackFailGetVideos);

});
