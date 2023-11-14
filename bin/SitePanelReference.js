/**
 * Portfolio category list for a portfolio entry
 *
 * @module package/quiqqer/portfolio/bin/SitePanelReference
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/portfolio/bin/SitePanelReference', [

    'qui/QUI',
    'qui/controls/Control',
    'Locale',
    'Ajax',

    'css!package/quiqqer/portfolio/bin/SitePanelReference.css'

], function (QUI, QUIControl, QUILocale, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/SitePanelReference',

        Binds: [
            '$onInject',
            '$onDestroy'
        ],

        options: {
            Site: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Panel   = this.getAttribute('Panel');
            this.$Site    = this.getAttribute('Site');
            this.$Project = this.$Site.getProject();

            this.addEvents({
                onInject : this.$onInject,
                onDestroy: this.$onDestroy
            });
        },

        /**
         * create the dom node element
         *
         * @return {HTMLElement}
         */
        create: function () {

            this.$Elm = new Element('div', {
                'class': 'qui-control-portfolio-reference-list',
                styles : {
                    'float': 'left',
                    width  : '100%'
                }
            });

            return this.$Elm;
        },

        /**
         * event : on inject
         */
        $onInject: function () {
            var self = this;

            this.$Panel.Loader.show();

            // set data
            var siteCategories = this.$Site.getAttribute(
                'quiqqer.portfolio.settings.categories'
            );


            if (!siteCategories) {
                siteCategories = [];
            } else {
                siteCategories = JSON.decode(siteCategories);
            }

            Ajax.get('package_quiqqer_portfolio_ajax_getCategories', function (categories) {
                if (!categories) {
                    categories = [];
                }

                // set "empty" value for "group" without value for array
                categories.forEach((Category) => {
                    if (Category.group === '') {
                        Category.group = "empty";
                    }
                });

                // get array with unique groups
                var uniqueGroups = [];

                categories.forEach((Category) => {
                    if (!uniqueGroups.includes(Category.group) && Category.group !== '') {
                        uniqueGroups.push(Category.group);
                    }
                });

                // sort categories data into groups
                var categoriesGroups = [];

                uniqueGroups.forEach((UniqueGroups) => {
                    var groups = [];
                    categories.forEach((Categories) => {
                        if (Categories.group.includes(UniqueGroups)) {
                            groups.push(Categories);
                        }
                    });
                    categoriesGroups.push(groups);
                });

                if(categories.length === 0) {
                    new Element('span', {
                        html: QUILocale.get('quiqqer/portfolio', 'admin.types.portfolio.categories.none')
                    }).inject(self.$Elm);
                }

                var liClick = function (event) {
                    if (event.target.nodeName === 'INPUT') {
                        return;
                    }

                    var Input     = this.getElement('input');
                    Input.checked = !Input.checked;
                };

                // create HTML element to display on backend
                var GroupElm = null;
                var HtmlElm = new Element('div');
                categoriesGroups.forEach(function (group) {

                    var groupHeader = group[0].group;

                    if (groupHeader === "empty") {
                        groupHeader = QUILocale.get('quiqqer/portfolio', 'quiqqer.portfolio.reference.settings.group.empty');
                    }

                    // creat container DIV for list and group "header"
                    GroupElm = new Element('div', {
                        html  : '<span>' + groupHeader + '<span/>'
                    });

                    // creat ul for list
                    var List = new Element('ul');

                    // creat liist
                    group.forEach(function (e) {
                        new Element('li', {
                            html  : '<input type="checkbox" value="' + e.category + '" />' +
                                '<span>' + e.category + '</span>',
                            events: {
                                click: liClick
                            }
                        }).inject(List); //mam to w UL
                    });

                    // select current categories
                    siteCategories.forEach( function (e) {
                        List.getElements(
                            'input[value="' + e + '"]'
                        ).set(
                            'checked', true
                        );
                    });

                    List.inject(GroupElm);
                    GroupElm.inject(HtmlElm);
                });

                HtmlElm.inject(self.$Elm);

                self.$Panel.Loader.hide();
            }, {
                'package': 'quiqqer/portfolio',
                project  : this.$Project.encode(),
                childId  : this.$Site.getId()
            });
        },

        /**
         * event : on destroy
         * set the tags to the site
         */
        $onDestroy: function () {
            var values = this.$Elm.getElements('input:checked').map(function (Elm) {
                return Elm.get('value');
            });

            this.$Site.setAttribute(
                'quiqqer.portfolio.settings.categories',
                JSON.encode(values)
            );
        },

        /**
         * on control unload
         */
        unload: function () {
            this.$onDestroy();
        }
    });
});