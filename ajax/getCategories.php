<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|integer $childId - ID of the current page
 * @return array
 * @throws Exception
 */

use QUI\Exception;

function package_quiqqer_portfolio_ajax_getCategories($project, $childId)
{
    $Project = QUI::getProjectManager()->decode($project);
    $Site = $Project->get($childId);

    $Parent = $Site->getParent();
    $categories = $Parent->getAttribute('quiqqer.portfolio.settings.categories');

    return json_decode($categories, true);
}

QUI::$Ajax->register(
    'package_quiqqer_portfolio_ajax_getCategories',
    ['project', 'childId'],
    'Permission::isAdmin'
);
