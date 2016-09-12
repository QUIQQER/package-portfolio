/**
 * @module package/quiqqer/portfolio/bin/controls/reference/WindowNextPrev
 *
 * @require qui/QUI
 * @require qui/controls/windows/Popup
 */
define('package/quiqqer/portfolio/bin/controls/reference/WindowNextPrev', [

    'qui/QUI',
    'package/quiqqer/portfolio/bin/controls/reference/Window',
    'Ajax',

    'css!package/quiqqer/portfolio/bin/controls/reference/WindowNextPrev.css'

], function (QUI, ReferencePopup, QUIAjax) {
    "use strict";

    return new Class({
        Extends: ReferencePopup,
        Type   : 'package/quiqqer/portfolio/bin/controls/reference/WindowNextPrev',

        Binds: [
            '$onOpen',
            '$loadReference'
        ],

        options: {
            icon   : false,
            title  : false,
            buttons: false,
            project: QUIQQER_PROJECT.name,
            lang   : QUIQQER_PROJECT.lang,
            siteId : false
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        /**
         * Event : on open
         */
        $onOpen: function () {
            this.Loader.show();

            this.setAttribute('maxHeight', '100%');
            this.setAttribute('maxWidth', '100%');

            this.getElm().addClass('qui-portfolio-windowNextPrev');
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
         * Load the reference into the Content
         *
         * @returns {Promise}
         */
        $loadReference: function () {
            var Content = this.getContent();

            Content.set('html', '');
            Content.addClass('qui-portfolio-windowNextPrev-content');

            var Container = new Element('div', {
                'class': 'qui-portfolio-windowNextPrev-container page-multible-content'
            }).inject(Content);

            return new Promise(function (resolve) {

                QUIAjax.get('package_quiqqer_portfolio_ajax_getReferenceControl', function (result) {
                    Container.set('html', result);
                    Container.getElement('.quiqqer-porfolio-reference').setStyles({
                        opacity: 0,
                        top    : -50
                    });

                    new Element('div', {
                        'class': 'qui-portfolio-windowNextPrev-close',
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
