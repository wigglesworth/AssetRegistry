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

module.exports = unflatten