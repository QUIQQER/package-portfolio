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
     *
     * @return string
     */
    public function getBody()
    {
        $Project = QUI::getRewrite()->getProject();

        $Portfolio = new QUI\Portfolio\Controls\Portfolio(array(
//            'Site'  => $Project->get(43),
            'limit' => 3
        ));


        return $Portfolio->create();
    }
}
