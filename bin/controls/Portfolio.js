/**
 * Control for the porfolio list
 *
 * @module package/quiqqer/portfolio/bin/controls/Portfolio
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 */
define('package/quiqqer/portfolio/bin/controls/Portfolio', [

    'qui/QUI',
    'qui/controls/Control'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/controls/Portfolio',

        Binds: [
            '$onImport'
        ],

        options: {
            nopopups : false,
            popuptype: 'short'
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * events : on import
         */
        $onImport: function () {

            var i, len;

            var categories = document.getElements(
                '.quiqqer-portfolio-categories-entry'
            );

            var entries = document.getElements(
                '.quiqqer-portfolio-list-entry'
            );

            // categories
            var openCategory = function () {

                if (this.hasClass('quiqqer-portfolio-category__active')) {
                    return;
                }

                var childWidth = entries[0].getSize().x;

                if (!childWidth) {
                    entries[0].setStyles({
                        position: 'absolute',
                        width   : null
                    });

                    childWidth = entries[0].getSize().x;

                    entries[0].setStyles({
                        position: null,
                        width   : 0
                    });
                }

                categories.removeClass('quiqqer-portfolio-category__active');

                this.addClass('quiqqer-portfolio-category__active');

                if (this.hasClass('quiqqer-portfolio-categories-all')) {
                    moofx(entries).animate({
                        height : 300,
                        opacity: 1,
                        padding: 10,
                        width  : childWidth
                    }, {
                        duration: 250,
                        callback: function () {
                            entries.setStyle('width', null);
                        }
                    });

                    return;
                }

                var catId = this.get('text').trim();

                // found entries
                var inResult = entries.filter(function (Child) {
                    return Child.get('data-categories')
                        .toString()
                        .contains(',' + catId + ',');
                });

                var notInResult = entries.filter(function (Child) {
                    return !Child.get('data-categories')
                        .toString()
                        .contains(',' + catId + ',');
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
                        width  : childWidth
                    }, {
                        duration: 250,
                        callback: function () {
                            inResult.setStyle('width', null);
                        }
                    });
                }
            };

            for (i = 0, len = categories.length; i < len; i++) {
                categories[i].addEvent('click', openCategory);
            }


            // entries
            if (this.getAttribute('nopopups')) {
                this.getElm().getElements('figure').setStyle('cursor', 'default');
                return;
            }

            var openEntry = function (event) {
                event.stop();

                var control;
                var Entry = event.target;

                if (!Entry.hasClass('quiqqer-portfolio-list-entry')) {
                    Entry = Entry.getParent('.quiqqer-portfolio-list-entry');
                }

                switch (this.getAttribute('popuptype')) {
                    default:
                    case'short':
                        control = 'package/quiqqer/portfolio/bin/controls/reference/WindowShort';
                        break;

                    case 'reference':
                        control = 'package/quiqqer/portfolio/bin/controls/reference/Window';
                        break;

                    case 'referenceNextPrev':
                        control = 'package/quiqqer/portfolio/bin/controls/reference/WindowNextPrev';
                        break;

                    case 'image':
                        control = 'package/quiqqer/portfolio/bin/controls/reference/Image';
                        break;
                }

                require([control], function (Popup) {
                    new Popup({
                        project: QUIQQER_PROJECT.name,
                        lang   : QUIQQER_PROJECT.lang,
                        siteId : Entry.get('data-id')
                    }).open();
                });
            }.bind(this);

            for (i = 0, len = entries.length; i < len; i++) {
                entries[i].addEvent('click', openEntry);
            }
        }
    });
});
