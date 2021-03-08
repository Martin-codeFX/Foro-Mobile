  
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
      swipe: 'left',
    },
    // default routes
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
    // ... other 
  });

var mainView = app.views.create('.view-main');


$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

/*$$(document).on('page:init', '.page[data-name="about"]', function(){
	etiqueta data-name
	
	
}*/



$$(document).on('page:init', function (e) {
	console.log("entra al init general"); 
})


// Option 2. Using live 'page:init' event handlers for each page

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
	
	console.log("entra al init de index"); 

    $$("#btnIS").on('click', function() {
        console.log('click en btnIS');
        if($$("#userLog").val() != "" && $$("#passLog").val() != ""){
			mainView.router.navigate('/news/');
        }else{
            app.dialog.alert("Completa todo los campos","Atención");
        };        
    });
});	



