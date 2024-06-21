<?php

/**
 * This file contains \QUI\Portfolio\PortfolioList
 */

namespace QUI\Portfolio;

use QUI;
use QUI\Projects\Site\Edit;

/**
 * Class PortfolioList
 *
 * @package QUI\Portfolio
 * @author www.pcsg.de (Henning Leutz)
 */
class PortfolioList
{
    /**
     * event on child create
     *
     * @param integer $newId
     * @param QUI\Interfaces\Projects\Site $Parent
     * @throws QUI\Exception
     */
    public static function onChildCreate(int $newId, QUI\Interfaces\Projects\Site $Parent): void
    {
        if ($Parent->getAttribute('type') !== 'quiqqer/portfolio:types/list') {
            return;
        }

        $Project = $Parent->getProject();
        $Site = new Edit($Project, $newId);

        $Site->setAttribute('release_from', date('Y-m-d H:i:s'));
        $Site->setAttribute('type', 'quiqqer/portfolio:types/entry');
        $Site->setAttribute('nav_hide', 1);
        $Site->save();
    }
}
