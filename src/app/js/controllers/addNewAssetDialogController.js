angular.module('app').controller('addNewLocationDialogController', ['$scope', '$mdDialog', 'selectedNodeID', function($scope, $mdDialog, selectedNodeID) {

    $scope.selectedNodeID = 0
    $scope.locationName = ""
    $scope.locations = []
    $scope.addNewLocationTree = {}

    $scope.close = function() {
        $mdDialog.hide()
    }

    $scope.add = function() {





        // Perform Form Validation



        // Form Validation Complete and Correct

        // Get Selected Node
        if (!$scope.addNewLocationTree.currentNode) return

        let newLocation = { 'ParentID': $scope.addNewLocationTree.currentNode.ID, 'Name': $scope.locationName, 'SoftDelete': 0 }

        console.log(newLocation)

        $scope.saving = 1

        socket.emit('addNewLocation', newLocation, function(err) {
            if (err) {
                console.error(err)
                $scope.saving = 0
                return
            }

            $scope.saving = 2

            $scope.refreshLocations(function() {
                $scope.saving = 0
                $scope.locationName = ''
                if (!$scope.$$phase) $scope.$digest()
            })
        })
    }

    $scope.refreshLocations = function(callback) {
        socket.emit('requestAssets', '', (err, data) => {
            if (err) return console.error(err)

            let treeData = data.map(function(item) {
                if ($scope.addNewLocationTree.currentNode && $scope.addNewLocationTree.currentNode.ID && $scope.addNewLocationTree.currentNode.ID === item.ID) {
                    $scope.selectedNode = $scope.addNewLocationTree.currentNode
                    item.selected = 'selected'
                } else if (!$scope.addNewLocationTree || !$scope.addNewLocationTree.currentNode || !$scope.addNewLocationTree.currentNode.ID) {
                    if ((!selectedNodeID && item.ID === 1) || item.ID === selectedNodeID) item.selected = 'selected'
                }

                item.CustomClass = 'location'

                return item
            })

            $scope.locations = unflatten(treeData)

            data.forEach(function(item) {
                if (item.selected === 'selected') $scope.addNewLocationTree.currentNode = item
            })

            console.log('Locations updated.')

            $scope.$digest()

            if (callback) callback()
        });
    }



    $scope.refreshLocations()

}])