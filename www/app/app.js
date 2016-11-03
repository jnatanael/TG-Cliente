/* global firebase */

// create the module and name it terrasApp
// also include ngRoute for all our routing needs
var terrasApp = angular.module('terrasApp', ['ngRoute', 'firebase']);

// configure our routes
terrasApp.config(function ($routeProvider) {
    $routeProvider

// route for the perfil page
            .when('/perfil', {
                templateUrl: 'app/views/perfil.html',
                controller: 'perfilController'
            })

            // route for the dashboard page
            .when('/', {
                templateUrl: 'app/views/dashboard.html',
                controller: 'mainController'
            })

            // route for the agenda page
            .when('/agenda', {
                templateUrl: 'app/views/agenda.html',
                controller: 'agendaController'
            })

            // route for the consultoria page
            .when('/consultoria/:idConsultoria', {
                templateUrl: 'app/views/consultoria.html',
                controller: 'consultoriaController'
            })

            // route for the info-cliente page
            .when('/info-consultoria-talhao/:idConsult/:idPlanej/:idPlanejTalhao', {
                templateUrl: 'app/views/info-consultoria-talhao.html',
                controller: 'infoConsultoriaTalhaoController'
            })

            // route for the propriedades page
            .when('/propriedades', {
                templateUrl: 'app/views/propriedades.html',
                controller: 'propriedadesController'
            })

            // route for the planejamentos page
            .when('/planejamentos', {
                templateUrl: 'app/views/planejamentos.html',
                controller: 'planejamentosController'
            })

// route for the info-propriedade page
            .when('/info-propriedade/:idPropriedade', {
                templateUrl: 'app/views/info-propriedade.html',
                controller: 'infoPropriedadeController'
            })

// route for the info-propriedade page
            .when('/info-talhao/:idP/:idTalhao', {
                templateUrl: 'app/views/info-talhao.html',
                controller: 'infoTalhaoController'
            })

            // route for the info-cliente page
            .when('/info-planejamento/:idPlanej', {
                templateUrl: 'app/views/info-planejamento.html',
                controller: 'infoPlanejamentoController'
            })

            // route for the info-cliente page
            .when('/info-planejamento-talhao/:idPlanej/:idPlanejTalhao', {
                templateUrl: 'app/views/info-planejamento-talhao.html',
                controller: 'infoPlanejamentoTalhaoController'
            })

            // route for the list-propriedades page
            .when('/msg/:idUs/:idMsg', {
                templateUrl: 'app/views/msg.html',
                controller: 'msgAllController'
            })

            // route for the list-propriedades page
            .when('/mensagens/:idUser', {
                templateUrl: 'app/views/mensagens.html',
                controller: 'mensagensController'
            });
});


function dataAtual() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}
;
// create the controller and inject Angular's $scope
terrasApp.controller('mainController', function ($scope, $firebaseArray) {
    // create a class active for menu
    $scope.message = 'Dashboard';
    $scope.today = dataAtual();

    var arrayMes = new Array();
    arrayMes[0] = "Janeiro";
    arrayMes[1] = "Fevereiro";
    arrayMes[2] = "Março";
    arrayMes[3] = "Abril";
    arrayMes[4] = "Maio";
    arrayMes[5] = "Junho";
    arrayMes[6] = "Julho";
    arrayMes[7] = "Agosto";
    arrayMes[8] = "Setembro";
    arrayMes[9] = "Outubro";
    arrayMes[10] = "Novembro";
    arrayMes[11] = "Dezembro";

    var today = new Date();
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    $scope.mes = arrayMes[mm] + '/' + yyyy;
    var ref = firebase.database().ref('/consultorias/').orderByChild("visitaCount").equalTo(0);
    var ref1 = firebase.database().ref('/consultorias/').orderByChild("visitaCount").equalTo(1);
    var ref2 = firebase.database().ref('/consultorias/').orderByChild("status").equalTo("aguardando");
    $scope.agendado = $firebaseArray(ref);
    $scope.visitado = $firebaseArray(ref1);
    $scope.consultoriasAguardando = $firebaseArray(ref2);
    $scope.etapaArray = arrayEtapa;
    $scope.salvar = function (id) {
        swal({title: "Aprovar?",
            text: "Você deseja realmente aprovar esta prescrição?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sim!",
            cancelButtonText: "Não!",
            closeOnConfirm: false,
            closeOnCancel: false},
                function (isConfirm) {
                    if (isConfirm) {
                        firebase.database().ref('/consultorias/' + id).update({
                            status: "aprovado"
                        });
                        swal("Aprovado!", "Consultoria aprovada com sucesso!", "success");
                    } else {
                        swal("Cancelado", "Consultoria não Aprovada :)", "error");
                    }
                });
    };
    var ref1F = firebase.database().ref('/consultorias/').orderByChild("etapa").equalTo("primeiro_fungicida");
    var ref2F = firebase.database().ref('/consultorias/').orderByChild("etapa").equalTo("segundo_fungicida");
    var ref3F = firebase.database().ref('/consultorias/').orderByChild("etapa").equalTo("terceiro_fungicida");
    $scope.primeiro_fungicida = $firebaseArray(ref1F);
    $scope.segundo_fungicida = $firebaseArray(ref2F);
    $scope.terceiro_fungicida = $firebaseArray(ref3F);
    var refP = firebase.database().ref('/planejamentos/');
    $scope.planejamentosDados = $firebaseArray(refP); // data is loaded here

    $scope.dataDif = function (data1) {

        var date2 = new String(data1);
        var date1 = new String(dataAtual());
        date1 = date1.split("/");
        date2 = date2.split("/");
        var sDate = new Date(date1[1] + "/" + date1[0] + "/" + date1[2]);
        var eDate = new Date(date2[1] + "/" + date2[0] + "/" + date2[2]);
        var diferencaData = Math.round((eDate - sDate) / 86400000);

        $scope.cor = "";


        if (diferencaData > 0) {
            switch (diferencaData) {
                case 0:
                    $scope.diferenca = "Último dia para Aplicação!";
                    $scope.cor = "red white-text";
                    break;
                case 3:
                    $scope.diferenca = "Prazo para Aplicação terminando!";
                    $scope.cor = "yellow white-text";
                    break;
                case (diferencaData < 0):
                    $scope.diferenca = "Data Limite para aplicação ultrapassada!";
                    $scope.cor = "red white-text";
                    break;
                default:
                    $scope.diferenca = diferencaData;
                    break;
            }
        } else {
            $scope.diferenca = "Data Limite para aplicação ultrapassada!";
            $scope.cor = "red white-text";
        }

    };
});

terrasApp.controller('perfilController', function ($scope, $firebaseObject) {
// create a class active for menu
    $scope.message = 'Perfil';

    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/clientes/' + uid);
        // download the data into a local object
        $scope.data = $firebaseObject(ref);
    });

});

terrasApp.controller('nomeController', function ($scope, $firebaseObject) {
// create a class active for menu

    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/clientes/' + uid);
        // download the data into a local object
        $scope.data = $firebaseObject(ref);
    });

});

terrasApp.controller('msgController', function ($scope, $firebaseArray) {
// create a class active for menu

    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/notificacoes/' + uid).orderByChild("status").equalTo(0);
        var ref2 = firebase.database().ref('/notificacoes/' + uid).orderByChild("status").equalTo(1);

        // download the data into a local object
        var notficacoes = $firebaseArray(ref);
        var notficacoes2 = $firebaseArray(ref2);

        $scope.data = notficacoes;
        $scope.data2 = notficacoes2;
        $scope.id = uid;

        notficacoes.$loaded().then(function (notes) {
            $scope.n = notes.length; // data is loaded here
        });

    });

});

terrasApp.controller('msgAllController', function ($scope, $routeParams, $firebaseObject) {

    var id = $routeParams.idMsg;
    var idU = $routeParams.idUs;
    var ref = firebase.database().ref('/notificacoes/' + idU + '/' + id);

    $scope.id = idU;

//atualizando

    ref.update({status: 1});

    // download the data into a local object
    $scope.dataMsg = $firebaseObject(ref);
    // create a class active for menu
    $scope.message = 'Notificação';

});

terrasApp.controller('mensagensController', function ($scope, $routeParams, $firebaseArray) {

    var idU = $routeParams.idUser;
    var ref = firebase.database().ref('/notificacoes/' + idU);
    $scope.id = idU;
    // download the data into a local object
    $scope.dataMsg = $firebaseArray(ref);
    // create a class active for menu
    $scope.message = 'Mensagens';

});

var arrayEtapa = {
    dessecacao: "Dessecação",
    plantio: "Plantio",
    um_de_ultra: "1 de Ultra",
    dois_de_ultra: "2 de Ultra",
    primeiro_fungicida: "1º Fungicida",
    segundo_fungicida: "2º Fungicida",
    terceiro_fungicida: "3º Fungicida",
    entre_etapas: "Entre Etapas"
};

terrasApp.controller('agendaController', function ($scope, $firebaseArray, $firebaseObject) {
    // create a class active for menu
    $scope.message = 'Agenda';
    var ref = firebase.database().ref('/consultorias/');
    var dataConsultoria = $firebaseArray(ref);
    $scope.data = dataConsultoria;
    $scope.today = dataAtual();
    $scope.etapaV = arrayEtapa;

    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/clientes/' + uid);
        // download the data into a local object
        $scope.dataCliente = $firebaseObject(ref);
    });
});

terrasApp.controller('consultoriaController', function ($scope, $firebaseObject, $routeParams) {
     // create a class active for menu
    $scope.message = 'Consultoria';
    var id = $routeParams.idConsultoria;
    var ref = firebase.database().ref('/consultorias/' + id);

    var dataConsultoria = $firebaseObject(ref);
    $scope.data = dataConsultoria;

    dataConsultoria.$loaded().then(function () {
        var etapa = dataConsultoria.etapa;
        var idPlanejamento = dataConsultoria.idPlanejamento;
        $scope.etapaV = arrayEtapa[etapa];
        $scope.dataAgenda = dataConsultoria.data;
        $scope.dataVisita = dataConsultoria.status;

        var refP = firebase.database().ref('/planejamentos/' + idPlanejamento);
        $scope.planejamento = $firebaseObject(refP);
        $scope.id = idPlanejamento;
    });
});
terrasApp.controller('infoConsultoriaTalhaoController', function ($scope, $routeParams, $firebaseObject) {
    // download the data into a local object
    $scope.message = 'Informações do Planejamento para Consultoria';

    var idConsult = $routeParams.idConsult;
    $scope.idConsult = idConsult;

    var ref = firebase.database().ref('/consultorias/' + idConsult).orderByChild("status").equalTo("aprovado");
    $scope.dataidConsult = $firebaseObject(ref);

    var id = $routeParams.idPlanej;
    var id2 = $routeParams.idPlanejTalhao;
    
    var refT = firebase.database().ref('/planejamentos/' + id + '/planejamentoTalhoes/' + id2 + '/visitas/' + idConsult);
    $scope.dataVisita = $firebaseObject(refT);

});

terrasApp.controller('propriedadesController', function ($scope, $firebaseArray, $firebaseObject) {
    // create a class active for menu
    $scope.message = 'Propriedades';
    var refPropriedades = firebase.database().ref('/propriedades/');
    var dataREF = $firebaseArray(refPropriedades);
    $scope.data = dataREF;
    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/clientes/' + uid);
        // download the data into a local object
        $scope.dataCliente = $firebaseObject(ref);
    });
});

terrasApp.controller('planejamentosController', function ($scope, $firebaseArray, $firebaseObject) {
    // create a class active for menu
    $scope.message = 'Planejamento';
    var ref = firebase.database().ref('/planejamentos/');
    var dataAll = $firebaseArray(ref);
    $scope.data = dataAll;
    firebase.auth().onAuthStateChanged(function (user) {
        var uid = user.uid;
        var ref = firebase.database().ref('/clientes/' + uid);
        // download the data into a local object
        $scope.dataCliente = $firebaseObject(ref);
    });
});

terrasApp.controller('talhaoController', function ($scope, $firebaseArray) {
    var refTalhoes = firebase.database().ref('/talhoes/');
    // download the data into a local object
    var dataTalhaoRef = $firebaseArray(refTalhoes);
    $scope.data = dataTalhaoRef;
});

terrasApp.controller('infoPropriedadeController', function ($scope, $window, $routeParams, $firebaseObject, $firebaseArray) {
    var id = $routeParams.idPropriedade;
    $scope.id = id;
    var ref = firebase.database().ref('/propriedades/' + id);
    // download the data into a local object
    var dataProriedade = $firebaseObject(ref);
    $scope.data = dataProriedade;

    // create a class active for menu
    $scope.message = 'Informações da Propriedade';

    var refTalhoes = firebase.database().ref('/talhoes/'+id);
    // download the data into a local object
    var dataTalhaoRef = $firebaseArray(refTalhoes);

    $scope.dataTalhao = dataTalhaoRef;


    dataProriedade.$loaded().then(function () {
        var latitude = parseFloat(dataProriedade.latitude);
        var longitude = parseFloat(dataProriedade.longitude);

        var myLatLng = {lat: latitude, lng: longitude};

        var map = new google.maps.Map(document.getElementById('mapPropriedade'), {
            center: myLatLng,
            zoom: 0
        });

        $window.map = map;

        var companyImage = 'images/map-marker.png';
        // Create a marker and set its position.
        dataTalhaoRef.$loaded().then(function () {
            var latitude = parseFloat(dataTalhaoRef[0].latitude);
            var longitude = parseFloat(dataTalhaoRef[0].longitude);

            var myLatLng2 = {lat: latitude, lng: longitude};

            var marker = new google.maps.Marker({
                map: map,
                icon: companyImage,
                position: myLatLng2,
                title: 'Talhão'
            });
        });
    });



});


terrasApp.controller('infoTalhaoController', function ($scope, $routeParams, $firebaseObject, $window) {
    var id = $routeParams.idTalhao;
    var idP = $routeParams.idP;
    var ref = firebase.database().ref('/propriedades/' + idP);
    // download the data into a local object
    $scope.data = $firebaseObject(ref);
    // create a class active for menu
    $scope.message = 'Informações do Talhão';

    var refTalhoes = firebase.database().ref('/talhoes/' + idP + '/' +id);
    // download the data into a local object
    var dataTalhaoAux = $firebaseObject(refTalhoes);
    $scope.dataTalhao = dataTalhaoAux;

    dataTalhaoAux.$loaded().then(function () {
        var latitude = parseFloat(dataTalhaoAux.latitude);
        var longitude = parseFloat(dataTalhaoAux.longitude);

        var myLatLng = {lat: latitude, lng: longitude};

        $window.map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: myLatLng,
            mapTypeId: 'satellite',
            scrollwheel: false,
            zoom: 8
        });

        // Create a marker and set its position.
        var marker = new google.maps.Marker({
            map: map,
            position: myLatLng,
            title: 'Talhão'
        });
    });

});

terrasApp.controller('infoPlanejamentoController', function ($scope, $routeParams, $firebaseObject) {

    var id = $routeParams.idPlanej;
    $scope.id = id;
    var ref = firebase.database().ref('/planejamentos/' + id + '/dados');
    var refT = firebase.database().ref('/planejamentos/' + id + '/planejamentoTalhoes');
    $scope.dataT = $firebaseObject(refT);
    // download the data into a local object
    var aux = $firebaseObject(ref);
    $scope.data = aux;
    aux.$loaded().then(function () {
        var idP = aux.idPropriedade;
        var refP = firebase.database().ref('/propriedades/' + idP);
        $scope.dataP = $firebaseObject(refP);
    });
    // create a class active for menu
    $scope.message = 'Informações do Planejamento';
});

terrasApp.controller('infoPlanejamentoTalhaoController', function ($scope, $routeParams, $firebaseArray, $firebaseObject) {

    var id = $routeParams.idPlanej;
    $scope.id = id;
    var id2 = $routeParams.idPlanejTalhao;
    $scope.id2 = id2;
    var refT = firebase.database().ref('/planejamentos/' + id + '/planejamentoTalhoes' + '/' + id2);
    var pTalhao = $firebaseObject(refT);
    $scope.dataT = pTalhao;

    var ref = firebase.database().ref('/planejamentos/' + id + '/dados');
    var aux = $firebaseObject(ref);
    $scope.data = aux;
    aux.$loaded().then(function () {
        var idP = aux.idPropriedade;
        var refP = firebase.database().ref('/propriedades/' + idP);
        $scope.dataP = $firebaseObject(refP);
    });
    // download the data into a local object
    $scope.message = 'Informações do Planejamento';
});