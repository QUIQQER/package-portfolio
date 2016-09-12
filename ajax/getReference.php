<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getReference',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site    = $Project->get($siteId);

        $Control = new QUI\Portfolio\Controls\Reference(array(
            'Site' => $Site
        ));

        $imageList = array();
        $images    = $Control->getImages();

        /* @var $Image QUI\Projects\Media\Image */
        foreach ($images as $Image) {
            $imageList[] = array(
                'id'           => $Image->getId(),
                'name'         => $Image->getAttribute('name'),
                'title'        => $Image->getAttribute('title'),
                'short'        => $Image->getAttribute('short'),
                'image_height' => $Image->getAttribute('image_height'),
                'image_width'  => $Image->getAttribute('image_width'),
                'url'          => $Image->getUrl(true)
            );
        }

        return array(
            'content' => $Site->getAttribute('content'),
            'images'  => $imageList
        );
    },
    array('project', 'siteId')
);
