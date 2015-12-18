<?php

/**
 * This file contains \QUI\Portfolio\Controls\Reference
 */
namespace QUI\Portfolio\Controls;

use QUI;

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
    public function __construct($attributes = array())
    {
        // default options
        $this->setAttributes(array(
            'sliderpos' => 'left' // left or bottom
        ));

        parent::__construct($attributes);

        $this->addCSSClass('quiqqer-porfolio-reference');

        $this->addCSSFile(
            dirname(__FILE__) . '/Reference.css'
        );
    }

    /**
     * @return string
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $Site   = $this->getSite();

        $sliderExtraClass = 'quiqqer-porfolio-reference__left';

        if ($this->getAttribute('sliderpos') == 'bottom') {
            $sliderExtraClass = 'quiqqer-porfolio-reference__bottom';
        }

        $Engine->assign(array(
            'this' => $this,
            'Site' => $Site,
            'images' => $this->getImages(),
            'sliderExtraClass' => $sliderExtraClass
        ));

        return $Engine->fetch(dirname(__FILE__) . '/Reference.html');
    }

    /**
     * Return the images
     *
     * @return array
     */
    public function getImages()
    {
        $images      = array();
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
            QUI\System\Log::addDebug($Exception->getMessage(), array(
                'control' => '\QUI\Portfolio\Controls\Reference',
                'Site' => $this->getSite()->__toString()
            ));
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
}
