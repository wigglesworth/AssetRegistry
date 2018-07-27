let unflatten = require('./src/app/js/utilities/unflatten')

angular.module('app', ['ngMaterial', 'ngMessages', 'angularTreeview']).controller('mainController', function($scope, $mdDialog) {

    $scope.assets = [];
    $scope.selectedAsset = null;

    $scope.selectAsset = function(asset) {
        $scope.selectedAsset = asset;
    }

    $scope.requestAssets = function() {
        // Request a list of all the assets
        socket.emit('requestAssets', '', (err, data) => {
            if (err) return console.error(err)

            $scope.assets = unflatten(data)

            $scope.$$digest()
        });
    }

    $scope.addNewAsset = function(ev) {
        $mdDialog.show({
            controller: 'addNewAssetDialogController',
            templateUrl: './src/app/js/templates/addNewAssetDialogTemplate.html',
            targetEvent: ev,
            locals: {
                selectedNodeID: ($scope.selectedAsset) ? $scope.selectedAsset.ID : 1
            },
            parent: angular.element(document.body),
            clickOutsideToClose:true
        })
    }

    $scope.addNewLocation = function(ev) {
        $mdDialog.show({
            controller: 'addNewLocationDialogController',
            templateUrl: './src/app/js/templates/addNewLocationDialogTemplate.html',
            targetEvent: ev,
            locals: {
                selectedNodeID: ($scope.selectedAsset) ? $scope.selectedAsset.ID : 1a
            },
            parent: angular.element(document.body),
            clickOutsideToClose:true
        })
    }

    $scope.$$digest = function() {
        if (!$scope.$$phase) $scope.$digest();
    }

    $scope.requestAssets()

    let AddNewAssetDialogController = function($scope, $mdDialog, selectedNodeID) {

        $scope.okay = function() {
            $mdDialog.hide();
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        }
    }
})
.directive('arRecursiveChildren', function() {
    return {
        restrict: 'E',
        scope: {
            assets: '=children',
            selectFunction: '&'
        },
        templateUrl: './src/app/js/templates/arRecursiveChildren.html',
        link: function($scope) {
            $scope.select = function(asset) {
                $scope.selectFunction({asset: asset})
            }
        }
    }
})