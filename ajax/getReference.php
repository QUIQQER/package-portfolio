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

        $Control = new QUI\Portfolio\Controls\Reference([
            'Site' => $Site
        ]);

        $imageList = [];
        $images    = $Control->getImages();

        /* @var $Image QUI\Projects\Media\Image */
        foreach ($images as $Image) {
            $imageList[] = [
                'id'           => $Image->getId(),
                'name'         => $Image->getAttribute('name'),
                'title'        => $Image->getAttribute('title'),
                'short'        => $Image->getAttribute('short'),
                'image_height' => $Image->getAttribute('image_height'),
                'image_width'  => $Image->getAttribute('image_width'),
                'url'          => $Image->getUrl(true)
            ];
        }

        $url = false;
        if ($Site->getAttribute('quiqqer.portfolio.settings.website')) {
            $url = $Site->getAttribute('quiqqer.portfolio.settings.website');

            if (strpos($url, 'http://') === false && strpos($url, 'https://') === false) {
                $url = 'http://'.$url;
            }
        }

        return [
            'content' => QUI\Output::getInstance()->parse($Site->getAttribute('content')),
            'url'     => $url,
            'images'  => $imageList
        ];
    },
    ['project', 'siteId']
);
