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

    window.Slick.definePseudo('display', function (value) {
        return Element.getStyle(this, 'display') == value;
    });

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/controls/Portfolio',

        Binds: [
            '$onImport',
            'next'
        ],

        options: {
            nopopups         : false,
            popuptype        : 'short',
            useanchor        : false,
            lazyloading      : true,
            'start-reference': 6
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
                this.$entries.set('data-available', 1);
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

                var inResult    = new Elements(),
                    notInResult = new Elements();

                if (this.hasClass('quiqqer-portfolio-categories-all')) {
                    inResult = self.$entries;
                } else {
                    var catId = this.get('text').trim();

                    // found entries
                    inResult = self.$entries.filter(function (Child) {
                        return Child.get('data-categories')
                                    .toString()
                                    .contains(',' + catId + ',');
                    });

                    notInResult = self.$entries.filter(function (Child) {
                        return !Child.get('data-categories')
                                     .toString()
                                     .contains(',' + catId + ',');
                    });
                }

                notInResult.set('data-available', 0);
                inResult.set('data-available', 1);
                var inComplete = inResult;

                if (self.getAttribute('start-reference') &&
                    inResult.length > self.getAttribute('start-reference')) {
                    inResult = new Elements(inResult.slice(0, self.getAttribute('start-reference')));
                }

                self.$hide(notInResult).then(function () {
                    return self.$show(inResult);
                }).then(function () {
                    self.loadEntries(inResult);

                    inComplete.setStyles({
                        height : null,
                        padding: null,
                        width  : null,
                        opacity: null
                    });
                });
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
            } else {
                this.$initEvents();

                if (self.getAttribute('useanchor')) {
                    var anchor = window.location.href.split('#');

                    if (typeof anchor[1] !== 'undefined') {
                        var Child = this.getElm().getElement('[data-id="' + anchor[1] + '"]');

                        if (Child) {
                            Child.click();
                        }
                    }
                }
            }

            for (i = 0, len = this.$entries.length; i < len; i++) {
                if (this.$entries[i].getStyle('display') !== 'none') {
                    self.loadEntry(this.$entries[i]);
                }
            }

            this.getElm().getElements('.quiqqer-portfolio-more')
                .addEvent('click', this.next);
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

                            self.loadEntries(entries);

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
        },

        /**
         * Load entries
         *
         * @param {Array|Elements} list
         */
        loadEntries: function (list) {
            for (var i = 0, len = list.length; i < len; i++) {
                this.loadEntry(list[i]);
            }

            this.$refreshMoreButton();
        },

        /**
         *
         * @param Node
         * @return {Promise}
         */
        loadEntry: function (Node) {
            if (!Node.hasClass('quiqqer-portfolio-list-entry')) {
                return Promise.resolve();
            }

            return new Promise(function (resolve) {
                Node.setStyle('display', null);

                var image    = Node.get('data-image'),
                    position = Node.get('data-position'),
                    Parent   = Node.getElement('figure a');

                var ending = image.substr(image.lastIndexOf('.'));
                var split  = image.substr(0, image.lastIndexOf('.')).split('__')[0];
                var width  = parseInt(Node.getSize().x);

                image = split + '__' + width + ending;

                require(['image!' + image], function () {
                    var Image = new Element('img', {
                        src   : image,
                        styles: {
                            opacity: 0
                        }
                    }).inject(Parent);

                    position = position.trim().split(';');
                    position.each(function (entry) {
                        if (entry === '') {
                            return;
                        }

                        entry = entry.split(':');
                        Image.setStyle(entry[0].trim(), entry[1].trim());
                    });

                    moofx(Image).animate({
                        opacity: 1
                    }, {
                        duration: 200,
                        callback: resolve
                    });
                });
            });
        },

        /**
         * Shows the next portfolio entries
         */
        next: function () {
            var self      = this,
                max       = 6,
                displayed = 0;

            this.$List.setStyles({
                height  : this.$List.getSize().y,
                overflow: 'hidden'
            });

            for (var i = 0, len = this.$entries.length; i < len; i++) {
                if (this.$entries[i].getStyle('display') !== 'none') {
                    continue;
                }

                if (max <= displayed) {
                    break;
                }

                if (parseInt(this.$entries[i].get('data-available')) === 0) {
                    continue;
                }

                this.loadEntry(this.$entries[i]);
                displayed++;
            }

            var height = this.$List.getScrollSize().y;

            this.$refreshMoreButton();

            moofx(this.$List).animate({
                height: height
            }, {
                duration: 200,
                callback: function () {
                    self.$List.setStyles({
                        height  : null,
                        overflow: null
                    });
                }
            });
        },

        /**
         * Look for more button
         */
        $refreshMoreButton: function () {
            var hidden = this.$List.getElements('[data-available="1"]:display(none)'),
                more   = this.getElm().getElements('.quiqqer-portfolio-more');

            if (!hidden.length) {
                more.setStyle('display', 'none');
            } else {
                more.setStyle('display', null);
            }
        },

        /**
         * init the js events for the entries
         */
        $initEvents: function () {
            var self = this;

            var openEntry = function (event) {
                if (typeOf(event) === 'domevent') {
                    event.stop();
                }

                var control;
                var Entry = event.target;

                if (!Entry.hasClass('quiqqer-portfolio-list-entry')) {
                    Entry = Entry.getParent('.quiqqer-portfolio-list-entry');
                }

                var Loader = new Element('div', {
                    html : '<span class="fa fa-spinner fa-spin"></span>',
                    class: 'quiqqer-portfolio-list-entry-loader'
                }).inject(Entry.getElement('figure'));

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
                    if (self.getAttribute('useanchor')) {
                        window.location = '#' + Entry.get('data-id');
                    }

                    new Popup({
                        project: QUIQQER_PROJECT.name,
                        lang   : QUIQQER_PROJECT.lang,
                        siteId : Entry.get('data-id'),
                        events : {
                            onClose: function () {
                                if (self.getAttribute('useanchor') === false) {
                                    return;
                                }

                                if (typeof window.history !== 'undefined') {
                                    history.pushState(
                                        "",
                                        document.title,
                                        window.location.pathname + window.location.search
                                    );

                                    return;
                                }

                                window.location = window.location.href.split('#')[0];
                            }
                        }
                    }).open();

                    Loader.destroy();
                }, function () {
                    Loader.destroy();
                });
            }.bind(this);

            for (var i = 0, len = self.$entries.length; i < len; i++) {
                this.$entries[i].addEvent('click', openEntry);
            }
        },

        /**
         * hide elements
         *
         * @param list
         * @return {*|Promise}
         */
        $hide: function (list) {
            if (!list.length) {
                return Promise.resolve();
            }

            return new Promise(function (resolve) {
                moofx(list).animate({
                    height : 0,
                    opacity: 0,
                    padding: 0,
                    width  : 0
                }, {
                    duration: 250,
                    callback: function () {
                        list.setStyle('display', 'none');
                        resolve();
                    }
                });
            });
        },

        /**
         * show elements
         *
         * @param list
         * @return {*|Promise}
         */
        $show: function (list) {
            if (!list.length) {
                return Promise.resolve();
            }

            var self = this;

            return new Promise(function (resolve) {
                list.setStyle('display', null);

                moofx(list).animate({
                    height : 300,
                    opacity: 1,
                    padding: 10,
                    width  : self.getChildWidth()
                }, {
                    duration: 250,
                    callback: resolve
                });
            });
        }
    });
});
