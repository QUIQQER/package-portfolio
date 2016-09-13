<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getImageSliderNext',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site    = $Project->get($siteId);

        try {
            $Sibling = $Site->nextSibling();
        } catch (QUI\Exception $Exception) {
            $Parent  = $Site->getParent();
            $Sibling = $Parent->firstChild();
        }

        require_once 'getImageSlider.php';

        $result = QUI::$Ajax->callRequestFunction('package_quiqqer_portfolio_ajax_getImageSlider', array(
            'project' => json_encode($Project->toArray()),
            'siteId'  => $Sibling->getId()
        ));

        return $result['result'];
    },
    array('project', 'siteId')
);
