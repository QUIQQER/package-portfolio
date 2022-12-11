<?php

/**
 * This file contains \QUI\Portfolio\Controls\Reference2022
 */

namespace QUI\Portfolio\Controls;

use QUI;

/**
 * Class Reference - A portfolio entry.
 * New reference style.
 *
 * @package QUI\Portfolio\Controls
 */
class Reference2022 extends QUI\Control
{
    /**
     * constructor
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // default options
        $this->setAttributes([
            'sliderpos' => 'left' // left or bottom
        ]);

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-portfolio-reference');

        $this->addCSSFile(
            dirname(__FILE__).'/Reference2022.css'
        );
    }

    /**
     * @return string
     */
    public function getBody()
    {
        try {
            $Engine = QUI::getTemplateManager()->getEngine();
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addDebug($Exception->getMessage());

            return '';
        }

        $Site    = $this->getSite();
        $List    = $this->getList();
        $showNav = false;
        $Next    = null;
        $Prev    = null;
        $Parent  = null;
        $images  = $this->getImages();

        if ($Site->getAttribute('quiqqer.portfolio.entry2022.settings.showNav')) {
            $showNav = true;
        }

        try {
            $Next = $Site->nextSibling();
        } catch (QUI\Exception $Exception) {
        }

        try {
            $Prev = $Site->previousSibling();
        } catch (QUI\Exception $Exception) {
        }

        try {
            $Parent = $Site->getParent();
        } catch (QUI\Exception $Exception) {
        }

        $showArrows = false;

        if ($Site->getAttribute('quiqqer.portfolio.settings.slider.showarrows') == 1) {
            $showArrows = 'showHoverScale';
        }

        // slider
//        $Slider = new QUI\Bricks\Controls\Slider\PromosliderWallpaper2Content([
//            'position'       => $List->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-position'),
//            'size'           => $List->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-size'),
//            'shownavigation' => $Site->getAttribute('quiqqer.portfolio.settings.slider.shownavigation') == 1,
//            'showarrows'     => $showArrows,
//            'autostart'      => $Site->getAttribute('quiqqer.portfolio.settings.slider.autostart') == 1,
//            'delay'          => $Site->getAttribute('quiqqer.portfolio.settings.slider.delay')
//        ]);

        // Gallery
        $Gallery = null;

        if ($Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.enable') &&
            QUI::getPackageManager()->isInstalled('quiqqer/gallery') &&
            class_exists('QUI\Gallery\Bricks\GridAdvanced') &&
            $this->getSite()->getAttribute('quiqqer.portfolio.settings.mediaFolder')) {
            $Gallery = new QUI\Gallery\Bricks\GridAdvanced([
                'max'                => 24,
                'addGap'             => true,
                'showImageTitle'     => false,
                'folderId'           => $Site->getAttribute('quiqqer.portfolio.settings.mediaFolder'),
                'order'              => $Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.order'),
                'scaleImageOnHover'  => $Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.scaleImageOnHover'),
                'darkenImageOnHover' => $Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.darkenImageOnHover'),
                'iconOnHover'        => $Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.iconOnHover'),
                'usePagination'      => false,
                'titleClickable'     => 1, // 1 = open image
                'template'           => $Site->getAttribute('quiqqer.portfolio.entry2022.settings.gallery.template') // template number or name
            ]);
        }

        // website
        $website = false;

        if ($Site->getAttribute('quiqqer.portfolio.settings.website')) {
            $website = $Site->getAttribute('quiqqer.portfolio.settings.website');

            if (strpos($website, 'http://') === false && strpos($website, 'https://') === false) {
                $website = 'http://'.$website;
            }
        }

        $Engine->assign([
            'this'    => $this,
            'Site'    => $Site,
            'showNav' => $showNav,
            'Next'    => $Next,
            'Prev'    => $Prev,
            'Parent'  => $Parent,
            'website' => $website,

            'Gallery' => $Gallery,
            'navHtml' => dirname(__FILE__).'/Reference2022.nav.html',
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Reference2022.html');
    }

    /**
     * Return the images
     *
     * @return array
     */
    public function getImages()
    {
        $images      = [];
        $imageFolder = $this->getSite()->getAttribute(
            'quiqqer.portfolio.settings.mediaFolder'
        );

        try {
            $siteImage = $this->getSite()->getAttribute('image_site');
            $images[]  = QUI\Projects\Media\Utils::getImageByUrl($siteImage);
        } catch (QUI\Exception $Exception) {
        }


        try {
            /* @var $Folder QUI\Projects\Media\Folder */
            $Folder = QUI\Projects\Media\Utils::getMediaItemByUrl($imageFolder);

            if (QUI\Projects\Media\Utils::isFolder($Folder)) {
                $images = $Folder->getImages();
            }
        } catch (QUI\Exception $Exception) {
            QUI\System\Log::addDebug($Exception->getMessage(), [
                'control' => '\QUI\Portfolio\Controls\Reference',
                'Site'    => $this->getSite()->__toString()
            ]);
        }

        return $images;
    }

    /**
     * Return current site
     * @return QUI\Projects\Site
     */
    protected function getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }

    /**
     * Return the portfolio list
     *
     * @return QUI\Projects\Site
     */
    public function getList()
    {
        $Site = $this->getSite();

        if ($Site->getAttribute('type') === 'quiqqer/portfolio:types/list') {
            return $Site;
        }

        $Parent = $Site->getParent();

        if ($Parent->getAttribute('type') === 'quiqqer/portfolio:types/list') {
            return $Parent;
        }

        return $Site->getProject()->firstChild();
    }
}
