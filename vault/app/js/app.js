var app = {};
app.menu = {};
app.search = {};
app.keys = {};
app.animations = {};
app.animations.tracked = [];

$(function() {
  app.search.init();
  app.menu.init();
  app.keys.init();

  // Listen to keys, close menu if visible
  $(document).keyup(function(e) {
    if (e.keyCode == app.keys.ESC) app.keys.handleESC();
  }).keydown(function(e) {
    if (e.keyCode == app.keys.arrowUp) app.keys.handleArrowUp(e);
    else if (e.keyCode == app.keys.arrowDown) app.keys.handleArrowDown(e);
    else if (e.keyCode == app.keys.enter) app.keys.handleEnter(e);
  });

  $(window).scroll(function(e){
    app.animations.onlyPlayVisible();
  });
});

app.search.init = function() {
  app.search.visible = false;
  // Click handlers
  $(".js-search").click(function(e) {
    e.preventDefault();
    !app.search.visible ? app.search.reveal() : app.search.hide();
  });
  // When searching
  $(".js-search-input").on("input", function(e) {
    app.search.updateResultsForQuery(this.value);
  });

  // TODO: Load search data
  // TODO: Check if search has already been loaded and cached

  // If not, load it
  $.getJSON( "/js/searchable.json", function(data) {
    app.search.data = data["items"];
  });
  // TODO: Store it (with some sort of version number so it can be verified that it's the latest version)

  // Bind mouseenter to move focus to hovered item
  $(".js-search-overlay").on("mouseenter", ".js-site-search-results-item", function() {
    app.search.focusItem(this);
  });
}

app.search.updateResultsForQuery = function(query) {
  query = query.toLowerCase();
  var hits = [];
  // Look through all items
  for (var i = 0; i < app.search.data.length; i++) {
    // For every item, look for hits
    var entryValues = Object.values(app.search.data[i]);
    var searchString = entryValues.join(" ").toLowerCase();
    var hit = searchString.indexOf(query);
    // Store new hit
    if (hit == -1) continue;
    hits.push(app.search.data[i]);
  }
  
  app.search.renderResults(hits);
}

app.search.renderResults = function(results) {
  var searchElements = $('<div />', {
        "class": 'site-search-content-results-list'});
  for (var i = 0; i < results.length; i++) {
    var rowClass = "site-search-results-item js-site-search-results-item";
    // Add "active" if first row
    if (i == 0) rowClass += " site-search-results-item-active"
    var newResult = $('<a />', {
        "class": rowClass,
        "href": results[i]["url"],
        "text": results[i]["title"]});
    newResult.append($('<span />', {
      "class": 'site-search-results-item-description',
      "text": results[i]["description"]}));
    searchElements.append(newResult)
  }
  $(".js-site-search-content-results").html(searchElements);
}

app.loadAndFadeInImages = function() {
  // Load background images
  $("[data-image]").each(function(i, elem) {
    var $elem = $(elem),
    url = "/images/" + $elem.attr('data-image');
    if (url == null || url.length <= 0 ) { return; }

    $elem.addClass('image-loading');      
    $bg = $('<div class="case-item-bg"/>');
    $bg.css( 'background-image', 'url(' + url + ')');
    $elem.prepend($bg);
    $bg.ready(function(e) { 
      $elem
      .removeClass('image-loading')
      .addClass('image-ready');
    });    
  });
}

app.menu.init = function() {
  app.menu.visible = false;
  // Top menu
  $('.menu').click(function(e) {
    e.preventDefault();
    !app.menu.visible ? app.menu.reveal() : app.menu.hide();
  });

  // Hide nav if clicked outside of a menu alternative
  $('.nav').click(function(e) {
    app.menu.hide();
  });
  // Make sure that links don't close the menu
  $('.nav a').click(function(e) {
    e.stopPropagation();
  });
}

app.menu.toggleStates = function() {
  $('body').toggleClass('no-scroll');
  $('.menu').toggleClass('menu-active');
  $('.js-nav').toggleClass('site-nav-active');
}

app.search.toggleStates = function () {
  $('body').toggleClass('no-scroll');
  $('.js-search-overlay').toggleClass('site-nav-active');
}

app.menu.reveal = function() {
  app.menu.visible = true;
  app.menu.toggleStates();

  anime({
    targets:'.menu-animated-background',
    scale: [0.2, 3],
    opacity: [0.2,1],
    easing: "easeInCubic",
    duration: 300,
    complete: function() {
      app.search.hideSearchIcon();
    }
  });

  var containerDelay = 200;
  anime({
    targets:'.js-nav',
    opacity: [0, 1],
    delay: containerDelay,
    easing: "easeInOutExpo",
    duration: 200
  });

  var menuItemDelay = 90;
  containerDelay += 75;
  $(".js-nav-header").css("opacity", "0");
  anime({
    targets: ".js-nav-header",
    opacity: [0,1],
    delay: containerDelay,
    easing: "easeInOutExpo",
    duration: 200
  });

  $(".js-nav-header-line").css("transform", "scale(0.2)");
  anime({
    targets:'.js-nav-header-line',
    scaleX: [0.28, 1],
    delay: containerDelay,
    easing: "easeInOutExpo",
    duration: 600
  });
  containerDelay += 350;

  $(".js-nav-animate").each(function(i) {
    $(this).css({
      "opacity": "0",
      "transform" : "scale(0.9)"
    });
  });

  anime({
    targets: '.js-nav-animate',
    translateY: ["-7px", 0],
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: function(el, i) {
      return containerDelay + menuItemDelay * (i+1)
    },
    duration: 1100,
    easing: "easeOutExpo",
    complete: function() {
      $(document).trigger("app:menuDidReveal");
    }
  });
}

app.search.reveal = function() {
  app.search.toggleStates();
  app.search.visible = true;

  anime({
    targets:'.site-search-animated-background',
    scale: [0.2, 3],
    opacity: [0.2,1],
    easing: "easeInCubic",
    duration: 300,
    complete: function() {
      app.menu.hideMenuIcon();
    }
  });

  // Hide search icon and show X
  var searchIconDuration = 400;
  var searchIconDelay = 200;
  // Hide Search icon
  anime({
    targets: '.site-search-icon',
    translateY: "-5px",
    rotate: 90,
    duration: searchIconDuration,
    scale: 0,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });
  // Show close icon
  anime({
    targets: '.site-search-close-icon',
    opacity: 1,
    scale: [0,1],
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  anime({
    targets: '.site-search-close-icon-line-1',
    rotateZ: [45, 225],
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  anime({
    targets: '.site-search-close-icon-line-2',
    rotateZ: [45, 135],
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  $(".js-search-input").css("opacity", 0);
  anime.timeline().add({
    targets:'.js-search-overlay',
    opacity: [0, 1],
    delay: 200,
    easing: "easeInOutExpo",
    duration: 200
  }).add({
    targets: '.js-search-input',
    opacity: [0,1],
    easing: "easeOutExpo",
    translateY: ["-20px", 0],
    duration: 700
  });
  // Focus on input field
  $(".js-search-input").focus();
}

app.search.moveSelectionDown = function() {
  // Find index of current focus
  var activeSelection = $(".site-search-results-item-active");
  var nextSelection = activeSelection.next();
  // Select next item (if any)
  if (nextSelection.length != 0) {
    activeSelection.removeClass("site-search-results-item-active");
    nextSelection.addClass("site-search-results-item-active");
  }
}

app.search.moveSelectionUp = function() {
  // Find index of current focus
  var activeSelection = $(".site-search-results-item-active");
  var prevSelection = activeSelection.prev();
  // Select next item (if any)
  if (prevSelection.length != 0) {
    activeSelection.removeClass("site-search-results-item-active");
    prevSelection.addClass("site-search-results-item-active");
  }
}

app.search.focusItem = function(item) {
  $(".site-search-results-item-active").removeClass("site-search-results-item-active");
  $(item).addClass("site-search-results-item-active");
}

app.search.goToSelectedItem = function() {
  var href = $(".site-search-results-item-active").attr("href");
  window.location.href = href;
}

app.search.hide = function() {
  app.search.toggleStates();
  app.search.visible = false;
  var searchIconDuration = 400;
  var searchIconDelay = 200;

  anime({
    targets: '.js-search-input',
    opacity: [1,0],
    easing: "easeOutExpo",
    duration: 500,
    translateY: ["0", "-20px"]
  });

  anime({
    targets: '.site-search-animated-background',
    scale: [4,0],
    easing: "easeInExpo",
    duration: 400,
    complete: function() {
      app.menu.showMenuIcon();
    }
  });

  anime({
    targets:'.js-search-overlay',
    opacity: [1, 0],
    delay: 200,
    easing: "easeInOutExpo",
    duration: 200
  });

  // Animate the cross
  anime({
    targets: '.site-search-close-icon',
    opacity: [1,0],
    scale: 0,
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  anime({
    targets: '.site-search-close-icon-line-1',
    rotateZ: [225, 45],
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  anime({
    targets: '.site-search-close-icon-line-2',
    rotateZ: [135, 45],
    duration: searchIconDuration,
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });

  anime({
    targets: '.site-search-icon',
    translateY: ["-5px", "0px"],
    rotate: [90,0],
    duration: searchIconDuration,
    opacity: [0,1],
    scale: [0,1],
    easing: 'easeOutExpo',
    delay: searchIconDelay
  });
}

app.menu.hide = function() {
  app.menu.visible = false;
  app.menu.toggleStates();
  $(document).trigger("app:menuWillHide");

  anime({
    targets: '.menu-animated-background',
    scale: [4,0],
    easing: "easeInExpo",
    duration: 400,
    complete: function() {
      app.search.showSearchIcon();
    }
  });

  anime({
    targets:'.js-nav',
    opacity: [1, 0],
    easing: "easeInOutExpo",
    duration: 200
  });

  anime({
    targets:'.js-nav-header-line',
    scale: [1, 0.5],
    easing: "easeInExpo",
    duration: 300
  });

  anime({
    targets: '.js-nav-animate',
    translateY: "10px",
    scale: [1, 0.9],
    opacity: [1, 0],
    easing: "easeInExpo",
    duration: 200
  });
}

// Typically called by views that want to display something in the same 
// position of the menu icon
app.menu.hideMenuIcon = function() {
  $(".menu").hide();
}

app.menu.showMenuIcon = function() {
  $(".menu").show();  
}

app.search.hideSearchIcon = function() {
  $(".js-search").hide()
    .css("opacity", 0);
}

app.search.showSearchIcon = function() {
  $(".js-search").show();
  anime({
    targets: ".js-search",
    opacity: [0,1],
    duration: 700,
    easing: "easeOutExpo"
  });
}

app.keys.handleESC = function() {
  $(document).trigger("pressed:ESC");
  if (app.menu.visible) {
    app.menu.hide();
    return;
  }
  if (app.search.visible) {
    app.search.hide();
    return;
  }
}

// Keyboard Key handling
app.keys.init = function() {
  app.keys.ESC = 27;
  app.keys.arrowUp = 38;
  app.keys.arrowDown = 40;
  app.keys.enter = 13;
}

app.keys.handleArrowUp = function(e) {
  if (app.search.visible) {
    e.preventDefault();
    app.search.moveSelectionUp();
  }
}

app.keys.handleArrowDown = function(e) {
  if (app.search.visible) {
    e.preventDefault();
    app.search.moveSelectionDown();
  }
}

app.keys.handleEnter = function(e) {
  if (app.search.visible) {
    e.preventDefault();
    app.search.goToSelectedItem();
  }
}

// Management of animations
app.animations.track = function(animeTimeline, el) {
  // Add object to list of tracked animations
  app.animations.tracked.push({
    timeline: animeTimeline, 
    element: el
  });
}

app.animations.onlyPlayVisible = function() {
  app.animations.tracked.forEach(function(animation) {
    app.animations.shouldPlay(animation) ? animation.timeline.play() : animation.timeline.pause();
  });
}

app.animations.shouldPlay = function(animation) {
  var winHeight = window.innerHeight;
  var bounds = animation.element.getBoundingClientRect();
  var offset = 5; // Greater offset -> animations will play less often

  // Check if bottom of animation is above view or if top of animation is below view
  if (bounds.bottom < 0+offset || bounds.top > winHeight-offset) return false;
  // Default to true
  return true;
}
