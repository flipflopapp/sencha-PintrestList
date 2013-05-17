Ext.define('Ext.ux.pintrest.dataview.component.PintrestItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype : 'pinitem',

    requires: [
        'Ext.Img'
    ],

    config: {
        //baseCls: 'x-pintrest-item',

        dataMap: {
            getImage: {
                setSrc: 'image'
            },
            getCaption: {
                setHtml: 'title'
            }
        },

        body: null,
        disclosure: null,
        header: null,
        tpl: null,

        image: {
            cls: 'x-pintrest-item-image',
            mode: 'd'
        },
        caption: {
            cls: 'x-pintrest-item-caption',
            docked: 'bottom'
        }
    },

    applyImage: function(config) {
        var me = this;
        var img = Ext.factory(config, Ext.Img, this.getImage());
        img.on ( 'load', function() {
            var height = Math.max ( me.element.getFirstChild().getHeight(), 
                                    me.dataview.getItemMap().getMinimumHeight() );
            if ( height !== me.$height ) {
                me.$height = height; 
                me.dataview.refresh ();
            }
        } );
        return img;
    },

    updateImage: function(newImage, oldImage) {
        if (newImage) {
            this.add(newImage);
        }
        if (oldImage) {
            this.remove(oldImage);
        }
    },

    applyCaption: function(config) {
        return Ext.factory(config, Ext.Component, this.getCaption());
    },

    updateCaption: function(newCaption, oldCaption) {
        if (newCaption) {
            this.add(newCaption);
        }
        if (oldCaption) {
            this.remove(oldCaption);
        }
    },

    updateTpl: function(tpl) {
    }

});
