/**
 * @module package/quiqqer/portfolio/bin/controls/reference/Window
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/windows/Confirm
 * @require Ajax
 */
define('package/quiqqer/portfolio/bin/controls/reference/Window', [

    'qui/QUI',
    'qui/controls/windows/Confirm',
    'qui/utils/Elements',
    'Ajax',
    'Locale',

    'css!package/quiqqer/portfolio/bin/controls/reference/Window.css'

], function (QUI, QUIConfirm, QUIElementUtils, QUIAjax, QUILocale) {
    "use strict";

    return new Class({
        Extends: QUIConfirm,
        Type   : 'package/quiqqer/portfolio/bin/controls/reference/Window',

        Binds: [
            '$onOpen',
            '$hideReference',
            '$showReference',
            '$loadReference',
            'next',
            'previous'
        ],

        options: {
            icon     : false,
            title    : false,
            project  : QUIQQER_PROJECT.name,
            lang     : QUIQQER_PROJECT.lang,
            siteId   : false,
            maxHeight: 600,
            maxWidth : 800,

            cancel_button: {
                text     : QUILocale.get('quiqqer/system', 'close'),
                textimage: 'icon-remove fa fa-remove'
            },
            ok_button    : {
                text     : QUILocale.get('quiqqer/portfolio', 'quiqqer.portfolio.visit.website'),
                textimage: 'icon-ok fa fa-globe'
            }
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                icon : false,
                title: false
            });

            this.$Website = false;
            this.$Submit  = null;

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        /**
         * event : on open
         */
        $onOpen: function () {
            this.Loader.show();

            this.setAttribute('maxHeight', QUI.getWindowSize().y - 60);
            this.resize();

            this.Loader.hide();
            this.$Submit = this.getButton('submit');

            this.$loadReference()
                .then(function () {
                    this.getElm().getElement('.quiqqer-porfolio-reference').set('top', 0);
                }.bind(this))
                .then(this.$showReference);
        },

        /**
         * Submit the window
         */
        submit: function () {
            if (this.$Website) {
                QUIElementUtils.simulateEvent(this.$Website, 'click');
            }
        },

        /**
         * Show the next reference
         *
         * @param {Event} [event]
         * @return {Promise}
         */
        next: function (event) {
            if (typeOf(event) === 'domevent') {
                event.stop();
            }

            var Target = event.target;

            if (Target.nodeName !== 'A') {
                Target = Target.getParent('a');
            }

            if (Target.nodeName !== 'A') {
                return Promise.resolve();
            }

            var id = Target.get('data-id');

            this.Loader.show();
            this.setAttribute('siteId', id);

            return this.$hideReference()
                .then(this.$loadReference)
                .then(this.$showReference)
                .then(function () {
                    this.Loader.hide();
                }.bind(this));
        },

        /**
         * Show the previous reference
         *
         * @param {Event} [event]
         */
        previous: function (event) {
            if (typeOf(event) === 'domevent') {
                event.stop();
            }

            var Target = event.target;

            if (Target.nodeName !== 'A') {
                Target = Target.getParent('a');
            }

            if (Target.nodeName !== 'A') {
                return;
            }

            var id = Target.get('data-id');

            this.Loader.show();
            this.setAttribute('siteId', id);

            return this.$hideReference()
                .then(this.$loadReference)
                .then(this.$showReference)
                .then(function () {
                    this.Loader.hide();
                }.bind(this));
        },

        /**
         * Hide the reference container
         *
         * @return {Promise}
         */
        $hideReference: function () {
            var Container = this.getElm().getElement('.quiqqer-porfolio-reference');

            return new Promise(function (resolve) {
                moofx(Container).animate({
                    opacity: 0,
                    top    : -50
                }, {
                    duration: 300,
                    callback: resolve
                });
            });
        },

        /**
         * Hide the reference container
         *
         * @return {Promise}
         */
        $showReference: function () {
            var Container = this.getElm().getElement('.quiqqer-porfolio-reference');

            return new Promise(function (resolve) {
                moofx(Container).animate({
                    opacity: 1,
                    top    : 0
                }, {
                    duration: 300,
                    callback: resolve
                });
            });
        },

        /**
         * Load the reference into the Content
         *
         * @returns {Promise}
         */
        $loadReference: function () {
            var Content = this.getContent();

            Content.set('html', '');
            Content.addClass('qui-portfolio-window-content');

            return new Promise(function (resolve) {

                QUIAjax.get('package_quiqqer_portfolio_ajax_getReferenceControl', function (result) {
                    Content.set('html', result);
                    Content.getElement('.quiqqer-porfolio-reference').setStyles({
                        opacity: 0,
                        top    : -50
                    });

                    QUI.parse(Content).then(function () {
                        this.$Website = Content.getElement(
                            '.quiqqer-porfolio-reference-website-button'
                        );

                        if (!this.$Website) {
                            this.$Submit.hide();
                        } else {
                            this.$Submit.show();
                        }

                        // next / prev
                        var Next = Content.getElements('a.quiqqer-porfolio-reference-data-next');
                        var Prev = Content.getElements('a.quiqqer-porfolio-reference-data-prev');

                        Next.addEvent('click', this.next);
                        Prev.addEvent('click', this.previous);

                        resolve();
                    }.bind(this));

                }.bind(this), {
                    'package': 'quiqqer/portfolio',
                    project  : JSON.encode({
                        name: this.getAttribute('project'),
                        lang: this.getAttribute('lang')
                    }),
                    siteId   : this.getAttribute('siteId')
                });
            }.bind(this));
        }
    });
});