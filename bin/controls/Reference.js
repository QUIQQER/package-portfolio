/**
 * Control for the porfolio reference entry
 *
 * @module package/quiqqer/portfolio/bin/controls/Reference
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require Ajax
 */
define('package/quiqqer/portfolio/bin/controls/Reference', [

    'qui/QUI',
    'qui/controls/Control',
    'Ajax'

], function (QUI, QUIControl, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/portfolio/bin/controls/Reference',

        Binds: [
            '$onImport'
        ],

        options: {
            project: false,
            lang   : false,
            siteId : false
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
            var siteId  = this.getElm().get('data-siteid'),
                project = this.getElm().get('data-project'),
                lang    = this.getElm().get('data-lang');

            this.setAttribute('siteId', siteId);
            this.setAttribute('project', project);
            this.setAttribute('lang', lang);

            this.$draw();
        },

        /**
         * internal draw data
         *
         * @return {Promise}
         */
        $draw: function () {
            return;
            var self = this;

            return new Promise(function (resolve, reject) {

                self.$getData().then(function () {


                    var SliderContainer = self.getElm().getElement(
                        '.quiqqer-porfolio-reference-slider'
                    );


                    if (self.$images.length === 1) {

                        require(['image!' + self.$images[0].url], function (Image) {

                            SliderContainer.setStyles({
                                backgroundImage: 'url("' + Image.src + '")'
                            });

                            resolve();

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
                                height: 400
                            }
                        });

                        for (var i = 0, len = self.$images.length; i < len; i++) {
                            self.$Slider.addImage(
                                self.$images[i].url,
                                self.$images[i].title,
                                self.$images[i].short
                            );
                        }

                        self.$Slider.inject(SliderContainer);

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

                    self.$images = data.images;

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
