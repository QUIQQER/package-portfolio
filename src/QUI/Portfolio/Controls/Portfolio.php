<?php

/**
 * This file contains \QUI\Portfolio\Controls\Portfolio
 */

namespace QUI\Portfolio\Controls;

use QUI;

/**
 * Class Portfolio
 * @package QUI\Portfolio\Bricks
 */
class Portfolio extends QUI\Control
{
    /**
     * constructor
     * @param array $attributes
     */
    public function __construct($attributes = array())
    {
        // default options
        $this->setAttributes(array(
            'showRandomButton'           => false,
            'limit'                      => false,
            'entry-effect'               => 'style3',
            'entry-width'                => false,
            'qui-class'                  => 'package/quiqqer/portfolio/bin/controls/Portfolio',
            'data-qui-options-nopopups'  => false,
            'data-qui-options-popuptype' => 'short'
        ));

        $this->addCSSFile(
            dirname(__FILE__).'/Portfolio.css'
        );


        parent::__construct($attributes);


        switch ($this->getAttribute('entry-effect')) {
            case 'style1':
            case 'style2':
            case 'style3':
            case 'style4':
            case 'style5':
            case 'style6':
            case 'style7':
                $effectFile = dirname(__FILE__)
                              .'/Portfolio.'
                              .$this->getAttribute('entry-effect').'.css';

                $this->addCSSClass('quiqqer-portfolio-'.$this->getAttribute('entry-effect'));
                break;

            default:
                $effectFile = dirname(__FILE__).'/Portfolio.style3.css';
                $this->addCSSClass('quiqqer-portfolio-style3');
                break;
        }

        $this->addCSSFile($effectFile);
    }

    /**
     * @return string
     */
    public function getBody()
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $Site   = $this->getSite();
        $limit  = false;

        if ($this->getAttribute('limit')) {
            $limit = (int)$this->getAttribute('limit');
        }

        // getProject()->getSites() muss wegen Brick.
//        $portfolio = $Site->getProject()->getSites(array(
        // @todo in den admin ein site select für die settings einführen
        // dann kann getChildren raus
        $portfolio = $Site->getChildren(array(
            'where' => array(
                'type' => 'quiqqer/portfolio:types/entry'
            ),
            'limit' => $limit
        ));

        $categories = $Site->getAttribute(
            'quiqqer.portfolio.settings.categories'
        );

        foreach ($portfolio as $Child) {
            /* @var $Child QUI\Projects\Site */
            $cats = $Child->getAttribute('quiqqer.portfolio.settings.categories');

            if (is_string($cats)) {
                $cats = json_decode($cats, true);
            }

            if (!$cats || !is_array($cats)) {
                $cats = array();
            }

            $Child->setAttribute('quiqqer.portfolio.settings.categories', $cats);
        }

        switch ($this->getAttribute('entry-width')) {
            case "10%":
                $cssClass = 'quiqqer-portfolio-list-entry-10';
                break;

            case "20%":
                $cssClass = 'quiqqer-portfolio-list-entry-20';
                break;

            case "25%":
                $cssClass = 'quiqqer-portfolio-list-entry-25';
                break;

            case "50%":
                $cssClass = 'quiqqer-portfolio-list-entry-50';
                break;

            case "100%":
                $cssClass = 'quiqqer-portfolio-list-entry-100';
                break;

            default:
            case "33.3333%":
                $cssClass = 'quiqqer-portfolio-list-entry-33';
                break;
        }

        switch ($this->getAttribute('img-position')) {
            case 'cover':
                $imgPosition = 'object-fit: cover; -o-object-fit: cover;';
                break;

            case 'contain':
            default:
                $imgPosition = 'object-fit: contain; -o-object-fit: contain;';
                break;
        }

        $Engine->assign(array(
            'this'        => $this,
            'cssClass'    => $cssClass,
            'portfolio'   => $portfolio,
            'categories'  => json_decode($categories, true),
            'imgPosition' => $imgPosition
        ));


        return $Engine->fetch(dirname(__FILE__).'/Portfolio.html');
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
