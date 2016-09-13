/**
 * @module package/quiqqer/portfolio/bin/controls/reference/Window
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/windows/Confirm
 * @require qui/utils/Elements
 * @require Ajax
 * @require Locale
 * @require css!package/quiqqer/portfolio/bin/controls/reference/Window.css
 */
define('package/quiqqer/portfolio/bin/controls/reference/Window', [

    'qui/QUI',
    'qui/controls/windows/Confirm',
    'qui/utils/Elements',
    'Ajax',

    'css!package/quiqqer/portfolio/bin/controls/reference/Window.css'

], function (QUI, QUIConfirm, QUIElementUtils, QUIAjax) {
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
            buttons  : false
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                icon : false,
                title: false
            });

            this.$Website = false;
            this.$Slider  = null;

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        /**
         * event : on open
         */
        $onOpen: function () {
            this.Loader.show();

            var winSize = QUI.getWindowSize();

            this.setAttribute('maxHeight', winSize.y);
            this.setAttribute('maxWidth', '100%');

            this.getElm().addClass('qui-portfolio-window');
            this.resize();

            this.$loadReference()
                .then(function () {
                    this.getElm().getElements('.quiqqer-porfolio-reference').set('top', 0);
                }.bind(this))
                .then(this.$showReference)
                .then(function () {
                    this.Loader.hide();
                }.bind(this));
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

            var Container = new Element('div', {
                'class': 'qui-portfolio-window-content-container page-multible-content'
            }).inject(Content);

            return new Promise(function (resolve) {

                QUIAjax.get('package_quiqqer_portfolio_ajax_getReferenceControl', function (result) {
                    Container.set('html', result);
                    Container.getElement('.quiqqer-porfolio-reference').setStyles({
                        opacity: 0,
                        top    : -50
                    });

                    new Element('div', {
                        'class': 'quiqqer-porfolio-reference-close',
                        html   : '<span class="fa fa-remove"></span>',
                        events : {
                            click: this.close.bind(this)
                        }
                    }).inject(Content);

                    QUI.parse(Content).then(function () {
                        this.$Website = Content.getElement(
                            '.quiqqer-porfolio-reference-website-button'
                        );

                        var SliderNode = Content.getElement(
                            '[data-qui="package/quiqqer/bricks/bin/Controls/Slider/PromosliderWallpaper"]'
                        );

                        this.$Slider = QUI.Controls.getById(SliderNode.get('data-quiid'));
                        this.$Slider.setAttribute(
                            'height',
                            Math.round(QUI.getWindowSize().y / 2)
                        );

                        if (!this.$Slider.getSlides().length) {
                            this.$Slider.getElm().setStyle('display', 'none');
                        }

                        // next / prev
                        var Next = Content.getElements('a.quiqqer-porfolio-reference-data-next');
                        var Prev = Content.getElements('a.quiqqer-porfolio-reference-data-prev');

                        Next.addEvent('click', this.next);
                        Prev.addEvent('click', this.previous);

                        return this.$Slider.onResize();

                    }.bind(this)).then(resolve);

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