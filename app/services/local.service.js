angular.module('app').factory('LocalService', function($rootScope){
	var sharedService = {};

	sharedService.id = '';
  sharedService.states = [
   {
      state:'Abia',
      ISO:'AB'
   },
   {
      state:'Adamawa',
      ISO:'AD'
   },
   {
      state:'Akwa Ibom',
      ISO:'AI'
   },
   {
      state:'Anambra',
      ISO:'AN'
   },
   {
      state:'Bauchi',
      ISO:'BC'
   },
   {
      state:'Bayelsa',
      ISO:'BY'
   },
   {
      state:'Benue',
      ISO:'BN'
   },
   {
      state:'Borno',
      ISO:'BO'
   },
   {
      state:'Cross River',
      ISO:'CR'
   },
   {
      state:'Delta',
      ISO:'DL'
   },
   {
      state:'Ebonyi ',
      ISO:'EB'
   },
   {
      state:'Edo',
      ISO:'ED'
   },
   {
      state:'Ekiti',
      ISO:'EK'
   },
   {
      state:'Enugu ',
      ISO:'EG'
   },
   {
      state:'Federal Capital Territory',
      ISO:'FCT'
   },
   {
      state:'Gombe',
      ISO:'GB'
   },
   {
      state:'Imo',
      ISO:'IM'
   },
   {
      state:'Jigawa',
      ISO:'JG'
   },
   {
      state:'Kaduna',
      ISO:'KD'
   },
   {
      state:'Kano',
      ISO:'KN'
   },
   {
      state:'Katsina',
      ISO:'KS'
   },
   {
      state:'Kogi',
      ISO:'KG'
   },
   {
      state:'Kwara',
      ISO:'KW'
   },
   {
      state:'Lagos',
      ISO:'LG'
   },
   {
      state:'Nasarawa',
      ISO:'NW'
   },
   {
      state:'Niger',
      ISO:'NG'
   },
   {
      state:'Ogun',
      ISO:'OG'
   },
   {
      state:'Ondo',
      ISO:'OD'
   },
   {
      state:'Osun',
      ISO:'OS'
   },
   {
      state:'Oyo',
      ISO:'OY'
   },
   {
      state:'Plateau',
      ISO:'PL'
   },
   {
      state:'Rivers',
      ISO:'RV'
   },
   {
      state:'Sokoto',
      ISO:'SK'
   },
   {
      state:'Taraba',
      ISO:'TR'
   },
   {
      state:'Yobe',
      ISO:'YB'
   },
   {
      state:'Zamfara',
      ISO:'ZM'
   }
];

  sharedService.createUser = function(label){
    $rootScope.$broadcast(label);
  };

  sharedService.prepForBroadcast = function(id) {
    this.id = id;
    this.broadcastItem();
  };

  sharedService.broadcastItem = function() {
    $rootScope.$broadcast('handleBroadcast');
  };
  sharedService.staff = Staff();

  return sharedService;

  function Staff() {
    return [
      {
        "objectId": "58016a98cda015124e35894c",
        "isActive": true,
        "firstName": "Thompson",
        "lastName": "Edolo",
        "email": "verygreenboi@live.com",
        "phone": "+234 (886) 428-2242",
        "position": "Principal"
      },
      {
        "objectId": "58016a98febd99df1bcda2aa",
        "isActive": false,
        "firstName": "Elnora",
        "lastName": "Hubbard",
        "email": "elnora.hubbard@schoolpop.me",
        "phone": "+234 (884) 595-2561",
        "position": "Teacher"
      },
      {
        "objectId": "58016a98e7365d8b8f377fff",
        "isActive": true,
        "firstName": "Mcintosh",
        "lastName": "Sweet",
        "email": "mcintosh.sweet@schoolpop.us",
        "phone": "+234 (924) 419-2305",
        "position": "Teacher"
      },
      {
        "objectId": "58016a98019325a80f320686",
        "isActive": false,
        "firstName": "Etta",
        "lastName": "Mendoza",
        "email": "etta.mendoza@schoolpop.io",
        "phone": "+234 (976) 501-3763",
        "position": "Teacher"
      },
      {
        "objectId": "58016a9832184c16f9f89420",
        "isActive": false,
        "firstName": "Lelia",
        "lastName": "Olsen",
        "email": "lelia.olsen@schoolpop.ca",
        "phone": "+234 (975) 403-2560",
        "position": "Administrator"
      }
    ];
  }
});
