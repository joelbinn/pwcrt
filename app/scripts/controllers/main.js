'use strict';

angular.module('pwcrtApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    localStorage.blcktxPwcrtServices = localStorage.blcktxPwcrtServices || JSON.stringify({});
    $scope.items = {};

    function generatePw() {
      var service = $scope.service;
      var pass = $scope.password;
      var services = JSON.parse(localStorage.blcktxPwcrtServices);
      if (service) {
        services[service] = service;
      }
      localStorage.blcktxPwcrtServices = JSON.stringify(services);
      for (var s in services) {
        if (services.hasOwnProperty(s)) {
          generatePwForService(s, pass);
        }
      }
    }

    function generatePwForService(service, pass) {
      var hash = CryptoJS.SHA3(service + pass, { outputLength: 512 }).toString(CryptoJS.enc.Base64).replace(/[^0-9^A-Z^a-z]/g, '');
      var found = false;
      for (var i = 0; i < hash.length - 15; i++) {
        var nums = hash.slice(i, i + 15).replace(/[^0-9]/g, '');
        var lc = hash.slice(i, i + 15).replace(/[^a-z]/g, '');
        var uc = hash.slice(i, i + 15).replace(/[^A-Z]/g, '');
        console.log("nums: " + nums + ",lc:" + lc + ",uc:" + uc);
        if (nums.length >= 4 && lc.length >= 4 && uc.length >= 4) {
          $scope.items[service] = uc.slice(0, 3) + lc.slice(0, 3) + nums.slice(0, 3);
          i = hash.length + 11;
          found = true;
        }
      }
      if (!found) {
        $scope.items[service] = "Couldn't generate password for that service/master password combination"
      }
    }

    $scope.generatePassword = function () {
      generatePw();
    };

    $scope.remove = function(service) {
      var services = JSON.parse(localStorage.blcktxPwcrtServices);
      if (service) {
        services[service] = undefined;
      }
      localStorage.blcktxPwcrtServices = JSON.stringify(services);
    };

    generatePw();

  });
