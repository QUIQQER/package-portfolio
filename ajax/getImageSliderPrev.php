<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */

QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getImageSliderPrev',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site = $Project->get($siteId);

        try {
            $Sibling = $Site->previousSibling();
        } catch (QUI\Exception $Exception) {
            $Parent = $Site->getParent();
            $Sibling = $Parent->lastChild();
        }

        require_once 'getImageSlider.php';

        $result = QUI::$Ajax->callRequestFunction('package_quiqqer_portfolio_ajax_getImageSlider', [
            'project' => json_encode($Project->toArray()),
            'siteId' => $Sibling->getId()
        ]);

        return $result['result'];
    },
    ['project', 'siteId']
);
