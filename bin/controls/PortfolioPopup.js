/**
 * Display a portfolio entry
 *
 * @module package/quiqqer/portfolio/bin/controls/PortfolioPopup
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/windows/Window
 */
define('package/quiqqer/portfolio/bin/controls/PortfolioPopup', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Popup',
    'Ajax'

], function (QUI, QUIControl, QUIPopup, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIPopup,
        Type   : 'package/quiqqer/portfolio/bin/controls/PortfolioPopup',

        Binds: [
            '$onOpen'
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

            this.$template = false;
            this.$css      = '';
            this.$images   = [];
            this.$Slider   = null;

            this.addEvents({
                onOpen : this.$onOpen,
                onClose: function () {
                    if (this.$Slider) {
                        this.$Slider.destroy();
                    }
                }.bind(this)
            });
        },

        /**
         * event : on open
         */
        $onOpen: function () {

            var self = this;

            this.refresh().catch(function () {
                self.close();
            });
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

                    Content.setStyles({
                        padding: 0
                    });

                    Content.set('html', self.$template + self.$css);

                    new Element('div', {
                        html  : '<span class="fa fa-remove icon-remove"></span>',
                        styles: {
                            cursor    : 'pointer',
                            fontSize  : 24,
                            height    : 40,
                            lineHeight: 40,
                            position  : 'absolute',
                            textAlign : 'center',
                            top       : 0,
                            right     : 0,
                            width     : 40
                        },
                        events: {
                            click: function () {
                                self.close();
                            }
                        }
                    }).inject(Content);

                    var SliderContainer = Content.getElement(
                        '.quiqqer-porfolio-reference-slider'
                    );


                    if (self.$images.length === 1) {

                        require(['image!' + self.$images[0].url], function (Image) {

                            var ImageElm = new Element('img', {
                                src    : Image.src,
                                'class': 'previewImage',
                                styles : {
                                    opacity : 0,
                                    position: 'relative'
                                }
                            }).inject(SliderContainer);

                            var top = ((SliderContainer.getSize().y - ImageElm.height) / 2).ceil();

                            if (top < 0) {
                                top = 0;
                            }

                            ImageElm.setStyles({
                                top: top
                            });

                            moofx(ImageElm).animate({
                                opacity: 1
                            });

                            //
                            //self.$Elm
                            //    .getElement('.quiqqer-porfolio-reference')
                            //    .setStyle('overflow', 'hidden');
                            //
                            //self.setAttribute('maxHeight', ImageElm.getSize().y);
                            //
                            //self.resize(true, function() {
                            resolve();
                            //});

                        }, reject);

                        return;
                    }

                    require([
                        'package/quiqqer/gallery/bin/controls/Slider'
                    ], function (Slider) {

                        self.$Slider = new Slider({
                            controls: false,
                            zoom    : false,
                            styles  : {
                                height: '100%'
                            }
                        });

                        for (var i = 0, len = self.$images.length; i < len; i++) {
                            self.$Slider.addImage(
                                self.$images[i].url,
                                self.$images[i].title,
                                self.$images[i].short
                            );
                        }

                        self.$Slider.inject(
                            Content.getElement('.quiqqer-porfolio-reference-slider')
                        );

                        if (!self.$images.length) {

                            self.$Slider.Loader.hide();
                            resolve();
                            return;
                        }

                        self.$Slider.next();
                        resolve();

                    }, reject);
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

                if (self.$template) {
                    resolve();
                    return;
                }

                Ajax.get('package_quiqqer_portfolio_ajax_getReference', function (data) {

                    self.$images   = data.images;
                    self.$template = data.template;
                    self.$css      = data.css;

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