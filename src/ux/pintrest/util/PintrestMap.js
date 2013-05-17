Ext.define('Ext.ux.pintrest.util.PintrestMap', {
    config: {
        minimumHeight: 50,
        numColumns: 3,
        columnWidth: 300,
        offsetX: 0
    },

    constructor:function(config) {
        this.colIdx = []; // maps an index to a certain column
        this.map = []; // a two dimentional array containing column and y-position for each item

        this.heights = []; // height of each item
        this.totalHeight = 0; // total height
        this.appendOrder = []; // order of appending items to columns

        this.initConfig(config);
    },

    populate:function(count, offset) {
        var map = this.map = this.map || [],
            minimumHeight = this.getMinimumHeight(),
            i, col, prev = 0, previousIndex = [];
/*
        if ( offset !== 0 ) {
            console.log ( "Offset is non-zero. Pintrest list has not been tested with non-zero offset and might cause errors in UI." );
            console.log (offset);
        }
*/
        for (i = offset + 0; i < count; i++) {
            col = i % this.getNumColumns();
            this.appendOrder[i] = col;
            prev = previousIndex[col];
            if ( prev !== undefined ) {
                map[col][prev] = map[col][prev-1] + minimumHeight;
            } else {
                map[col] = []; 
                previousIndex[col] = 0;
                this.colIdx[col] = [];
                map[col][0] = minimumHeight;
            }
            this.colIdx[col][prev] = i;
            previousIndex[col] += 1;
        }
        this.totalHeight = Math.floor( (count+1) / this.getNumColumns() ) * minimumHeight;

        for ( i = 0; i < count; i++ ) {
            this.heights[i] = minimumHeight;
        }
    },

    setItemHeight:function(index, height) {
        height = Math.max(height, this.getMinimumHeight());
        this.heights[index] = height;
    },

    update:function() {
        var map = this.map,
            minimumHeight = this.getMinimumHeight(),
            colHeight = [],
            count = this.heights.length,
            i, j, min, max, col,
            prev = 0, previousIndex = [];

        // reset column heights
        for (i = 0; i < this.getNumColumns(); i++) {
            colHeight[i] = 0;
            previousIndex[i] = 0;
            this.colIdx[i] = [];
            this.map[i] = [];
        }

        for (i = 0; i < count; i++) {
            // inefficient find min algo here
            min = colHeight[0];
            col = 0;
            for ( j=1; j<this.getNumColumns(); j++ ) {
                if ( min > colHeight[j] ) {
                    col = j;
                    min = colHeight[j];
                }
            }

            prev = previousIndex[col];
            map[col][prev] = colHeight[col];
            colHeight[col] += this.heights[i];
            this.colIdx[col][prev] = i;
            previousIndex[col] += 1;
            this.appendOrder[i] = col;
        }

        // inefficient find max algo here
        max = colHeight[0];
        for ( i=1; i<this.getNumColumns(); i++ ) {
            if ( max < colHeight[i] ) {
                max = colHeight[i];
            }
        }
        this.totalHeight = max;
        
        return true;
    },

    getItemHeight:function(index) {
        return this.heights[index];
    },

    getTotalHeight:function() {
        return this.totalHeight;
    },

    findIndex:function(posX, posY) {
        var col, row, index;
        posX = posX - this.getOffsetX;
        if ( this.getColumnWidth() === 0 ) return;
        col = Math.floor ( posX / this.getColumnWidth() );
        if ( isNaN(col) || col >= this.getNumColumns() ) return -1;
        row = this.map[col].length ? this.binarySearch(this.map[col], posY) : 0;
        index = this.colIdx[col][row]; 
        return index;
    },

    binarySearch:function(sorted, value) {
        var start = 0,
            end = sorted.length;

        if (value < sorted[0]) {
            return 0;
        }
        if (value > sorted[end - 1]) {
            return end - 1;
        }
        while (start + 1 < end) {
            var mid = (start + end) >> 1,
                val = sorted[mid];
            if (val == value) {
                return mid;
            } else if (val < value) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    }
});
