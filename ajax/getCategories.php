<?php

/**
 * Return the portfolio categories
 *
 * @param String $project - JSON project data
 * @param String|Integer $childId - ID of the current page
 * @return Array
 */
function package_quiqqer_portfolio_ajax_getCategories($project, $childId)
{
    $Project = QUI::getProjectManager()->decode($project);
    $Site    = $Project->get($childId);

    $Parent     = $Site->getParent();
    $categories = $Parent->getAttribute('quiqqer.portfolio.settings.categories');

    return json_decode($categories, true);
}

QUI::$Ajax->register(
    'package_quiqqer_portfolio_ajax_getCategories',
    array('project', 'childId'),
    'Permission::isAdmin'
);
