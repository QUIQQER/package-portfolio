/**
 * @module package/quiqqer/portfolio/bin/controls/PortfolioEntryPopup
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/windows/Window
 */
define('package/quiqqer/portfolio/bin/controls/PortfolioEntryPopup', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/windows/Popup'

], function (QUI, QUIControl, QUIPopup) {
    "use strict";

    return new Class({

        Extends: QUIPopup,
        Type   : 'package/quiqqer/portfolio/bin/controls/PortfolioEntryPopup',

        Binds : [
            '$onOpen'
        ],

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onOpen : this.$onOpen
            });
        },


        $onOpen : function() {



        }

    });
});