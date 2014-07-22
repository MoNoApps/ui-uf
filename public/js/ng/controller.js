app.controller('Controller', function Controller($scope, $http) {
    $scope.elements = ['first element', 'second element'];
    $scope.capacity = { a: 'first document', b: 'second document' };

    $scope.isFunctional = function() {
        //stuff
    };

});
