/**
 *
 */
define('package/quiqqer/portfolio/bin/controls/reference/Image', [

    'qui/QUI',
    'qui/controls/windows/Popup',
    'Ajax',
    'Locale',
    URL_OPT_DIR + 'bin/mustache/mustache.min.js',

    'text!package/quiqqer/portfolio/bin/controls/reference/Image.html',
    'css!package/quiqqer/portfolio/bin/controls/reference/Image.css'

], function (QUI, QUIPopup, QUIAjax, QUILocale, Mustache, template) {
    "use strict";

    return new Class({

        Extends: QUIPopup,
        Type   : 'package/quiqqer/portfolio/bin/controls/reference/Image',

        Binds: [
            '$onOpen',
            '$hideContent',
            '$showContent'
        ],

        options: {
            icon     : false,
            title    : false,
            project  : QUIQQER_PROJECT.name,
            lang     : QUIQQER_PROJECT.lang,
            siteId   : false,
            maxHeight: 600,
            maxWidth : 1200,
            buttons  : false
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                icon : false,
                title: false
            });

            this.$Container = null;

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        /**
         * Return the domnode element
         *
         * @returns {HTMLDivElement}
         */
        create: function () {
            var Elm = this.parent();

            Elm.addClass('qui-portfolio-image');

            this.Background.setAttribute('opacity', 0.85);
            this.Background.show();

            this.Loader.getElm().setStyle('background', 'transparent');

            this.$Container = new Element('div', {
                'class': 'qui-portfolio-image-content'
            }).inject(this.getContent());

            return Elm;
        },

        /**
         * event : on open
         */
        $onOpen: function () {
            this.Loader.show();
            this.resize();

            QUIAjax.get('package_quiqqer_portfolio_ajax_getImageSlider', function (result) {
                this.$render(result);
                this.Loader.hide();
            }.bind(this), {
                'package': 'quiqqer/portfolio',
                project  : JSON.encode({
                    name: this.getAttribute('project'),
                    lang: this.getAttribute('lang')
                }),
                siteId   : this.getAttribute('siteId')
            });
        },

        /**
         * Load he next reference
         */
        next: function () {
            this.Loader.show();
            this.resize();

            QUIAjax.get('package_quiqqer_portfolio_ajax_getImageSliderNext', function (result) {
                this.setAttribute('siteId', result.id);

                this.$render(result).then(function () {
                    this.Loader.hide();
                }.bind(this));

            }.bind(this), {
                'package': 'quiqqer/portfolio',
                project  : JSON.encode({
                    name: this.getAttribute('project'),
                    lang: this.getAttribute('lang')
                }),
                siteId   : this.getAttribute('siteId')
            });
        },

        /**
         * Load the previous reference
         */
        previous: function () {
            this.Loader.show();
            this.resize();

            QUIAjax.get('package_quiqqer_portfolio_ajax_getImageSliderPrev', function (result) {
                this.setAttribute('siteId', result.id);

                this.$render(result).then(function () {
                    this.Loader.hide();
                }.bind(this));

            }.bind(this), {
                'package': 'quiqqer/portfolio',
                project  : JSON.encode({
                    name: this.getAttribute('project'),
                    lang: this.getAttribute('lang')
                }),
                siteId   : this.getAttribute('siteId')
            });
        },

        /**
         * Render data
         *
         * @param {Object} result
         * @return {Promise}
         */
        $render: function (result) {
            return this.$hideContent()
                .then(function () {
                    return this.$loadImage(result.image);
                }.bind(this))
                .then(function () {
                    this.$Container.set({
                        html: Mustache.render(template, {
                            image: result.image,
                            title: result.title,
                            short: result.short
                        })
                    });

                    var RatioContainer = this.$Container.getElement(
                        '.qui-portfolio-image-container'
                    );

                    new Element('div', {
                        html   : '<span class="fa fa-times-thin"></span>',
                        'class': 'qui-portfolio-image-close',
                        events : {
                            click: this.close.bind(this)
                        }
                    }).inject(RatioContainer);


                    new Element('div', {
                        html   : '<span class="fa fa-angle-left"></span>',
                        'class': 'qui-portfolio-image-prev',
                        events : {
                            click: this.previous.bind(this)
                        }
                    }).inject(RatioContainer);


                    new Element('div', {
                        html   : '<span class="fa fa-angle-right"></span>',
                        'class': 'qui-portfolio-image-next',
                        events : {
                            click: this.next.bind(this)
                        }
                    }).inject(RatioContainer);

                    // create button (url)
                    if (result.url) {
                        var ButtonContainer = new Element('div', {
                            'class': 'content-button-container'
                        }).inject(this.$Container);

                        new Element('a', {
                            'class': 'button button--callToAction quiqqer-porfolio-reference-website-button',
                            target : '_blank',
                            href   : result.url,
                            html   : QUILocale.get('quiqqer/portfolio', 'quiqqer.portfolio.visit.website')
                        }).inject(ButtonContainer);
                    }

                }.bind(this))
                .then(this.$showContent.bind(this));
        },

        /**
         * hide the content
         *
         * @returns {Promise}
         */
        $hideContent: function () {
            return new Promise(function (resolve) {
                moofx(this.$Container).animate({
                    opacity: 0
                }, {
                    duration: 200,
                    callback: resolve
                });
            }.bind(this));
        },

        /**
         * hide the content
         *
         * @returns {Promise}
         */
        $showContent: function () {
            return new Promise(function (resolve) {
                moofx(this.$Container).animate({
                    opacity: 1
                }, {
                    duration: 200,
                    callback: resolve
                });
            }.bind(this));
        },

        /**
         * Load the image
         *
         * @param {String} image
         * @returns {Promise}
         */
        $loadImage: function (image) {
            if (!image || image === '') {
                return Promise.resolve();
            }

            return new Promise(function (resolve) {
                require(['image!' + image], resolve, resolve);
            });
        }
    });
});