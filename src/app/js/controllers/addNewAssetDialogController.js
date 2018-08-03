angular.module('app').controller('addNewAssetDialogController', ['$scope', '$mdDialog', 'selectedNodeID', function($scope, $mdDialog, selectedNodeID) {

    $scope.selectedNodeID = 0
    $scope.assetName = ""
    $scope.assets = []
    $scope.assetTypes = {}
    $scope.assetTypesMap = {}
    $scope.addNewAssetTree = {}

    $scope.close = function() {
        $mdDialog.hide()
    }

    $scope.add = function() {





        // Perform Form Validation



        // Form Validation Complete and Correct

        // Get Selected Node
        if (!$scope.addNewAssetTree.currentNode) return

        let newAsset = { 'ParentID': $scope.addNewAssetTree.currentNode.ID, 'AssetTypeID': $scope.assetTypes.selected.ID || 1, 'Name': $scope.assetName, 'SoftDelete': 0 }

        console.log(newAsset)

        $scope.saving = 1

        socket.emit('addNewAsset', newAsset, function(err) {
            if (err) {
                console.error(err)
                $scope.saving = 0
                return
            }

            $scope.saving = 2

            $scope.refreshAssets(function() {
                $scope.saving = 0
                $scope.assetName = ''
                if (!$scope.$$phase) $scope.$digest()
            })
        })
    }

    $scope.requestAssetTypes = function(callback) {
        socket.emit('requestAssetTypes', '', (err, data) => {
            if (err) return console.error(err)

            console.log(data)

            $scope.assetTypes = {selected: data[0], options: data}
            $scope.assetTypesMap = $scope.assetTypes.options.reduce((map, option) => {
                map[option.ID] = option

                return map
            }, {})

            $scope.$digest()

            if (callback) callback()
        })
    }

    $scope.refreshAssets = function(callback) {
        socket.emit('requestAssets', '', (err, data) => {
            if (err) return console.error(err)

            let treeData = data.map(function(item) {
                if ($scope.addNewAssetTree.currentNode && $scope.addNewAssetTree.currentNode.ID && $scope.addNewAssetTree.currentNode.ID === item.ID) {
                    $scope.selectedNode = $scope.addNewAssetTree.currentNode
                    item.selected = 'selected'
                } else if (!$scope.addNewAssetTree || !$scope.addNewAssetTree.currentNode || !$scope.addNewAssetTree.currentNode.ID) {
                    if ((!selectedNodeID && item.ID === 1) || item.ID === selectedNodeID) item.selected = 'selected'
                }

                item.AssetType = String($scope.assetTypesMap[item.AssetTypeID].AssetType || 'No Asset Type').toLowerCase()

                return item
            })

            $scope.assets = unflatten(treeData)

            data.forEach(function(item) {
                if (item.selected === 'selected') $scope.addNewAssetTree.currentNode = item
            })

            console.log('Assets updated.')

            $scope.$digest()

            if (callback) callback()
        });
    }

    // Has to be done first
    $scope.requestAssetTypes(() => {
        $scope.refreshAssets()
    })
}])