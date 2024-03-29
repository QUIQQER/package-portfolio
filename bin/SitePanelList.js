/**
 * Portfolio form
 *
 * @module package/quiqqer/portfolio/bin/SitePanelList
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/portfolio/bin/SitePanelList', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Prompt',
    'controls/grid/Grid',
    'Locale'

], function (QUI, QUIControl, QUIPrompt, Grid, QUILocale) {
    "use strict";

    var lg = 'quiqqer/portfolio';

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/SitePanelList',

        Binds: [
            'openAddCategoryDialog',
            '$deleteRow',
            '$onInject',
            '$onDestroy',
            '$onResize'
        ],

        options: {
            Site: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Panel   = this.getAttribute('Panel');
            this.$Site    = this.getAttribute('Site');
            this.$Project = this.$Site.getProject();
            this.$Grid    = null;

            this.addEvents({
                onInject : this.$onInject,
                onDestroy: this.$onDestroy,
                onResize : this.$onResize
            });
        },

        /**
         * create the dom node element
         *
         * @return {HTMLElement}
         */
        create: function () {
            var self = this;

            this.$Elm = new Element('div', {
                html  : '<div class="grid"></div>',
                styles: {
                    'float': 'left',
                    height : '100%',
                    width  : '100%'
                }
            });

            this.$Grid = new Grid(this.$Elm.getElement('.grid'), {
                buttons       : [{
                    name     : 'add',
                    text     : QUILocale.get('quiqqer/system', 'add'),
                    textimage: 'fa fa-plus',
                    events   : {
                        onClick: this.openAddCategoryDialog
                    }
                }, {
                    type: 'separator'
                }, {
                    name     : 'up',
                    text     : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.up'),
                    textimage: 'fa fa-angle-up',
                    disabled : true,
                    events   : {
                        onClick: function () {
                            self.$Grid.moveup();
                        }
                    }
                }, {
                    name     : 'down',
                    text     : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.down'),
                    textimage: 'fa fa-angle-down',
                    disabled : true,
                    events   : {
                        onClick: function () {
                            self.$Grid.movedown();
                        }
                    }
                }],
                columnModel   : [{
                    header   : '&nbsp;',
                    dataIndex: 'remove',
                    dataType : 'button',
                    width    : 60
                }, {
                    header   : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.category'),
                    dataIndex: 'category',
                    dataType : 'string',
                    width    : 200,
                    editable : true
                }, {
                    header   : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.group'),
                    dataIndex: 'group',
                    dataType : 'string',
                    width    : 250,
                    editable : true
                }, {
                    header   : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.description'),
                    dataIndex: 'description',
                    dataType : 'string',
                    width    : 500,
                    editable : true
                }],
                pagination    : true,
                editable      : true,
                editondblclick: true
            });

            // workaround
            this.$Grid.getElm().addEvent('mousedown', function (event) {
                var Target = event.target;

                if (Target.hasClass('fa-remove')) {
                    Target = Target.getParent('.qui-button');
                }

                if (Target.hasClass('qui-button')) {
                    self.$deleteRow(QUI.Controls.getById(Target.get('data-quiid')));
                }
            });

            this.$Grid.addEvents({
                click: function () {
                    var sel     = self.$Grid.getSelectedIndices(),
                        data    = self.$Grid.getData(),
                        buttons = self.$Grid.getButtons();

                    var Up   = null,
                        Down = null;

                    for (var i = 0, len = buttons.length; i < len; i++) {

                        if (buttons[i].getAttribute('name') === 'up') {
                            Up = buttons[i];
                        }

                        if (buttons[i].getAttribute('name') === 'down') {
                            Down = buttons[i];
                        }
                    }

                    if (!sel.length || data.length <= 1) {
                        Up.disable();
                        Down.disable();
                        return;
                    }

                    Up.enable();
                    Down.enable();
                },

                /**
                 * event - on edit complete
                 * @param {Object} data
                 */
                editComplete: function (data) {
                    var value    = data.input.value,
                        oldValue = data.oldvalue,
                        index    = data.columnModel.dataIndex;

                    if (index === 'description') {
                        return;
                    }

                    var i, len, rowData;
                    var currentData = self.$Grid.getData();

                    for (i = 0, len = currentData.length; i < len; i++) {
                        if (i === index) {
                            continue;
                        }

                        // reset value
                        if (currentData[i].category === value) {
                            rowData = self.$Grid.getDataByRow(data.row);

                            if (index in rowData) {
                                rowData[index] = oldValue;
                            }



                            self.$Grid.setDataByRow(data.row, self.$createRowData(
                                rowData.category,
                                rowData.description,
                                rowData.group
                            ));
                            return;
                        }
                    }
                }
            });
            return this.$Elm;
        },

        /**
         * event : on inject
         */
        $onInject: function () {
            this.$onResize();

            // set data
            var categories = this.$Site.getAttribute(
                'quiqqer.portfolio.settings.categories'
            );

            if (!categories) {
                return;
            }


            var data   = [];
            categories = JSON.decode(categories);

            for (var i = 0, len = categories.length; i < len; i++) {
                data.push(
                    this.$createRowData(
                        categories[i].category,
                        categories[i].description,
                        categories[i].group
                    )
                );
            }

            this.$Grid.setData({
                data: data
            });
        },

        /**
         * unload the control
         */
        unload: function () {
            this.$onDestroy();
        },

        /**
         * event : on destroy
         * set the tags to the site
         */
        $onDestroy: function () {
            var result = [],
                data   = this.$Grid.getData();

            for (var i = 0, len = data.length; i < len; i++) {
                result.push({
                    category   : data[i].category,
                    description: data[i].description,
                    group: data[i].group
                });
            }

            this.$Site.setAttribute(
                'quiqqer.portfolio.settings.categories',
                JSON.encode(result)
            );
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            if (!this.$Grid) {
                return;
            }

            var size = this.$Elm.getSize();

            this.$Grid.setHeight(size.y);
            this.$Grid.setWidth(size.x);
            this.$Grid.resize();
        },

        /**
         * Opens the add dialog
         */
        openAddCategoryDialog: function () {
            var self = this;

            new QUIPrompt({
                title        : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.windowAdd.title'),
                icon         : 'fa fa-plus',
                information  : QUILocale.get(lg, 'quiqqer.portfolio.reference.settings.windowAdd.description'),
                maxHeight    : 300,
                maxWidth     : 450,
                cancel_button: {
                    text     : QUILocale.get('quiqqer/system', 'cancel'),
                    textimage: 'fa fa-remove'
                },
                ok_button    : {
                    text     : QUILocale.get('quiqqer/system', 'add'),
                    textimage: 'fa fa-plus'
                },
                events       : {
                    onSubmit: function (value) {
                        self.addCategory(value);
                    }
                }
            }).open();

        },

        /**
         * Add a category
         *
         * @param {String} str
         */
        addCategory: function (str) {
            var data = this.$Grid.getData();

            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].category === str) {
                    return;
                }
            }

            this.$Grid.addRow(this.$createRowData(str));
        },

        /**
         * Delete a row - category
         *
         * @param {Object} Btn
         */
        $deleteRow: function (Btn) {
            this.$Grid.deleteRow(
                Btn.getAttribute('data').row
            );
        },

        /**
         * Return data for a row
         *
         * @param {String} category - Category name
         * @param {String} [description] - Description of the category
         * @group {String} [group] - group of the category
         * @returns {{remove: *, category: *, description: *}}
         */
        $createRowData: function (category, description, group) {
            description = description || '';
            group       = group || '';

            return {
                remove     : {
                    icon  : 'fa fa-remove',
                    events: {
                        click: this.$deleteRow
                    },
                    styles: {
                        lineHeight: 20,
                        padding   : '0 10px'
                    }
                },
                category   : category,
                description: description,
                group      : group
            };
        }
    });
});
