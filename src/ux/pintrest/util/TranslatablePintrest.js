Ext.define('Ext.ux.pintrest.util.TranslatablePintrest', {
    extend: 'Ext.util.translatable.Abstract',

    config: {
        numColumns: 3,
        columnWidth: 300,
        offsetX: 0,
        items: [],
        appendOrder: []
    },

    applyItems: function(items) {
        return Ext.Array.from(items);
    },

    initialize: function() {
        var appendorder = [], i;
        for ( i = 0; i < this.getItems().length; i++ ) {
            appendorder[i] = i % this.getNumColumns();
        }
        this.setAppendOrder(appendorder);
    },

    doTranslate: function(x, y) {
        var items = this.getItems(),
            appendOrder = this.getAppendOrder(),
            colWidth = this.getColumnWidth(),
            offsetX = this.getOffsetX(), offsetY = 0, maxY = 0,
            colHeight = [],
            i, col, ln, item, translateX, translateY;

        if ( appendOrder.length === 0 ) return; 

        for ( i = 0; i < this.getNumColumns(); i++ ) {
            colHeight[i] = 0;
        }

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            if (item && item.$height !== undefined && !item._list_hidden) {
                col = appendOrder[i];
                translateX = x + colWidth * col + offsetX;
                translateY = y + colHeight[col];
                item.translate(translateX, translateY);
                colHeight[col] += item.$height;
            }
        }
    }
});
