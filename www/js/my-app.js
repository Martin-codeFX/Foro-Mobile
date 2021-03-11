  
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
	  {
        path: '/index/',
        url: 'index.html',
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
	
//log in y registro
    $$("#btnIS").on('click', function() {
        console.log('click en btnIS');
		var email = $$("#userLog").val();
		var password = $$("#passLog").val();
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((user) => {
			mainView.router.navigate('/news/');
		})

		.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
		
		console.log(error);
		});

		
        /*if($$("#userLog").val() != "" && $$("#passLog").val() != ""){
			mainView.router.navigate('/news/');
        }else{
            app.dialog.alert("Completa todo los campos","Atención");
        }; */

		
    });
	$$("#btnReg").on('click', function() {
        console.log('click en btnIS');
		var email = $$("#userLog").val();
		var password = $$("#passLog").val();
		firebase.auth().createUserWithEmailAndPassword(email, password)

		.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password') {

		alert('Clave muy débil.');

		} else {
			alert(errorMessage);
			}
		console.log(error);
		});


		
    });

});	


$$(document).on('page:init', '.page[data-name="news"]', function (e) {
	
	console.log("entra al init de news"); 
	
	$$("#logOut").on('click', function() {
        console.log('click en logOut');
		firebase.auth().signOut().then(() => {
			console.log("llego a sing-out");
			mainView.router.navigate('/index/');	
				
			// Sign-out successful.
		}).catch((error) => {
		  // An error happened.
		});
		
    });

});	



