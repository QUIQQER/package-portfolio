/**
 * Portfolio form
 *
 * @module package/quiqqer/portfolio/bin/SitePanelList
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/windows/Prompt
 * @require controls/grid/Grid
 * @require Locale
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
                    text     : 'Hinzufügen',
                    textimage: 'icon-plus fa fa-plus',
                    events   : {
                        onClick: this.openAddCategoryDialog
                    }
                }, {
                    type: 'seperator'
                }, {
                    name     : 'up',
                    text     : 'Hoch',
                    textimage: 'icon-angle-up fa fa-angle-up',
                    disabled : true,
                    events   : {
                        onClick: function () {
                            self.$Grid.moveup();
                        }
                    }
                }, {
                    name     : 'down',
                    text     : 'Runter',
                    textimage: 'icon-angle-down fa fa-angle-down',
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
                    header   : 'Kategorie',
                    dataIndex: 'category',
                    dataType : 'string',
                    width    : 200,
                    editable : true
                }, {
                    header   : 'Beschreibung',
                    dataIndex: 'description',
                    dataType : 'string',
                    width    : 500,
                    editable : true
                }],
                pagination    : true,
                editable      : true,
                editondblclick: true
            });

            this.$Grid.addEvents({
                click: function () {
                    var sel     = self.$Grid.getSelectedIndices(),
                        data    = self.$Grid.getData(),
                        buttons = self.$Grid.getButtons();

                    var Up   = null,
                        Down = null;

                    for (var i = 0, len = buttons.length; i < len; i++) {

                        if (buttons[i].getAttribute('name') == 'up') {
                            Up = buttons[i];
                        }

                        if (buttons[i].getAttribute('name') == 'down') {
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

                    if (index == 'description') {
                        return;
                    }

                    var currentData = self.$Grid.getData();

                    for (var i = 0, len = currentData.length; i < len; i++) {
                        if (i == index) {
                            continue;
                        }

                        // reset value
                        if (currentData[i].category == value) {

                            var rowData = self.$Grid.getDataByRow(data.row);

                            if (index in rowData) {
                                rowData[index] = oldValue;
                            }

                            self.$Grid.setDataByRow(data.row, self.$createRowData(
                                rowData.category,
                                rowData.description
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
                        categories[i].description
                    )
                );
            }

            this.$Grid.setData({
                data: data
            });
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
                    description: data[i].description
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
                title        : 'Kategorie hinzufügen',
                icon         : 'icon-plus fa fa-plus',
                information  : 'Wählen Sie bitte einen Namen für Ihre Kategorie',
                maxHeight    : 300,
                maxWidth     : 450,
                cancel_button: {
                    text     : QUILocale.get('quiqqer/system', 'cancel'),
                    textimage: 'icon-remove fa fa-remove'
                },
                ok_button    : {
                    text     : QUILocale.get('quiqqer/system', 'add'),
                    textimage: 'icon-plus fa fa-plus'
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
                if (data[i].category == str) {
                    return;
                }
            }

            this.$Grid.addRow(this.$createRowData(str));
        },

        /**
         * Delete a row - category
         *
         * @param {Object} Btn
         * @param {DOMEvent} event
         */
        $deleteRow: function (Btn, event) {

            event.stop();

            this.$Grid.deleteRow(
                Btn.getAttribute('data').row
            );
        },

        /**
         * Return data for a row
         *
         * @param {String} category - Category name
         * @param {String} [description] - Description of the category
         * @returns {{remove: {icon: string, events: {onClick: (exports.$deleteRow|Function)}}, category: *}}
         */
        $createRowData: function (category, description) {

            description = description || '';

            return {
                remove     : {
                    icon  : 'fa fa-remove icon-remove',
                    events: {
                        onClick: this.$deleteRow
                    },
                    styles: {
                        lineHeight: 20,
                        padding   : '0 10px'
                    }
                },
                category   : category,
                description: description
            };
        }
    });
});
