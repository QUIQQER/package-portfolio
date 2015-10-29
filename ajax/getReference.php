<?php

/**
 * Return the portfolio categories
 *
 * @param String $project - JSON project data
 * @param String|Integer $siteId - ID of the current page
 * @return Array
 */
function package_quiqqer_portfolio_ajax_getReference($project, $siteId)
{
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
        'css'      => QUI\Control\Manager::getCSS(),
        'template' => $Control->create(),
        'images'   => $imageList
    );
}

QUI::$Ajax->register(
    'package_quiqqer_portfolio_ajax_getReference',
    array('project', 'siteId')
);
