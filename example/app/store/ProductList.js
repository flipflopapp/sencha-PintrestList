Ext.define('Pintrest.store.ProductList', {
    extend: 'Ext.data.Store',

    require: ['Pintrest.model.Item'],

    config: {
        model: 'Pintrest.model.Item',
        storeId: 'productliststore',
        data: categorydata 
    }
});
