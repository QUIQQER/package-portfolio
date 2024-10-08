<?php

/**
 * This file contains \QUI\Portfolio\Controls\Portfolio
 */

namespace QUI\Portfolio\Controls;

use QUI;
use QUI\Exception;
use QUI\Projects\Site\Utils;

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
    public function __construct(array $attributes = [])
    {
        // default options
        $this->setAttributes([
            'showRandomButton' => false,
            'limit' => false,
            'entry-effect' => 'style3',
            'entry-width' => false,
            'qui-class' => 'package/quiqqer/portfolio/bin/controls/Portfolio',
            'data-qui-options-nopopups' => false,
            'data-qui-options-popuptype' => 'short',
            'data-qui-options-useanchor' => false,
            'data-qui-options-lazyloading' => true,
            'data-qui-options-start-reference' => 3,
            'parentInputList' => false, // for example from qui site select
            'order' => 'c_date DESC'
        ]);

        $this->addCSSFile(
            dirname(__FILE__) . '/Portfolio.css'
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
                    . '/Portfolio.'
                    . $this->getAttribute('entry-effect') . '.css';

                $this->addCSSClass('quiqqer-portfolio-' . $this->getAttribute('entry-effect'));
                break;

            default:
                $effectFile = dirname(__FILE__) . '/Portfolio.style3.css';
                $this->addCSSClass('quiqqer-portfolio-style3');
                break;
        }

        $this->addCSSFile($effectFile);
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody(): string
    {
        $Engine = QUI::getTemplateManager()->getEngine();
        $Site = $this->getSite();
        $limit = false;
        $displayNum = 3;

        if ($this->getAttribute('limit')) {
            $limit = (int)$this->getAttribute('limit');
        }

        if ($this->getAttribute('parentInputList')) {
            // for bricks
            $parents = $this->getAttribute('parentInputList');
            $portfolio = Utils::getSitesByInputList($Site->getProject(), $parents, [
                'where' => [
                    'type' => 'quiqqer/portfolio:types/entry'
                ],
                'limit' => $limit,
                'order' => $this->getAttribute('order')
            ]);
        } else {
            // for sites
            $portfolio = $Site->getChildren([
                'where' => [
                    'type' => 'quiqqer/portfolio:types/entry'
                ],
                'limit' => $limit
            ]);
        }

        if (empty($portfolio)) {
            QUI\System\Log::addInfo(
                QUI::getLocale()->get('quiqqer/portfolio', 'admin.portfolio.debug.noTypeFound')
            );

            return '';
        }

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
                $cats = [];
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

        $imgPosition = match ($this->getAttribute('img-position')) {
            'cover' => 'object-fit: cover; -o-object-fit: cover;',
            default => 'object-fit: contain; -o-object-fit: contain;',
        };

        if ($this->getAttribute('data-qui-options-start-reference')) {
            $displayNum = (int)$this->getAttribute('data-qui-options-start-reference');
        }

        if ($this->getAttribute('data-qui-options-lazyloading') === false) {
            $displayNum = false;
        }

        $Engine->assign([
            'this' => $this,
            'cssClass' => $cssClass,
            'portfolio' => $portfolio,
            'categories' => json_decode($categories, true),
            'imgPosition' => $imgPosition,
            'displayNum' => $displayNum,
            'lazyloading' => $this->getAttribute('data-qui-options-lazyloading')
        ]);


        return $Engine->fetch(dirname(__FILE__) . '/Portfolio.html');
    }

    /**
     * Return current site
     *
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
}
