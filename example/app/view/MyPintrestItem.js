Ext.define('Pintrest.view.MyPintrestItem', {
    extend: 'Ext.ux.pintrest.dataview.component.PintrestItem',
    xtype : 'mypinitem',

    config: {
        offer: {
            cls: 'x-pintrest-item-offer',
            html: '2 for 1',
            docked: 'top',
            width: '100%',
            hidden: true // default is hidden
        }
    },

    applyOffer: function(config) {
        var offer = Ext.factory (config, Ext.Component, this.getOffer());
        return offer;
    },

    updateOffer: function(newOffer, oldOffer) {
        if (newOffer) {
            this.add(newOffer);
        }
        if (oldOffer) {
            this.remove(oldOffer);
        }
    },

    updateRecord: function(newRec) {
        this.callParent(arguments);
        if ( newRec !== null ) {
            // adding productid to the dom, so that we can look for it when when
            // user taps a pinitem and know which productid should be opened up. 
            this.element.dom.setAttribute ( 'productid' , newRec.getData().id );

            if ( newRec.getData().bundled === true ) {
                this.getOffer().show();
            } else {
                this.getOffer().hide();
            }
        }
    }
});
