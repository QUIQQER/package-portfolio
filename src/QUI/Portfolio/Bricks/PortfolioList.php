<?php

/**
 * This file contains QUI\Portfolio\Bricks\PortfolioList
 */

namespace QUI\Portfolio\Bricks;

use QUI;

/**
 * Class Portfolio
 * @package QUI\Portfolio\Bricks
 */
class PortfolioList extends QUI\Control
{
    /**
     * @return string
     */
    public function getBody()
    {
        $Portfolio = new QUI\Portfolio\Controls\Portfolio([
            'showRandomButton'                 => $this->getAttribute('showRandomButton'),
            'limit'                            => false,
            'entry-effect'                     => $this->getAttribute('portfolioEffect'),
            'entry-width'                      => $this->getAttribute('portfolioEntryWidth'),
            'qui-class'                        => 'package/quiqqer/portfolio/bin/controls/Portfolio',
            'data-qui-options-nopopups'        => $this->getAttribute('portfolioNoPopup'),
            'data-qui-options-popuptype'       => $this->getAttribute('popupType'),
            'data-qui-options-start-reference' => $this->getAttribute('referenceStartNumber'),
            'parentInputList'                  => $this->getAttribute('site'),
            'img-position'                     => $this->getAttribute('imgPosition'),
            'order'                            => $this->getAttribute('order')
        ]);

        foreach ($Portfolio->getCSSFiles() as $file) {
            $this->addCSSFile($file);
        }

        return $Portfolio->create();
    }
}
