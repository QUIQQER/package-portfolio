/**
 * Display a portfolio entry in a window
 *
 * @module package/quiqqer/portfolio/bin/controls/PortfolioPopup
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/windows/Window
 * @require Ajax
 */
define('package/quiqqer/portfolio/bin/controls/reference/WindowShort', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Popup',
    'Ajax',

    'css!package/quiqqer/portfolio/bin/controls/reference/WindowShort.css'

], function (QUI, QUIControl, QUIPopup, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIPopup,
        Type   : 'package/quiqqer/portfolio/bin/controls/reference/WindowShort',

        Binds: [
            '$onOpen',
            '$onResize'
        ],

        options: {
            siteId : false,
            project: false,
            lang   : false,
            buttons: false
        },

        initialize: function (options) {
            this.setAttributes({
                maxHeight: 600,
                maxWidth : 1200
            });

            this.parent(options);

            this.$Slider = null;

            this.$content = false;
            this.$slider  = '';
            this.$images  = [];
            this.$mobile  = false;

            this.addEvents({
                onOpen  : this.$onOpen,
                onClose : function () {
                    if (this.$Slider) {
                        this.$Slider.destroy();
                    }
                }.bind(this),
                onResize: this.$onResize
            });
        },

        /**
         * event : on open
         */
        $onOpen: function () {
            var self = this;

            this.refresh().catch(function (err) {
                console.error(err);
                self.close();
            });
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            if (!this.$images.length) {
                return;
            }

            var winSize = QUI.getWindowSize();

            if (this.$Slider) {
                this.$Slider.resize();
            }

            if (winSize.x < 767 && this.$mobile === false) {
                this.$mobile = true;
                return;
            }

            if (winSize.x >= 767 && this.$mobile === true) {
                this.$mobile = false;
            }
        },

        /**
         * Refresh the data
         *
         * @returns {Promise}
         */
        refresh: function () {
            var self = this;

            this.Loader.show();

            return new Promise(function (resolve, reject) {
                self.$draw().then(function () {
                    self.Loader.hide();
                    resolve();
                }).catch(reject);
            });
        },

        /**
         * internal draw data
         *
         * @return {Promise}
         */
        $draw: function () {
            var self = this;

            return new Promise(function (resolve, reject) {

                self.$getData().then(function () {

                    var Content = self.getContent();

                    Content.set({
                        'class': 'quiqqer-porfolio-reference-windowShort',
                        html   : '<div class="slider"></div>' +
                                 '<div class="content"></div>',
                        styles : {
                            padding: 0
                        }
                    });

                    new Element('div', {
                        html   : '<span class="fa fa-remove"></span>',
                        'class': 'quiqqer-porfolio-reference-windowShort-close',
                        events : {
                            click: function () {
                                self.close();
                            }
                        }
                    }).inject(Content);

                    var SliderContainer  = Content.getElement('.slider'),
                        ContentContainer = Content.getElement('.content');

                    ContentContainer.set('html', self.$content);
                    SliderContainer.set('html', self.$slider);

                    QUI.parse(SliderContainer).then(function () {
                        var height = Content.getSize().y,
                            Slider = QUI.Controls.getById(
                                Content.getElement(
                                    '.quiqqer-bricks-promoslider-wallpaper'
                                ).get('data-quiid')
                            );

                        if (!Slider.getSlides().length) {
                            Slider.destroy();
                            SliderContainer.destroy();
                            ContentContainer.setStyle('width', '100%');
                            return;
                        }

                        Slider.setAttribute('height', height);
                        Slider.onResize();
                    }).then(resolve).catch(reject);
                });
            });
        },

        /**
         * Get the data
         * @returns {Promise}
         */
        $getData: function () {
            var self = this;

            return new Promise(function (resolve, reject) {

                if (self.$content) {
                    resolve();
                    return;
                }

                Ajax.get([
                    'package_quiqqer_portfolio_ajax_getReference',
                    'package_quiqqer_portfolio_ajax_getWallpaperSlider'
                ], function (data, slider) {
                    self.$images  = data.images;
                    self.$content = data.content;
                    self.$slider  = slider.css + slider.html;

                    resolve();
                }, {
                    'package': 'quiqqer/portfolio',
                    project  : JSON.encode({
                        name: self.getAttribute('project'),
                        lang: self.getAttribute('lang')
                    }),
                    siteId   : self.getAttribute('siteId'),
                    onError  : function () {
                        reject();
                    }
                });
            });
        }
    });
});