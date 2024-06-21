<?php

/**
 * This file contains \QUI\Portfolio\Controls\Reference
 */

namespace QUI\Portfolio\Controls;

use QUI;
use QUI\Exception;

/**
 * Class Reference - A portfolio entry
 *
 * @package QUI\Portfolio\Controls
 */
class Reference extends QUI\Control
{
    /**
     * constructor
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        // default options
        $this->setAttributes([
            'sliderpos' => 'left' // left or bottom
        ]);

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-porfolio-reference');

        $this->addCSSFile(
            dirname(__FILE__) . '/Reference.css'
        );
    }

    /**
     * @return string
     * @throws Exception
     */
    public function getBody(): string
    {
        $Engine = QUI::getTemplateManager()->getEngine();

        $Site = $this->getSite();
        $List = $this->getList();
        $Next = null;
        $Prev = null;
        $images = $this->getImages();

        $sliderExtraClass = 'quiqqer-porfolio-reference__left';

        if ($this->getAttribute('sliderpos') == 'bottom') {
            $sliderExtraClass = 'quiqqer-porfolio-reference__bottom';
        }

        try {
            $Next = $Site->nextSibling();
        } catch (QUI\Exception) {
        }

        try {
            $Prev = $Site->previousSibling();
        } catch (QUI\Exception) {
        }

        $showArrows = false;

        if ($Site->getAttribute('quiqqer.portfolio.settings.slider.showarrows') == 1) {
            $showArrows = 'showHoverScale';
        }

        // slider
        $Slider = new QUI\Bricks\Controls\Slider\PromosliderWallpaper2Content([
            'position' => $List->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-position'),
            'size' => $List->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-size'),
            'shownavigation' => $Site->getAttribute('quiqqer.portfolio.settings.slider.shownavigation') == 1,
            'showarrows' => $showArrows,
            'autostart' => $Site->getAttribute('quiqqer.portfolio.settings.slider.autostart') == 1,
            'delay' => $Site->getAttribute('quiqqer.portfolio.settings.slider.delay')
        ]);

        foreach ($images as $Image) {
            /* @var $Image QUI\Projects\Media\Image */
            $Slider->addSlide($Image->getUrl(), '', '');
            $Slider->addMobileSlide($Image->getUrl(), '', '');
        }

        // website
        $website = false;

        if ($Site->getAttribute('quiqqer.portfolio.settings.website')) {
            $website = $Site->getAttribute('quiqqer.portfolio.settings.website');

            if (!str_contains($website, 'http://') && !str_contains($website, 'https://')) {
                $website = 'http://' . $website;
            }
        }

        $Engine->assign([
            'this' => $this,
            'Site' => $Site,
            'Next' => $Next,
            'Prev' => $Prev,
            'website' => $website,

            'Slider' => $Slider,
            'images' => $this->getImages(),
            'sliderExtraClass' => $sliderExtraClass
        ]);

        return $Engine->fetch(dirname(__FILE__) . '/Reference.html');
    }

    /**
     * Return the images
     *
     * @return array
     * @throws Exception
     */
    public function getImages(): array
    {
        $images = [];
        $imageFolder = $this->getSite()->getAttribute(
            'quiqqer.portfolio.settings.mediaFolder'
        );

        try {
            $siteImage = $this->getSite()->getAttribute('image_site');
            $images[] = QUI\Projects\Media\Utils::getImageByUrl($siteImage);
        } catch (QUI\Exception) {
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
                'Site' => $this->getSite()->__toString()
            ]);
        }

        return $images;
    }

    /**
     * Return current site
     * @return QUI\Interfaces\Projects\Site
     * @throws Exception
     */
    protected function getSite(): QUI\Interfaces\Projects\Site
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
     * @throws Exception
     */
    public function getList(): QUI\Interfaces\Projects\Site
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
