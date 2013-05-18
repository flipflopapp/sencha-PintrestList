Ext.define('Pintrest.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.ux.pintrest.dataview.Pintrest',
        'Pintrest.view.MyPintrestItem',
        'Pintrest.store.ProductList'
    ],

    config: {

        productListStore: 'Pintrest.store.ProductList',

        titlebar: {
            xtype: 'titlebar',
            title: 'Pintrest Widget Demo',
            docked: 'top',
            ui: 'light',
            inline: true,
            items: [
            { xtype: 'spacer' }
            ]
        },

        productList: {
            id: 'productlist',
            defaultType: 'mypinitem',
            top: 0,
            bottom: 0,
            left: 5,
            right: 0,
            disableSelection: true,
            maxNumColumns: 4,
            minNumColumns: 2,
            maxColumnWidth: 200,
            minSideSpacing: 0,
            columnMargin: 5,
            rowMargin: 5
        },

        items: [ ]
    },

    initialize: function() {
        var me = this;
        me.getProductList().setStore( this.getProductListStore() );
        me.add ( me.getTitlebar() );
        me.add ( me.getProductList() );
    },

    applyTitlebar: function(config) {
        var toolbar = Ext.factory ( config, Ext.TitleBar, this.getTitlebar() );
        return toolbar;
    },

    applyProductList: function(config) {
        var productList = Ext.factory (config, Ext.Pintrest, this.getProductList());
        productList.element.on ( 'tap', this.addProductToCart, this );
        return productList;
    },

    applyProductListStore: function(storeId) {
        var store = Ext.create ( storeId );
        return store;
    },

    addProductToCart: function(evt, dom) {
        Ext.Msg.alert('Click', 'Widget developed by FlipFlopApp (www.flipflopapp.com).');
    }
});
