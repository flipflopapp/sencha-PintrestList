Ext.define('Ext.ux.pintrest.dataview.Pintrest', {
    alternateClassName: 'Ext.Pintrest',
    extend: 'Ext.dataview.List',

    requires: [
        'Ext.ux.pintrest.util.TranslatablePintrest',
        'Ext.ux.pintrest.util.PintrestMap',
        'Ext.ux.pintrest.dataview.component.PintrestItem'
    ],

    config: {
        cls: Ext.baseCSSPrefix + 'pintrest-list',

        useComponents: true,

        defaultType: 'pinitem',

        itemMap: {
            minimumHeight: 47
        },
 
        itemHeight: 47,

        maxNumColumns: 4,
        minNumColumns: 2,
        maxColumnWidth: 150,
        minSideSpacing: 75,
        columnMargin: 0,
        rowMargin: 0
    },

    applyItemMap:function(itemMap) {
        var config = Ext.merge ( {}, itemMap, 
                        {
                            numColumns: this.numColumns,
                            columnWidth: this.columnWidth,
                            offsetX: this.offsetX
                        } );
        return Ext.factory(itemMap, Ext.ux.pintrest.util.PintrestMap, this.getItemMap());
    },

    beforeInitialize:function() {
        var me = this,
            container;

        me.numColumns = this.getMaxNumColumns();
        me.columnWidth = 0;
        me.offsetX = 0;
        me.itemWidth = 0;

        me.listItems = [];
        me.scrollDockItems = {
            top: [],
            bottom: []
        };

        container = me.container = me.add(new Ext.Container({
            scrollable: {
                scroller: {
                    autoRefresh: false,
                    direction: 'vertical',
                    translatable: {
                        xclass: 'Ext.ux.pintrest.util.TranslatablePintrest',
                        columnWidth: this.columnWidth,
                        offsetX: this.offsetX,
                        numColumns: this.numColumns
                    }
                }
            }
        }));

        container.getScrollable().getScroller().getTranslatable().setItems(me.listItems);

        // Tie List's scroller to its container's scroller
        me.setScrollable(container.getScrollable());
        me.scrollableBehavior = container.getScrollableBehavior();
    },

    updateScrollerSize:function() {
        var me = this,
            totalHeight,
            scroller = me.container.getScrollable().getScroller();

        this.updateItemHeights();
        me.getItemMap().update();
        totalHeight = me.getItemMap().getTotalHeight();

        if (totalHeight > 0) {
            scroller.givenSize = totalHeight;
            scroller.refresh();
        }
    },

    onResize:function() {
        var me = this,
            container = me.container,
            element = container.element,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            containerSize;

        if (!me.listItems.length) {
            me.bind(container.getScrollable().getScroller().getTranslatable(), 'doTranslate', 'onTranslate');
        }

        this.numColumns = Math.floor ( (element.getWidth() - 2*this.getMinSideSpacing()) / this.getMaxColumnWidth() );
        this.numColumns = Math.min ( this.getMaxNumColumns(), this.numColumns );
        this.numColumns = Math.max ( this.getMinNumColumns(), this.numColumns );
        this.columnWidth = Math.min ( Math.floor(element.getWidth()/this.numColumns), this.getMaxColumnWidth() );
        this.itemWidth = this.columnWidth - this.getColumnMargin();
        this.offsetX = ( element.getWidth() - this.columnWidth * this.numColumns ) / 2;
        //console.log ( 'offsetX = ' + this.offsetX ); 

        this.getItemMap().setColumnWidth ( this.columnWidth ); 
        this.getItemMap().setOffsetX ( this.offsetX ); 
        this.getItemMap().setNumColumns ( this.numColumns ); 
        me.container.getScrollable().getScroller().getTranslatable().setColumnWidth( this.columnWidth );
        me.container.getScrollable().getScroller().getTranslatable().setOffsetX ( this.offsetX );
        me.container.getScrollable().getScroller().getTranslatable().setNumColumns ( this.numColumns );
      
        me.containerSize = containerSize = element.getHeight();
        me.setItemsCount(Math.ceil(containerSize / minimumHeight) * this.numColumns + 1);
    },


    onTranslate:function(x, y, args) {
        var me = this,
            listItems = me.listItems,
            itemsCount = listItems.length,
            currentTopIndex = me.topItemIndex,
            itemMap = me.getItemMap(),
            store = me.getStore(),
            storeCount = store.getCount(),
            info = me.getListItemInfo(),
            grouped = me.getGrouped(),
            storeGroups = me.groups,
//            headerMap = me.headerMap,
//            headerTranslate = me.headerTranslate,
//            pinHeaders = me.getPinHeaders(),
            maxIndex = storeCount - itemsCount + 1,
            topIndex, changedCount, i, index, item,
            closestHeader, record, pushedHeader, transY, element;

        if (me.updatedItems.length) {
            me.updateItemHeights();
        }

        me.topItemPosition = itemMap.findIndex(0, -y) || 0;
        me.indexOffset = me.topItemIndex = topIndex = Math.max(0, Math.min(me.topItemPosition, maxIndex));

/* HEADERS AND GROUPS NOT IMPLEMENTED
        if (grouped && headerTranslate && storeGroups.length && pinHeaders) {
            closestHeader = itemMap.binarySearch(headerMap, -y);
            record = storeGroups[closestHeader].children[0];
            if (record) {
                pushedHeader = y + headerMap[closestHeader + 1] - me.headerHeight;
                // Top of the list or above (hide the floating header offscreen)
                if (y >= 0) {
                    transY = -10000;
                }
                // Scroll the floating header a bit
                else if (pushedHeader < 0) {
                    transY = pushedHeader;
                }
                // Stick to the top of the screen
                else {
                    transY = Math.max(0, y);
                }
                this.headerTranslateFn(record, transY, headerTranslate);
            }
        }
*/

        if ( args !== undefined ) {
            args[0] = 0; 
            args[1] = (itemMap.map[0][topIndex] || 0) + y;
        }
        if (currentTopIndex !== topIndex && topIndex <= maxIndex) {
            // Scroll up
            if (currentTopIndex > topIndex) {
                changedCount = Math.min(itemsCount, currentTopIndex - topIndex) * this.numColumns;
                for (i = changedCount - 1; i >= 0; i--) {
                    item = listItems.pop();
                    listItems.unshift(item);
                    me.updateListItem(item, i + topIndex, info);
                }
            }
            else {
                // Scroll down
                changedCount = Math.min(itemsCount, topIndex - currentTopIndex) * this.numColumns;
                for (i = 0; i < changedCount; i++) {
                    item = listItems.shift();
                    listItems.push(item);
                    index = i + topIndex + itemsCount - changedCount;
                    me.updateListItem(item, index, info);
                }
            }
        }

/* PINHEADERS NOT IMPLEMENTED
        if (listItems.length && grouped && pinHeaders) {
            if (me.headerIndices[topIndex]) {
                element = listItems[0].getHeader().element;
                if (y < itemMap.map[topIndex]) {
                    element.setVisibility(false);
                }
                else {
                    element.setVisibility(true);
                }
            }
            for (i = 1; i <= changedCount; i++) {
                if (listItems[i]) {
                    listItems[i].getHeader().element.setVisibility(true);
                }
            }
        }
*/
    },

    setItemsCount:function(itemsCount) {
        var me = this,
            listItems = me.listItems,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            config = {
                xtype: me.getDefaultType(),
                itemConfig: me.getItemConfig(),
                tpl: me.getItemTpl(),
                minHeight: minimumHeight,
                cls: me.getItemCls()
            },
            info = me.getListItemInfo(),
            i, item;

        for (i = 0; i < itemsCount; i++) {
            // We begin by checking if we already have an item for this length
            item = listItems[i];

            // If we don't have an item yet at this index then create one
            if (!item) {
                item = Ext.factory(config);
                item.dataview = me;
//                item.$height = minimumHeight;
                item.setWidth (this.itemWidth);
                me.container.doAdd(item);
                listItems.push(item);
            }
            item.dataIndex = null;
            if (info.store) {
                me.updateListItem(item, i + me.topItemIndex, info);
            }
        }

        me.updateScrollerSize();
    },

    updateItemHeights:function() {
        if (!this.isPainted()) {
            this.pendingHeightUpdate = true;
            if (!this.pendingHeightUpdate) {
                this.on('painted', this.updateItemHeights, this, {single: true});
            }
            return;
        }

        var updatedItems = this.updatedItems,
            ln = updatedItems.length,
            itemMap = this.getItemMap(),
            scroller = this.container.getScrollable().getScroller(),
            minimumHeight = itemMap.getMinimumHeight(),
            headerIndices = this.headerIndices,
//            headerMap = this.headerMap,
            translatable = scroller.getTranslatable(),
            itemIndex, i, item, height;

        this.pendingHeightUpdate = false;

        // First we do all the reads
        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.dataIndex;
            // itemIndex may not be set yet if the store is still being loaded
            if (itemIndex !== null) {
                height = item.element.getFirstChild().getHeight();
                height = Math.max(height, minimumHeight);

                if (headerIndices && !this.headerHeight && headerIndices[itemIndex]) {
                    this.headerHeight = parseInt(item.getHeader().element.getHeight(), 10);
                }

                itemMap.setItemHeight(itemIndex, height + this.getRowMargin());
            }
        }

        itemMap.update();
        this.container.getScrollable().getScroller().getTranslatable().setAppendOrder(itemMap.appendOrder);
        height = itemMap.getTotalHeight();

/* HEADER NOT IMPLEMENTED
        headerMap.length = 0;
        for (i in headerIndices) {
            headerMap.push(itemMap.map[i]);
        }
*/

        // Now do the dom writes
        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.dataIndex;
            item.$height = itemMap.getItemHeight(itemIndex);
        }

        if (height != scroller.givenSize && height > scroller.givenSize) {
            scroller.setSize(height);
            scroller.refreshMaxPosition();

            if (translatable.isAnimating) {
                translatable.activeEasingY.setMinMomentumValue(-scroller.getMaxPosition().y);
            }
        }

        this.updatedItems.length = 0;
    }

});
