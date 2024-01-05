<?php

$Portfolio = new QUI\Portfolio\Controls\Portfolio([
    'showRandomButton' => $Site->getAttribute('quiqqer.portfolio.settings.showRandomButton'),
    'entry-effect' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEffect'),
    'entry-width' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEntryWidth'),
    'img-position' => $Site->getAttribute('quiqqer.portfolio.settings.imgPosition'),
    'data-qui-options-nopopups' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioNoPopup'),
    'data-qui-options-popuptype' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioPopup.type'),
    'data-qui-options-start-reference' => $Site->getAttribute('quiqqer.portfolio.settings.referenceStartNumber'),
    'data-qui-options-lazyloading' => true,
    'data-qui-options-useanchor' => true,
    'Site' => $Site
]);

$Engine->assign('Portfolio', $Portfolio);
