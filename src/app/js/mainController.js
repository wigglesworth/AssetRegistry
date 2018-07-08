var app = angular.module('app', ['ngMaterial', 'ngMessages'])

app.controller('mainController', function($scope, $mdDialog) {

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
            controller: AddNewAssetDialogController,
            templateUrl: './src/app/js/templates/addNewAssetDialogTemplate.html',
            targetEvent: ev,
            locals: {
                selectedNodeID: ($scope.selectedAsset) ? $scope.selectedAsset.ID : null
            },
            parent: angular.element(document.body),
            clickOutsideToClose:true
        })
    }

    $scope.addNewLocation = function(ev) {
        $mdDialog.show({
            controller: AddNewLocationDialogController,
            templateUrl: './src/app/js/templates/addNewLocationDialogTemplate.html',
            targetEvent: ev,
            locals: {
                selectedNodeID: ($scope.selectedAsset) ? $scope.selectedAsset.ID : null
            },
            parent: angular.element(document.body),
            clickOutsideToClose:true
        })
    }

    $scope.$$digest = function() {
        if (!$scope.$$phase) $scope.$digest();
    }

    $scope.requestAssets()

    let unflatten = function( array, parent, tree ){

        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : { id: null };

        let children = array.filter(function(child) { return child.ParentID == parent.ID })

        if (children.length !== 0) {
            if (parent.ID == null) tree = children
            else parent['children'] = children

            children.forEach(function(child) { unflatten(array, child, tree) })
        }

        return tree;
    }

    let AddNewAssetDialogController = function($scope, $mdDialog, selectedNodeID) {

        $scope.okay = function() {
            $mdDialog.hide();
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        }
    }

    let AddNewLocationDialogController = function($scope, $mdDialog, selectedNodeID) {
        $scope.close = function() {
            $mdDialog.hide();
        }

        $scope.add = function() {


            // Perform Form Validation



            // Form Validation Complete and Correct


            console.log('This will add a new location.')



            $scope.saving = 1

            setTimeout(function() {

                $scope.saving = 2
                $scope.$digest()

                setTimeout(function() {

                    $scope.saving = 0
                    $scope.$digest()

                }, 1000)

            }, 2000)
        }

        // OnLoad
        socket.emit('requestAssets', '', (err, data) => {
            if (err) return console.error(err)

            // Do shit to all the locations
            data = data.map(function(item) {
                item.text = item.Name;
                item.state = {
                    selected: item.ID === selectedNodeID
                }

                return item;})

            $scope.locations = unflatten(data)

            $('#docTree').jstree({
                'core': {
                    'data': $scope.locations
                }
            })

            let tree = $('#docTree').jstree(true)
            if (selectedNodeID !== null) tree.select_node(selectedNodeID)

            $scope.$digest()
        });
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