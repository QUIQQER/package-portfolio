<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getImageSlider',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site    = $Project->get($siteId);
        $image   = '';

        try {
            $emotion = $Site->getAttribute('image_site');
            $Image   = \QUI\Projects\Media\Utils::getImageByUrl($emotion);
            $image   = $Image->getUrl(true);
        } catch (QUI\Exception $Exception) {
            $Placeholder = $Project->getMedia()->getPlaceholderImage();

            if ($Placeholder) {
                $image = $Placeholder->getUrl(true);
            }
        }

        return array(
            'id'    => $Site->getId(),
            'image' => $image,
            'short' => $Site->getAttribute('short'),
            'title' => $Site->getAttribute('title')
        );
    },
    array('project', 'siteId')
);
