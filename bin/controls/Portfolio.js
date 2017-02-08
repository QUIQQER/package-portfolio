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

            this.$List       = null;
            this.$Categories = null;

            this.$entries    = new Elements();
            this.$categories = new Elements();
            this.$randomize  = false;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        /**
         * events : on import
         */
        $onImport: function () {

            var i, len;
            var self = this;

            this.$Categories = this.getElm().getElement('.quiqqer-portfolio-categories');
            this.$List       = this.getElm().getElement('.quiqqer-portfolio-list');

            if (this.$Categories) {
                this.$categories = this.$Categories.getElements('.quiqqer-portfolio-categories-entry');
            }

            if (this.$List) {
                this.$entries = this.$List.getElements('.quiqqer-portfolio-list-entry');
            }

            for (i = 0, len = this.$entries.length; i < len; i++) {
                this.$entries[i].set('data-no', i);
            }

            // categories
            var openCategory = function () {
                self.$categories.removeClass('quiqqer-portfolio-category__active');

                // randomize
                if (this.hasClass('quiqqer-portfolio-categories-random')) {
                    self.randomize();
                    return;
                }

                if (self.$randomize) {
                    self.normalize().then(openCategory.bind(this));
                    return;
                }

                if (this.hasClass('quiqqer-portfolio-category__active')) {
                    return;
                }

                this.addClass('quiqqer-portfolio-category__active');

                var childWidth = self.getChildWidth();

                if (this.hasClass('quiqqer-portfolio-categories-all')) {
                    moofx(self.$entries).animate({
                        height : 300,
                        opacity: 1,
                        padding: 10,
                        width  : childWidth
                    }, {
                        duration: 250,
                        callback: function () {
                            self.$entries.setStyle('width', null);
                        }
                    });

                    return;
                }

                var catId = this.get('text').trim();

                // found entries
                var inResult = self.$entries.filter(function (Child) {
                    return Child.get('data-categories')
                        .toString()
                        .contains(',' + catId + ',');
                });

                var notInResult = self.$entries.filter(function (Child) {
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

            for (i = 0, len = self.$categories.length; i < len; i++) {
                self.$categories[i].addEvent('click', openCategory);
            }

            if (this.$Categories &&
                this.$Categories.getElement('.quiqqer-portfolio-categories-random')) {
                this.randomize();
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

            for (i = 0, len = self.$entries.length; i < len; i++) {
                self.$entries[i].addEvent('click', openEntry);
            }
        },

        /**
         * Randomize
         */
        randomize: function () {
            this.$randomize = true;

            var self    = this;
            var entries = self.$entries.map(function (Entry) {
                return Entry;
            });

            entries.shuffle();

            self.$List.setStyle('height', self.$List.getSize().y);

            moofx(entries).animate({
                height : 0,
                opacity: 0,
                padding: 0,
                width  : 0
            }, {
                duration: 250,
                callback: function () {
                    entries.shuffle();

                    for (var i = 0, len = entries.length; i < len; i++) {
                        entries[i].inject(self.$List);
                    }

                    moofx(entries).animate({
                        height : 300,
                        opacity: 1,
                        padding: 10,
                        width  : self.getChildWidth()
                    }, {
                        duration: 250,
                        callback: function () {
                            entries.each(function (Entry) {
                                Entry.setStyle('width', null);
                            });

                            self.$List.setStyle('height', null);
                        }
                    });
                }
            });
        },

        /**
         * Normalize the portfolio
         *
         * @returns {Promise}
         */
        normalize: function () {
            var self = this;

            return new Promise(function (resolve) {
                var entries = self.$List.getElements(
                    '.quiqqer-portfolio-list-entry'
                ).sort(function (A, B) {
                    var aNo = A.get('data-no');
                    var bNo = B.get('data-no');

                    if (aNo > bNo) {
                        return 1;
                    }

                    if (aNo < bNo) {
                        return -1;
                    }

                    return 0;
                });

                moofx(entries).animate({
                    height : 0,
                    opacity: 0,
                    padding: 0,
                    width  : 0
                }, {
                    duration: 250,
                    callback: function () {
                        for (var i = 0, len = entries.length; i < len; i++) {
                            entries[i].inject(self.$List);
                        }

                        entries.each(function (Entry) {
                            Entry.setStyle('width', null);
                        });

                        self.$randomize = false;
                        resolve();
                    }
                });
            });
        },

        /**
         * Return the child width
         *
         * @returns {Number}
         */
        getChildWidth: function () {
            var childWidth = this.$entries[0].getSize().x;

            if (!childWidth) {
                this.$entries[0].setStyles({
                    position: 'absolute',
                    width   : null
                });

                childWidth = this.$entries[0].getSize().x;

                this.$entries[0].setStyles({
                    position: null,
                    width   : 0
                });
            }

            return childWidth;
        }
    });
});
