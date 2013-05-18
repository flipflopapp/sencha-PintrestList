Ext.define('Pintrest.model.Item', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'bundled', type: 'boolean'},
            {name: 'image', type: 'string'}
        ],

        idProperty: 'id'
    }
});
