  
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
      {	path: '/topicview/:idTop/',	url: 'topicview.html', },
	  {	path: '/sectionview/:id/',	url: 'sectionview.html', },
	  {	path: '/topicform/',	url: 'topicform.html', },
	  {	path: '/news/', url: 'news.html', },
	  {	path: '/index/', url: 'index.html', }, 
	  
	  {	path: '/register/', url: 'register.html', },
    ]
    // ... other 
  });

var mainView = app.views.create('.view-main');

var userEmail = "";

var ruta = "";
var rutaTopic = "";
	


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
				firma: "",
				foto_url: "",
				rol: "user"};//TODO, implementar firma y url de foto (tal vez usar un boolean para preguntar si existe en vez de crearlo vacío?)
			
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
        console.log('fn listarTemasSelect');
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
		var horasPost = (''+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+'');
		var fechaPost = (''+now.getFullYear() + ":" + now.getMonth() + ":" + now.getDate()+'');
		
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
			fecha: fechaPost,
			hora: horasPost,
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

$$(document).on('page:init', '.page[data-name="sectionview"]', function (e, page) {
	console.log("entre a sectionview");
	console.log('Pag. Detalle con id: ' + page.route.params.id );
	ruta = page.route.params.id;
	listarTopics(ruta);	
	function tituloSecciones(){
		$$('#tituloRuta').html(ruta);//TODO, no hace falta hacer una función, pero a lo mejor se le puede agregar algo luego
	};
	tituloSecciones();
	
	function listarTopics(ruta) {
        console.log('listaTemasData');
		$$('#listaTopics').html('');
		var db = firebase.firestore();
		var perRef = db.collection("temas").where("id_seccion","==", ruta); 
		perRef.get().then(function(querySnapshot) { 
			querySnapshot.forEach(function(doc) { 
			console.log("data:" + doc.data().titulo_tema);
			$$('#listaTopics').append('<li><a href="/topicview/'+ doc.data().titulo_tema +'/' +'" id="'+doc.data().titulo_tema+'">'+ doc.data().titulo_tema +'</a></li>');
			
			
			});
			})
			.catch(function(error) { 
			console.log("Error: " , error);
			});

    };



});

$$(document).on('page:init', '.page[data-name="topicview"]', function (e, page) {
	console.log("entre a topicview");
	//console.log('Pag. Detalle con id: ' + page.route.params.id ); //TODO, no cumple ninguna funcion, creo
	console.log('Pag. Detalle con idTop: ' + page.route.params.idTop );
	
	rutaTopic = page.route.params.idTop;
	
	showTopic(rutaTopic);	
	showTopicComments(rutaTopic);
	
	$$('#btnNewComment').on('click', function() {
		console.log('click btn comentar');
		var topicText = $$('#newCommentText').html();
		var topicDate = Date.now()
		var now = new Date(Date.now());
		var horasPost = (''+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+'');
		var fechaPost = (''+now.getFullYear() + ":" + now.getMonth() + ":" + now.getDate()+'');
		
		console.log("veamos qué tenemos: ");
		console.log("id_tema: "+ rutaTopic);
		console.log("texto " + topicText);
		console.log("user mail: " + userEmail);
		console.log("topicDate : " + topicDate);
		console.log("now : " + now);
		var db = firebase.firestore();
		var data = {
			id_tema: rutaTopic,
			fecha: fechaPost,
			hora: horasPost,
			timestamp: topicDate,
			id_usuario: userEmail,
			texto: topicText,
			};
			
		db.collection("comentarios").add(data).then(function(docRef){
			console.log("OK! Con el ID: " + docRef.id);
		})
		.catch(function(error) { 
			console.log("Error: " + error);
		});
			
		
    });
	
	function showUserName(userId){
		console.log("el mail del usuario es "+ userId);
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userId);
		perRef.get().then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		
		$$('#topicUserName').html(doc.data().nombre);
		
		$$('#topicUserIcon').html(''+doc.data().rol);
		//TODO, esto se puede hacer una funcion y cambiar distintas cosas, como ponerle un link a los otros administradores, o ponerle un borde de un color X
		if(doc.data().rol == "Administrator"){
			$$('#topicOpAvatar').attr("src","https://png.pngtree.com/png-clipart/20190924/original/pngtree-businessman-user-avatar-free-vector-png-image_4827807.jpg");
		}
				
		});
		})
		
		
			.catch(function(error) { 
			console.log("Error: " , error);
			});

    };	


	function showTopicComments(rutaTopic) {
        
		console.log('rutaTopic' + rutaTopic);

		var db = firebase.firestore();
		var perRef = db.collection("comentarios").where("id_tema","==", rutaTopic).orderBy("timestamp");
		perRef.get().then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		console.log("comentarios:!!!! ");
		console.log("data:" + doc.data().timestamp);
		console.log("data:" + doc.data().fecha);
		console.log("data:" + doc.data().hora);
		console.log("data:" + doc.data().id_tema);
		console.log("data:" + doc.data().id_usuario);
		console.log("data:" + doc.data().texto);
		
		/*$$('#titleTopicView').html(doc.data().titulo_tema);
		$$('#viewTopicTimestamp').html(doc.data().timestamp);
		$$('#viewTopicFecha').html(doc.data().fecha);
		$$('#viewTopicIdSection').html(doc.data().id_seccion);
		$$('#viewTopicIdUsuario').html(doc.data().id_usuario);
		$$('#viewTopicTexto').html(doc.data().texto);
		showUserName(doc.data().id_usuario);
		$$('#topicFecha').html(''+doc.data().fecha);//TODO, se puede acomodar mejor con CSS
		$$('#topicHora').html(''+doc.data().hora);*/
		
		$$('#listAllComments').append('<div class="card demo-facebook-card"><div class="card-header"><div class="demo-facebook-avatar"><img src="https://cdn.framework7.io/placeholder/people-68x68-1.jpg" width="34" height="34" /></div>					<div class="demo-facebook-name">'+doc.data().id_usuario+'</div>					<div class="demo-facebook-name">topicUserIcon</div>					<div class="demo-facebook-date">'+doc.data().fecha+'</div>					<div class="demo-facebook-date">'+doc.data().hora+'</div>				</div>				<div class="card-content card-content-padding">					'+doc.data().texto+'				</div>				<!-- <div class="card-footer"><a href="#" class="link">Like</a><a href="#" class="link">Comment</a><a href="#"	class="link">Share</a></div> -->			</div>'); 
		
		});
		})
		
		
			.catch(function(error) { 
			console.log("Error: " , error);
			});

    };	
	
	function showTopic(rutaTopic) {
        
		console.log('rutaTopic' + rutaTopic);

		var db = firebase.firestore();
		var perRef = db.collection("temas").where("titulo_tema","==", rutaTopic);
		perRef.get().then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		/*console.log("data:" + doc.data().titulo_tema);
		console.log("data:" + doc.data().timestamp);
		console.log("data:" + doc.data().fecha);
		console.log("data:" + doc.data().id_seccion);
		console.log("data:" + doc.data().id_usuario);
		console.log("data:" + doc.data().texto);*/
		$$('#titleTopicView').html(doc.data().titulo_tema);
		$$('#viewTopicTimestamp').html(doc.data().timestamp);
		$$('#viewTopicFecha').html(doc.data().fecha);
		$$('#viewTopicIdSection').html(doc.data().id_seccion);
		$$('#viewTopicIdUsuario').html(doc.data().id_usuario);
		$$('#viewTopicTexto').html(doc.data().texto);
		showUserName(doc.data().id_usuario);
		$$('#topicFecha').html(''+doc.data().fecha);//TODO, se puede acomodar mejor con CSS
		$$('#topicHora').html(''+doc.data().hora);
		
		//$$('#temasLista').append('<li><a href="#" id="'+doc.data().nombre+'">'+ doc.data().nombre +'</a></li>'); //podria usar "this", tambien una funcion aca mismo, $(selector).append(content,function(index,html))
		});
		})
		
		
			.catch(function(error) { 
			console.log("Error: " , error);
			});

    };


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
	/*
	function leerTopic(){
		console.log("funcion leerTopic, parametro id del tema, metido a lo bruto en el html");
		console.log("cambiar valores en el html para OP");
		
	}*/
	/*TODO convinar esto con lo de las rutas
	function leerTopic() {
        console.log('click en leerTopic');
		//$$('#temasLista').html('');
		
		mainView.router.navigate('/topicview/');	
		var db = firebase.firestore();
		var perRef = db.collection("temas").where("titulo_tema","==", "Reglas");
		perRef.get().then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		/*console.log("data:" + doc.data().titulo_tema);
		console.log("data:" + doc.data().timestamp);
		console.log("data:" + doc.data().fecha);
		console.log("data:" + doc.data().id_seccion);
		console.log("data:" + doc.data().id_usuario);
		console.log("data:" + doc.data().texto);
		$$('#titleTopicView').html(doc.data().titulo_tema);
		$$('#viewTopicTimestamp').html(doc.data().timestamp);
		$$('#viewTopicFecha').html(doc.data().fecha);
		$$('#viewTopicIdSection').html(doc.data().id_seccion);
		$$('#viewTopicIdUsuario').html(doc.data().id_usuario);
		$$('#viewTopicTexto').html(doc.data().texto);
		
		//$$('#temasLista').append('<li><a href="#" id="'+doc.data().nombre+'">'+ doc.data().nombre +'</a></li>'); //podria usar "this", tambien una funcion aca mismo, $(selector).append(content,function(index,html))
		});
		})
		.catch(function(error) { 
		console.log("Error: " , error);
		});
		
    };
	*/
	
	function leerMensajes(){
		console.log("funcion leerMensajes");
		
	}
	function mostrarComentar(){
		console.log("funcion mostrarComentar");
	}



	$$("#viewTopic").on('click', function() {
        console.log('click en viewTopic');
		leerTopic();
		leerMensajes();
		mostrarComentar();
		
		
		
		//mainView.router.navigate('/msgform/');	
		
    });
	/*
	$$("#newMsg").on('click', function() {
        console.log('click en newMsg');
		mainView.router.navigate('/msgform/');	
		
    });
	*/

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
        console.log('listaTemasData');
		$$('#temasLista').html('');
		var db = firebase.firestore();
		var perRef = db.collection("secciones"); 
		perRef.get() 
		.then(function(querySnapshot) { 
		querySnapshot.forEach(function(doc) { 
		console.log("data:" + doc.data().nombre);
		//$$('#temasLista').append('<li><a href="#" id="'+doc.data().nombre+'">'+ doc.data().nombre +'</a></li>'); //podria usar "this", tambien una funcion aca mismo, $(selector).append(content,function(index,html))
		
		$$('#temasLista').append('<li><a href="/sectionview/'+doc.data().nombre +'/' + '" id="'+doc.data().nombre+'">'+ doc.data().nombre +'</a></li>'); 
		
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



