Pinterest Like List
===================

This is an attempt to make a Pintrest-like list for Sencha Touch (2). 

We have not yet uploaded the demo online, but there is a demo available in the examples folder.

Getting Started
---------------

For using this widget in your application, follow below steps :-

1. Copy src folder to your app. The widget is located in src/ux/pintrest .
 
2. Add following to app.js (or your root js file).

    Ext.Loader.setPath('Ext.ux', './src/ux');

3. Add following CSS file ( src/ux/pintrest/resources/css/pintrest.css ) to list of CSS files. We have done this in app.json .


    "css": [

        {

            "path": "./src/ux/pintrest/resources/css/pintrest.css",

            "update": "full"

        },

        ...

    ]

4. In the view where you want to include the widget, add a require.
 
    requires: [

        'Ext.ux.pintrest.dataview.Pintrest',

        'Pintrest.view.MyPintrestItem', // only if we would like to customize the look of list items

        ...

    ],

    Next define a Pintrest like list, as done in example,

    config: {

        ...

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

            maxColumnWidth: 350,

            minSideSpacing: 0,

            columnMargin: 5,

            rowMargin: 5

        },

        ...

    },

    applyProductList: function(config) {

        var productList = Ext.factory (config, Ext.Pintrest, this.getProductList());

        productList.element.on ( 'tap', this.addProductToCart, this );

        return productList;

    },
    ...


5. If we are interested in customizing the look of items in Pintrest interface, please check how we have done it in,

   example/app/view/MyPintrestItem.js

   In the example, we have added a caption on the top with some of the items (2 for 1) by extending the pintrest item.


Attributes of Pintrest Like List
--------------------------------

The widget is derived from Ext.dataview.List . Most of the attributes are same. Some new attributes, specific to this widget are as follows,

defaultType (default pinitem) = PinItem class (can be overridden to create a custom class)

maxNumColumns (default 4) = Maximum number of columns

minNumColumns (default 2) = Minimum number of columns

maxColumnWidth(default 150) = Maximum width of each column

minSideSpacing (default 75) = Column width on the sides of Pintrest like list

columnMargin (default 0) = Empty spacing between columns 

rowMargin (default 0) = Empty spacing between rows


Hope you enjoy using the widet. 
