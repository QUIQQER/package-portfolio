<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getReferenceControl',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site    = $Project->get($siteId);

        $Control = new QUI\Portfolio\Controls\Reference([
            'Site' => $Site
        ]);

        $create = $Control->create();

        return QUI\Control\Manager::getCSS().$create;
    },
    ['project', 'siteId']
);
