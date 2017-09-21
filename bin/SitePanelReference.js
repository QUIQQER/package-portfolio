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
                var i, len;
                var List = new Element('ul');

                if (!categories) {
                    categories = [];
                }

                var liClick = function (event) {
                    if (event.target.nodeName === 'INPUT') {
                        return;
                    }

                    var Input     = this.getElement('input');
                    Input.checked = !Input.checked;
                };

                for (i = 0, len = categories.length; i < len; i++) {
                    new Element('li', {
                        html  : '<input type="checkbox" value="' + categories[i].category + '" />' +
                        '<span>' + categories[i].category + '</span>',
                        events: {
                            click: liClick
                        }
                    }).inject(List);
                }

                List.inject(self.$Elm);

                // select current categories
                for (i = 0, len = siteCategories.length; i < len; i++) {

                    List.getElements(
                        'input[value="' + siteCategories[i] + '"]'
                    ).set(
                        'checked', true
                    );

                }

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