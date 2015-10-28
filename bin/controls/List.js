/**
 *
 *
 * @module package/quiqqer/portfolio/bin/controls/List
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/windows/Window
 */
define('package/quiqqer/portfolio/bin/controls/List', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/controls/List',

        Binds: [
            '$onImport'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });

            this.$childWidth = 0;
        },

        /**
         * events : on import
         */
        $onImport: function () {

            var i, len;

            var self       = this;
            var categories = document.getElements('.quiqqer-portfolio-categories-entry');
            var entries    = document.getElements('.quiqqer-portfolio-list-entry');

            this.$childWidth = entries[0].getComputedSize().width;

            // categories
            var openCategory = function () {

                var catId = this.get('html').trim();

                if (this.hasClass('quiqqer-portfolio-category__active')) {
                    return;
                }

                categories.removeClass('quiqqer-portfolio-category__active');

                this.addClass('quiqqer-portfolio-category__active');

                // found entries
                var inResult = entries.filter(function (Child) {
                    return Child.get('data-categories')
                        .toString()
                        .match(',' + catId + ',');
                });

                var notInResult = entries.filter(function (Child) {
                    return !Child.get('data-categories')
                        .toString()
                        .match(',' + catId + ',');
                });

                if (notInResult.length) {
                    moofx(notInResult).animate({
                        height : 0,
                        opacity: 0,
                        padding: 0,
                        width  : 0
                    }, {
                        duration: 250
                    });
                }

                if (inResult.length) {
                    moofx(inResult).animate({
                        height : 300,
                        opacity: 1,
                        padding: 10,
                        width  : self.$childWidth
                    }, {
                        duration: 250
                    });
                }
            };


            for (i = 0, len = categories.length; i < len; i++) {
                categories[i].addEvent('click', openCategory);
            }


            // entries
            var openEntry = function (event) {

                event.stop();

                var Entry = this;

                require([
                    'package/quiqqer/portfolio/bin/controls/PortfolioEntryPopup'
                ], function (Popup) {
                    new Popup({
                        id: Entry.get('data-id')
                    }).open();
                });
            };

            for (i = 0, len = entries.length; i < len; i++) {
                entries[i].addEvent('click', openEntry);
            }
        }
    });
});
