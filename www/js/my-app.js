
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Foro',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // default routes
    routes: [
      {	path: '/topicview/:idTop/:idKey/',	url: 'topicview.html', options: { transition: 'f7-dive',},  },
	  {	path: '/sectionview/:id/',	url: 'sectionview.html', options: { transition: 'f7-dive',},  },
	  {	path: '/topicform/',	url: 'topicform.html', options: { transition: 'f7-dive',},  },
	  {	path: '/topicformsectiondelete/',	url: 'topicformsectiondelete.html', options: { transition: 'f7-dive',},  },
	  {	path: '/news/', url: 'news.html', options: { transition: 'f7-dive',}, },
	  {	path: '/index/', url: 'index.html', options: { transition: 'f7-dive',}, },

	  {	path: '/register/', url: 'register.html', options: { transition: 'f7-dive',}, },
    ]
    // ... other
  });

var mainView = app.views.create('.view-main');

var userEmail = "";

var ruta = "";
var rutaTopic = "";

var nombreUser = "";
var idPost = "";
var idCurrentUser = "";
var idCurrentTopic ="";

/*********/
/***variables para mostrar comentarios******/
/*********/

var firmaUserComment = "";
var avatarUserComment = "";
var nameUserComment = "";
var userKeyIdComment = "";
var userRolComment = "";


var userCurrentAvatar = "";

function isAdmin(){
	$$('#btnHacerNoticia').removeClass("invis");
	$$('#btnHacerNoticia').addClass("visible");
	$$('#btnQuitarNoticia').removeClass("invis");
	$$('#btnQuitarNoticia').addClass("visible");
	$$('#deleteTemasDataConfirm').removeClass("invis");
	$$('#deleteTemasDataConfirm').addClass("visible");

}
function isOp(){
	$$('#deleteTemasDataConfirm').removeClass("invis");
	$$('#deleteTemasDataConfirm').addClass("visible");
}

	function deleteMsg(mgsId) {
        console.log('click en bajadata');

		var db = firebase.firestore();
		db.collection("comentarios").doc(mgsId).delete().then(function() {
			console.log("Documento borrado!");

			/*
			showTopic(rutaTopic);
			showNewCommentCurrentUser(userEmail);
			showTopicComments(rutaTopic); */
			mainView.router.navigate('/news/');
			})
		.catch(function(error) {

			console.error("Error: ", error);

		});

    };


$$(document).on('deviceready', function() {

    console.log("Device is ready!");


});


$$(document).on('page:init', function (e) {
	console.log("entra al init general");




});


$$(document).on('page:init', '.page[data-name="register"]', function (e) {
	console.log("entre a registro");
	$$("#btnBackReg").on('click', function() {
		console.log("click en btnBackReg");
		mainView.router.navigate('/index/');
	});
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
				avatar: "",
				rol: "Usuario"};//TODO, implementar firma y url de foto (tal vez usar un boolean para preguntar si existe en vez de crearlo vacío?)

		db.collection("usuarios").add(data).then(function(docRef) {
			console.log("OK! Con el ID: " + docRef.id);
			app.dialog.alert('Registro completado, ' + userName);
			mainView.router.navigate('/index/');

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


$$(document).on('page:init', '.page[data-name="topicformsectiondelete"]', function (e) {
	console.log("entre a delete tema");


	function deleteSectionSelectFn() {
        console.log('fn deleteSectionSelect');
		$$('#deleteSectionSelect').html('');
		var db = firebase.firestore();
		var perRef = db.collection("secciones");
		perRef.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
			console.log("data:" + doc.data().nombre);
			//$$('#deleteSectionSelect').append('<option value="'+doc.id+'">'+ doc.data().nombre +'</option>');
			$$('#deleteSectionSelect').append('<option value="'+doc.data().nombre+'">'+ doc.data().nombre +'</option>');

		});
		})
		.catch(function(error) {
		console.log("Error: " , error);
		});

    };

	deleteSectionSelectFn();

	$$('#btnSectionDelete').on('click', function(){
	var sectionToDelete =$$('#deleteSectionSelect').val();
	var nombreSection = $$('#deleteSectionSelect').html();


		console.log('trabajando en el nombre de la seccion con prompt');
		//buscar la id del tema,
		//sin boton, ponerlo en el topic, guardar el doc.id en una variable y usarlo ahi


		var db = firebase.firestore();
		db.collection("secciones").doc(sectionToDelete).delete().then(function() {
			console.log("Documento borrado!");
			app.dialog.alert('Listo, sección ' + nombreSection + ' borrada.');
			mainView.router.navigate('/news/');

		})
		.catch(function(error) {
			console.error("Error: ", error);
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
		var fecha_actual = new Date();
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
			timestamp: fecha_actual,
			id_usuario: userEmail,
			id_seccion: topicSelect,
			texto: topicText,
			noticia: false,
			};

		db.collection("temas").add(data).then(function(docRef){
			console.log("OK! Con el ID: " + docRef.id);
			mainView.router.navigate('/topicview/'+ topicTitle +'/'+docRef.id+'/' );
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
			$$('#listaTopics').append('<li><a href="/topicview/'+ doc.data().titulo_tema +'/'+doc.id+'/' +'" id="'+doc.data().titulo_tema+'">'+ doc.data().titulo_tema +'</a></li>');


			});
			})
			.catch(function(error) {
			console.log("Error: " , error);
			});

    };
//TODO hacer newtopic y newsection global, ya que los uso en varios lados
	function newTopic() {
        console.log('click en btnNewTopic');
		mainView.router.navigate('/topicform/');

    };

	function newSection() {
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
	};

    $$("#btnTopicMenu2").on("click",function(){
        console.log('click en botones ac2');
		if(userEmail=="admin@admin.com"){
			var btnTopicMenu = app.actions.create({
                buttons: [
                    {
                        text: 'Nuevo Tema',
                        onClick: function(){
                            console.log('selecciona Nuevo Tema');
							newTopic();
                        }
                    },

					{
                        text: 'Nueva Sección',
                        onClick: function(){
                            console.log('selecciona Nueva Sección');
							newSection();
                        }
                    },


                ],

            });

		}else{
			var btnTopicMenu = app.actions.create({
                buttons: [
                    {
                        text: 'Nuevo Tema',
                        onClick: function(){
                            console.log('selecciona Nuevo Tema');
							newTopic();
                        }
                    },
					{},
					{},
				],
			});
		}

        btnTopicMenu.open();
    });



});

$$(document).on('page:init', '.page[data-name="topicview"]', function (e, page) {
	console.log("entre a topicview");
	//console.log('Pag. Detalle con id: ' + page.route.params.id ); //TODO, no cumple ninguna funcion, creo
	console.log('Pag. Detalle con idTop: ' + page.route.params.idTop );
	console.log('Pag. Detalle con idKey: ' + page.route.params.idKey );

	rutaTopic = page.route.params.idTop;
	idCurrentTopic = page.route.params.idKey;
	$$('#menuForoUrl').on('click', function(){
		mainView.router.navigate('/news/');
	});

	showTopic(rutaTopic);
	showNewCommentCurrentUser(userEmail);
	showTopicComments(rutaTopic);


	function showTopic(rutaTopic){

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
			if(userEmail=="admin@admin.com"){
				isAdmin();
			}else if(userEmail == doc.data().id_usuario){
				isOp();
			}else {
				console.log("not Admin or OP");
			}
			//if(userEmail== "admin@admin.com"){
				//$$('#listadoBotonesNoticia').append('<li><a class="list-button" id="btnHacerNoticia">Hacer noticia</a></li> <li><a class="list-button" id="btnQuitarNoticia">Quitar noticia</a></li>');

			//}

			});
		})
		.catch(function(error) {
		console.log("Error: " , error);
		});
	};

	function showUserName(userId){
		console.log("el mail del usuario es "+ userId);
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userId);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		$$('#topicOpName').html(doc.data().nombre);
		$$('#topicOpFirma').html(doc.data().firma);

		$$('#topicOpIcon').html(''+doc.data().rol);
		$$('#topicOpAvatar').attr('src',doc.data().avatar);

		});
		})


		.catch(function(error) {
		console.log("Error: " , error);
		});

    };

	$$('#btnNewComment').on('click', function() {
		console.log('click btn comentar');
		var topicText = $$('#newCommentText').html();
		var topicDate = Date.now()
		var now = new Date(Date.now());
		var horasPost = (''+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()+'');
		var fechaPost = (''+now.getFullYear() + ":" + now.getMonth() + ":" + now.getDate()+'');
		var fecha_actual = new Date();

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
			timestamp: fecha_actual,
			id_usuario: userEmail,
			texto: topicText,
			};

		db.collection("comentarios").add(data).then(function(docRef){
			console.log("OK! Con el ID: " + docRef.id);
			//mainView.router.navigate('/topicview/'+ rutaTopic +'/'+idCurrentTopic+'/' );
			showTopic(rutaTopic);
			showNewCommentCurrentUser(userEmail);
			showTopicComments(rutaTopic);
			//showTopicComments(rutaTopic);
		})
		.catch(function(error) {
			console.log("Error: " + error);
		});
	});

	function showNewCommentCurrentUser(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		$$('#topicCurrentUserName').html(doc.data().nombre);
		//$$('#topicOpFirma').html(doc.data().firma);

		$$('#topicCurrentUserIcon').html(''+doc.data().rol);
		$$('#topicCurrentUserAvatar').attr('src',doc.data().avatar);

		});
		})


		.catch(function(error) {
		console.log("Error: " , error);
		});

    };


	$$('#deleteTemasDataConfirm').on('click', function () {

		app.dialog.confirm('¿Está seguro que desea borrar el tema ' + rutaTopic + '?', function () {

			console.log('trabajando en el nombre de la seccion con prompt');
			//buscar la id del tema,
			//sin boton, ponerlo en el topic, guardar el doc.id en una variable y usarlo ahi


			var db = firebase.firestore();
			db.collection("temas").doc(idCurrentTopic).delete().then(function() {
				console.log("Documento borrado!");
				app.dialog.alert('Listo, tema ' + rutaTopic + ' borrado.');
				mainView.router.navigate('/news/');

			})
			.catch(function(error) {
				console.error("Error: ", error);
			});
		});

	});


	$$('#btnHacerNoticia').on('click', function () {

		app.dialog.confirm('¿Está seguro que desea hacer noticia el tema ' + rutaTopic + '?', function () {

			console.log('trabajando en el nombre de la seccion con prompt');
			//buscar la id del tema,
			//sin boton, ponerlo en el topic, guardar el doc.id en una variable y usarlo ahi


			var db = firebase.firestore();
			db.collection("temas").doc(idCurrentTopic).update({ noticia: true }).then(function() {
				console.log("Documento borrado!");
				app.dialog.alert('Listo, tema ' + rutaTopic + ' es noticia.');
				mainView.router.navigate('/news/');

			})
			.catch(function(error) {
				console.error("Error: ", error);
			});
		});

	});
	$$('#btnQuitarNoticia').on('click', function () {

		app.dialog.confirm('¿Está seguro que desea quitar de noticias el tema ' + rutaTopic + '?', function () {

			console.log('trabajando en el nombre de la seccion con prompt');
			//buscar la id del tema,
			//sin boton, ponerlo en el topic, guardar el doc.id en una variable y usarlo ahi


			var db = firebase.firestore();
			db.collection("temas").doc(idCurrentTopic).update({ noticia: false }).then(function() {
				console.log("Documento borrado!");
				app.dialog.alert('Listo, tema ' + rutaTopic + ' ya no es noticia.');
				mainView.router.navigate('/news/');

			})
			.catch(function(error) {
				console.error("Error: ", error);
			});
		});

	});

	/*$$("#btnHacerNoticia").on('click', function() {
        console.log('click en btnHacerNoticia');
		console.log('rutaTopic' + rutaTopic);

		var db = firebase.firestore();
		var db.collection("temas").doc(idCurrentTopic).update({ noticia: true }).then(function() {
			console.log("actualizado ok");

		});


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };*/

	function showUserRol(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		return doc.data().rol;

		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };

		function showUserFirma(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		return doc.data().firma;

		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };

	function showUserAvatar(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		return doc.data().avatar;

		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };


	function showTopicComments(rutaTopic) {
        $$('#listAllComments').html("");
		console.log('rutaTopic' + rutaTopic);
		//loadUsersInfo();
		var db = firebase.firestore();
		var perRef = db.collection("comentarios").where("id_tema","==", rutaTopic).orderBy("timestamp");//TODO, ver de filtrar esto mejor, el timestamp está mal?
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
		console.log("entra en comentarios: ");
		console.log("data:" + doc.data().timestamp);
		console.log("data:" + doc.data().fecha);
		console.log("data:" + doc.data().hora);
		console.log("data:" + doc.data().id_tema);
		console.log("data:" + doc.data().id_usuario);
		console.log("data:" + doc.data().texto);

		var email = doc.data().id_usuario;
		//var userNombre = "#userNombre"+emailA;
		//var userFirma = "#userFirma"+emailA;
		//var userRol = "#userRol"+emailA;
		//var userAvatar = "#userAvatar"+emailA;
		var idUser = doc.data().id_usuario;
		var fecha = doc.data().fecha;
		var hora = doc.data().hora;
		var texto = doc.data().texto;
		var mensajeId= doc.id;

		var userAvatar = "";
		var userFirma = "";
		var userRol = "";
		var userNombre ="";

		var db2 = firebase.firestore();
		var perRef2 = db2.collection("usuarios").where("mail","==", email);
		perRef2.get().then(function(querySnapshot2) {
		querySnapshot2.forEach(function(doc2) {
			var userAvatar = doc2.data().avatar;
			var userFirma = doc2.data().firma;
			var userRol = doc2.data().rol;
			var userNombre = doc2.data().nombre;

			if(userEmail=="admin@admin.com"){
				$$('#listAllComments').append('<div class="card demo-facebook-card commentMoveUp"><div class="card-header"><div class="demo-facebook-avatar"><img id=""src="'+userAvatar+'" width="34" height="34" /></div>					<div class="demo-facebook-name" id=""></div>	'+userNombre+'<div class="demo-facebook-name" id=""></div>					<div class="demo-facebook-name" id="">'+userRol+'</div>					<div class="demo-facebook-date">'+fecha+'</div>					<div class="demo-facebook-date">'+hora+'</div>				</div>				<div class="card-content card-content-padding">					'+ texto +'				</div>				<div class="block"><div class="block-footer firma">'+userFirma+'</div> </div> </div>');
				$$('#listAllComments').append('<div class="block borrar">					<div class="row">						 <div class="col-25"></div> <div class="col-25"></div><button class="button col-15 btnBorrar" onclick="deleteMsg(\''+doc.id+'\')">Borrar</button></div> 				</div>');
			}else if(userEmail == doc.data().id_usuario){
				$$('#listAllComments').append('<div class="card demo-facebook-card commentMoveUp"><div class="card-header"><div class="demo-facebook-avatar"><img id=""src="'+userAvatar+'" width="34" height="34" /></div>					<div class="demo-facebook-name" id=""></div>	'+userNombre+'<div class="demo-facebook-name" id=""></div>					<div class="demo-facebook-name" id="">'+userRol+'</div>					<div class="demo-facebook-date">'+fecha+'</div>					<div class="demo-facebook-date">'+hora+'</div>				</div>				<div class="card-content card-content-padding">					'+ texto +'				</div>				<div class="block"><div class="block-footer firma">'+userFirma+'</div> </div> </div>');
				$$('#listAllComments').append('<div class="block borrar">					<div class="row">						 <div class="col-25"></div> <div class="col-25"></div><button class="button col-15 btnBorrar" onclick="deleteMsg(\''+doc.id+'\')">Borrar</button></div> 				</div>');
			}else {
				$$('#listAllComments').append('<div class="card demo-facebook-card commentMoveUp"><div class="card-header"><div class="demo-facebook-avatar"><img id=""src="'+userAvatar+'" width="34" height="34" /></div>					<div class="demo-facebook-name" id=""></div>	'+userNombre+'<div class="demo-facebook-name" id=""></div>					<div class="demo-facebook-name" id="">'+userRol+'</div>					<div class="demo-facebook-date">'+fecha+'</div>					<div class="demo-facebook-date">'+hora+'</div>				</div>				<div class="card-content card-content-padding">					'+ texto +'				</div>				<div class="block"><div class="block-footer">'+userFirma+'</div> </div> </div>');
			};


		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});


		//$$('#listAllComments').append('<div class="card demo-facebook-card"><div class="card-header"><div class="demo-facebook-avatar"><img src="'+userAvatar+'" width="34" height="34" /></div>					<div class="demo-facebook-name">'+doc.data().id_usuario+'</div>					<div class="demo-facebook-name">'+userRol+'</div>					<div class="demo-facebook-date">'+doc.data().fecha+'</div>					<div class="demo-facebook-date">'+doc.data().hora+'</div>				</div>				<div class="card-content card-content-padding">					'+doc.data().texto+'				</div>				<div>'+userFirma+'</div> </div>');

		//este sirve, acomodar
		//$$('#listAllComments').append('<div class="card demo-facebook-card"><div class="card-header"><div class="demo-facebook-avatar"><img id=""src="'+userAvatar+'" width="34" height="34" /></div>					<div class="demo-facebook-name" id=""></div>	'+userNombre+'<div class="demo-facebook-name" id="">'+email+'</div>					<div class="demo-facebook-name" id="">'+userRol+'</div>					<div class="demo-facebook-date">'+fecha+'</div>					<div class="demo-facebook-date">'+hora+'</div>				</div>				<div class="card-content card-content-padding">					'+ texto +'				</div>				<div id="">'+userFirma+'</div> </div>');
		//$$('#listAllComments').append('<div class="card demo-facebook-card"><div class="card-header"><div class="demo-facebook-avatar"><img id=""src="'+avatarUserComment+'" width="34" height="34" /></div>					<div class="demo-facebook-name" id="">'+nameUserComment+'</div>	<div class="demo-facebook-name" id=""></div>		'+doc.data().id_usuario+'			<div class="demo-facebook-name" id="">'+userRolComment+'</div>					<div class="demo-facebook-date">'+fecha+'</div>					<div class="demo-facebook-date">'+hora+'</div>				</div>				<div class="card-content card-content-padding">					'+ texto +'				</div>				<div id="">'+firmaUserComment+'</div> </div>');
		});
		})


		.catch(function(error) {
		console.log("Error: " , error);
		});

    };


	 function showUserNombre(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		return doc.data().nombre;

		});
		})
		.catch(function(error) {
				console.log("Error: " , error);

		});
	};




});

//no esta bien cerrado algo arriba --^
//y rompe cosas abajo



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

	showUserAvatar(userEmail);

    $$("#btnTopicMenu").on("click",function(){
        console.log('click en botones ac2');
		if(userEmail=="admin@admin.com"){
			var btnTopicMenu = app.actions.create({
                buttons: [
                    {
                        text: 'Nuevo Tema',
                        onClick: function(){
                            console.log('selecciona Nuevo Tema');
							newTopic();
                        }
                    },

					{
                        text: 'Nueva Sección',
                        onClick: function(){
                            console.log('selecciona Nueva Sección');
							newSection();
                        }
                    },


                ],

            });

		}else{
			var btnTopicMenu = app.actions.create({
                buttons: [
                    {
                        text: 'Nuevo Tema',
                        onClick: function(){
                            console.log('selecciona Nuevo Tema');
							newTopic();
                        }
                    },
					{},
					{},
				],
			});
		}

        btnTopicMenu.open();
    });



	function getUserRandomId(){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				console.log("data:" + doc.data().nombre );
				console.log("id usuario:" + doc.id );
				idCurrentUser = doc.id;
		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };

	getUserRandomId();



	function isNews(){
	console.log("maybe is news?");
	var db = firebase.firestore();
	var perRef = db.collection("temas").where("noticia","==", true);
	perRef.get().then(function(querySnapshot) {
	querySnapshot.forEach(function(doc) {

	var titulo = doc.data().titulo_tema;
	var id_usuario = doc.data().id_usuario;
	var id_seccion = doc.data().id_seccion;
	var val_hora = doc.data().hora;
	var texto = doc.data().texto;
	console.log("hay una noticia: " + titulo);
	console.log("con id: " + doc.id);

	$$('#noticiasLista').append('				  <li>					<a href="/topicview/'+titulo +'/' +doc.id+'/' + '" class="item-link item-content">					  <div class="item-inner">						<div class="item-title-row">						  <div class="item-title">'+titulo+'</div>						  <div class="item-after">'+val_hora+'</div>						</div>						<div class="item-subtitle">Escrito por '+id_usuario+' en '+id_seccion+'</div>						<div class="item-text">'+texto+'</div>					  </div>					</a>					</li> ');

	});
	})


		.catch(function(error) {
		console.log("Error: " , error);
		});

    };
	if(userEmail != ""){
		isNews();
	}



	$$("#esNoticia").on('click', function() {
		console.log('click en esNoticia');
		isNews();

	});

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
	//esto no hace nada, eliminar
	function leerMensajes(){
		console.log("funcion leerMensajes");

	}//esto tambien
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

	$$("#btnNewTopic").on('click', function() {
        console.log('click en btnNewTopic');
		mainView.router.navigate('/topicform/');

    });

	function newTopic() {
        console.log('click en btnNewTopic');
		mainView.router.navigate('/topicform/');

    };
	//lo puse con una funcion en el action sheet, no se usa
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

	function newSection() {
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
	};







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
			ruta = "";
			rutaTopic = "";
			mainView.router.navigate('/index/') /*
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
	//TODO agregarle un prompt/hecho, está listo para acomodar con css
	$$("#cambiarFirma").on('click', function() {
        console.log('click en cambiarFirma');
		app.dialog.prompt('Tu nueva firma es: ', function (firmaT) {
			app.dialog.confirm('¿Está seguro que tu nueva firma es ' + firmaT + '?', function () {
				console.log('trabajando en la firma');
				var db = firebase.firestore();
				db.collection("usuarios").doc(idCurrentUser).update({ firma: firmaT }).then(function() {
					console.log("firma cambiada");
					app.dialog.alert('Listo, firma es ' + firmaT);
				})
				.catch(function(error) {
					console.error("Error: ", error);
				});
			});
		});
	});

	function showUserAvatar(userEmail){
		var db = firebase.firestore();
		var perRef = db.collection("usuarios").where("mail","==", userEmail);
		perRef.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {

		userCurrentAvatar = doc.data().avatar;

		});
		})


			.catch(function(error) {
			console.log("Error: " , error);
			});

    };

	$$(cambiarAvatar).on('click', function() {
        console.log('click en cambiarAvatar');

		app.dialog.prompt('Ingrese la URL de su nuevo avatar: ', function (avatarN) {
			app.dialog.confirm('¿Está seguro que tu nuevo avatar es '+ avatarN+ ' ?', function () {
				console.log('trabajando en la firma');
				var db = firebase.firestore();
				db.collection("usuarios").doc(idCurrentUser).update({ avatar: avatarN }).then(function() {
					console.log("avatar cambiado");
					app.dialog.alert('Su avatar se cambió con éxito.');
				})
				.catch(function(error) {
					console.error("Error: ", error);
				});
			});
		});
	});


	//TODO agregarle un prompt
	/*$$("#cambiarAvatar").on('click', function() {
        console.log('click en bajadata');

		var db = firebase.firestore();
		db.collection("usuarios").doc(idCurrentUser).update({ avatar: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png" }).then(function() {
			console.log("avatar cambiado");
			})
		.catch(function(error) {

			console.error("Error: ", error);

		});

    });*/

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
