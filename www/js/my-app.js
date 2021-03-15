  
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
      {	path: '/msgform/',	url: 'msgform.html', },
	  {	path: '/topicform/',	url: 'topicform.html', },
	  {	path: '/news/', url: 'news.html', },
	  {	path: '/index/', url: 'index.html', }, 
	  {	path: '/register/', url: 'register.html', },
    ]
    // ... other 
  });

var mainView = app.views.create('.view-main');

var userEmail = "";


	


$$(document).on('deviceready', function() {
	
    console.log("Device is ready!");
	
	
});


$$(document).on('page:init', function (e) {
	console.log("entra al init general"); 
	

	
});


$$(document).on('page:init', '.page[data-name="register"]', function (e) {
	console.log("entre a registro");
	$$("#btnReg").on('click', function() {
		console.log('click en btnReg');
		var userName = $$("#regUser").val();//TODO: guardar nombre de usuario//hecho :D
		var email = $$("#regEmail").val();
		var password = $$("#regPass").val();
		firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
			console.log("registro OK, username "+ userName + "  email: " + email );
			var db = firebase.firestore();
			var data = {
				nombre: userName,
				mail: email,
				rol: "user"};
			
		db.collection("usuarios").add(data).then(function(docRef) {
			console.log("OK! Con el ID: " + docRef.id);
		})
		.catch(function(error) {
			console.log("Error: " + error);
			});
		})

		.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password') {
			alert('Clave muy débil.');
		}else{
			alert(errorMessage);
			}
		console.log(error);
		});
	});

});


$$(document).on('page:init', '.page[data-name="topicform"]', function (e) {
	console.log("entre a topicform");
	
	function listarTemasSelect() {
        console.log('click en listarTemasSelect');
		$$('#newTopicSelect').html('');
		var db = firebase.firestore();
		var perRef = db.collection("secciones"); 
		perRef.get() 
		.then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		console.log("data:" + doc.data().nombre);
		$$('#newTopicSelect').append('<option value="'+doc.data().nombre+'">'+ doc.data().nombre +'</option>'); 
		});
		})
		.catch(function(error) { 
		console.log("Error: " , error);
		});
		
    };
	listarTemasSelect();	


	$$('#btnTopicPost').on('click', function(){
		var topicTitle = $$('#newTopicTitle').val();
		var topicSelect = $$('#newTopicSelect').val();
		var topicText = $$('#newTopicText').html();
		var topicDate = Date.now()
		var now = new Date(Date.now());
		
		//var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

		
		
		console.log("click en btnTopicPost, veamos qué tenemos: ");
		console.log("titulo: "+ topicTitle);
		console.log("sub foro "+ topicSelect);
		console.log("texto " + topicText);
		console.log("user mail: " + userEmail);
		console.log("topicDate : " + topicDate);
		console.log("now : " + now);
		
		//console.log("formatted: " + formatted);
		
		
		
		var db = firebase.firestore();
		var data = {
			titulo_tema: topicTitle,
			fecha: now,
			timestamp: topicDate,
			id_usuario: userEmail,
			id_seccion: topicSelect,
			texto: topicText,
			};
			
		db.collection("temas").add(data).then(function(docRef){
			console.log("OK! Con el ID: " + docRef.id);
		})
		.catch(function(error) { 
			console.log("Error: " + error);
		});
		

		
		
		
		
		
		
		
	});



});

$$(document).on('page:init', '.page[data-name="msgform"]', function (e) {
	console.log("entre a msgform");
	
	




});






$$(document).on('page:init', '.page[data-name="index"]', function (e) {
	
	console.log(userEmail + " entra al init del index"); 
	
//log in y registro
    $$("#btnIS").on('click', function() {
        console.log('click en btnIS');
		var email = $$("#userLog").val();
		var password = $$("#passLog").val();
		
		
		firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
			mainView.router.navigate('/news/');
			console.log("nombre de usuario es (por ahora mail): " + email);
			userEmail = email;
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
	
	
	
	$$("#btnRegForm").on('click', function() {
        console.log('click en btnReg');
		mainView.router.navigate('/register/');	
		
    });



});	


$$(document).on('page:init', '.page[data-name="news"]', function (e) {
	
	console.log(userEmail + " entra al init de news"); 

	$$("#newMsg").on('click', function() {
        console.log('click en newMsg');
		mainView.router.navigate('/msgform/');	
		
    });

	$$("#newTopic").on('click', function() {
        console.log('click en newTopic');
		mainView.router.navigate('/topicform/');	
		
    });

	$$('#buildTemasDataPrompt').on('click', function () {
		app.dialog.prompt('Nombre de la sección nueva: ', function (name) {
			app.dialog.confirm('¿Está seguro que la nueva sección es ' + name + '?', function () {
				sectionName = name;
				console.log('trabajando en el nombre de la seccion con prompt');
				var db = firebase.firestore();
				var data = {
					nombre: sectionName,
					numero: 03, //TODO: revisar si hay otra forma de sort que no sea con numero, tal vez use el nombre del tema. sino poner otro prompt
					};
				db.collection("secciones").add(data).then(function(docRef){
				console.log("OK! Con el ID: " + docRef.id);
				app.dialog.alert('Listo, sección ' + name + ' creada.');
				listarTemas();
			})
			.catch(function(error) { 
				console.log("Error: " + error);
				});
			});
		});
	});
	
	$$('#deleteTemasDataPrompt').on('click', function () {
		app.dialog.prompt('Nombre de la sección que desea borrar: ', function (name) {
			app.dialog.confirm('¿Está seguro que desea borrar la  sección ' + name + '?', function () {
				sectionName = name;
				console.log('trabajando en el nombre de la seccion con prompt');
				
				var db = firebase.firestore();
				db.collection("secciones").doc(MiID).delete().then(function() {
					console.log("Documento borrado!");
					app.dialog.alert('Listo, sección ' + name + ' borrada.');
					listarTemas();
				})
				.catch(function(error) {
					console.error("Error: ", error);
				});
			});
		});
	});




	
	function listarTemas() {
        console.log('click en listTemasData');
		$$('#temasLista').html('');
		var db = firebase.firestore();
		var perRef = db.collection("secciones"); 
		perRef.get() 
		.then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		console.log("data:" + doc.data().nombre);
		$$('#temasLista').append('<li><a href="#" id="'+doc.data().nombre+'">'+ doc.data().nombre +'</a></li>'); //podria usar "this", tambien una funcion aca mismo, $(selector).append(content,function(index,html))
		});
		})
		.catch(function(error) { 
		console.log("Error: " , error);
		});
		
    };
	listarTemas();
	
	
	$$("#logOut").on('click', function() {
        console.log('click en logOut');
		firebase.auth().signOut().then(() => {
			console.log("llego a sing-out");
			userEmail = "";
			app.views.main.router.navigate('/index/', {reloadAll: true}) /*
			reload agresivo porque f7 se hace el loco y no me muestra el form de registro después de iniciar sesión.*/
			// Sign-out successful.
		}).catch((error) => {
		  // An error happened.
		});
		
    });
	
	//TODO: ya lo hice con un prompt, se puede sacar
	$$("#buildSection").on('click', function() {
		sectionName = "Off-topic";
		console.log('click en buildSection');
		var db = firebase.firestore();
		var data = {
			nombre: sectionName,
			numero: 02,
			
			};
		db.collection("secciones").add(data).then(function(docRef){
			console.log("OK! Con el ID: " + docRef.id);
		})
		.catch(function(error) { 
			console.log("Error: " + error);
		});
		
		
    });
	
	$$("#bajaData").on('click', function() {
        console.log('click en bajadata');
		
		var db = firebase.firestore();
		db.collection("usuarios").doc("wFf2rSODTcASUia73HFY").delete().then(function() {
			console.log("Documento borrado!");
			})
		.catch(function(error) {

			console.error("Error: ", error);

		});
		
    });

	$$("#listData").on('click', function() {
        console.log('click en listdata');
		
		var db = firebase.firestore();
		var perRef = db.collection("usuarios");
		perRef.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				console.log("data:" + doc.data().nombre);
				});
			})
		.catch(function(error) {
			console.log("Error: " , error);
		});

		
    });
	
	$$("#listWhereData").on('click', function() {
        console.log('click en listWhereData');
		

		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==","eduardo@hotmail.com");
		perRef.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				console.log("data: el nombre es: " + doc.data().nombre );
				console.log("data: el mail es: " + doc.data().mail );
			});
		})
		.catch(function(error) {
			console.log("Error: " , error);
		});

		
    });



	$$("#modData").on('click', function() {
        console.log('click en moddata');
		
		var db = firebase.firestore();
		db.collection("personas").doc("wFf2rSODTcASUia73HFY").delete().then(function() {
			console.log("Documento borrado!");
			})
		.catch(function(error) {

			console.error("Error: ", error);

		});
		
    });

});	



