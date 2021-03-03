  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Mi applicacion',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'right',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
	  {
        path: '/news/',
        url: 'news.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

/*$$(document).on('page:init', '.page[data-name="about"]', function(){
	etiqueta data-name
	
	
}*/


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    //console.log(e);
	console.log("entra al init general"); //lo escribi yo
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    //console.log(e);
	console.log("entra al init de about"); //lo escribi yo
})