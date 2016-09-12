<?php

/**
 * Return the portfolio categories
 *
 * @param string $project - JSON project data
 * @param string|Integer $siteId - ID of the current page
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_portfolio_ajax_getWallpaperSlider',
    function ($project, $siteId) {
        $Project = QUI::getProjectManager()->decode($project);
        $Site    = $Project->get($siteId);

        $Control = new QUI\Portfolio\Controls\Reference(array(
            'Site' => $Site
        ));

        $Slider = new QUI\Bricks\Controls\Slider\PromosliderWallpaper2Content(array(
            'pagefit'  => false,
            'position' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-position'),
            'size'     => $Site->getAttribute('quiqqer.portfolio.settings.portfolioPopup.wallpaper-size')
        ));

        // slider
        $images = $Control->getImages();

        foreach ($images as $Image) {
            /* @var $Image QUI\Projects\Media\Image */
            $Slider->addSlide($Image->getUrl());
            $Slider->addMobileSlide($Image->getUrl());
        }

        return array(
            'html' => $Slider->create(),
            'css'  => QUI\Control\Manager::getCSS()
        );
    },
    array('project', 'siteId')
);
