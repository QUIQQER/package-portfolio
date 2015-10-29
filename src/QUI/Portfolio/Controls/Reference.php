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
        $this->setAttributes(array());

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
        $Site   = $this->_getSite();

        $Engine->assign(array(
            'Site'   => $Site,
            'images' => $this->getImages()
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
        $imageFolder = $this->_getSite()->getAttribute(
            'quiqqer.portfolio.settings.mediaFolder'
        );

        try {
            $siteImage = $this->_getSite()->getAttribute('image_site');
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
                'Site'    => $this->_getSite()->__toString()
            ));
        }

        return $images;
    }

    /**
     * Return current site
     * @return QUI\Projects\Site
     */
    protected function _getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }
}
