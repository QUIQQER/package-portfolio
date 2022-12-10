<?php

$Portfolio2022 = new QUI\Portfolio\Controls\Portfolio2022([
    'template'             => $Site->getAttribute('quiqqer.portfolio2022.settings.template'),
    'imgPosition'          => $Site->getAttribute('quiqqer.portfolio2022.settings.imgPosition'),
    'entriesPerLine'       => $Site->getAttribute('quiqqer.portfolio2022.settings.entriesPerLine'),
    'aspectRatio'          => $Site->getAttribute('quiqqer.portfolio2022.settings.aspectRatio'),
    'mainColor'            => $Site->getAttribute('quiqqer.portfolio2022.settings.mainColor'),
    'accentColor'          => $Site->getAttribute('quiqqer.portfolio2022.settings.accentColor'),
    'gap'                  => $Site->getAttribute('quiqqer.portfolio2022.settings.gap'),
    'entryMinWidthDesktop' => $Site->getAttribute('quiqqer.portfolio2022.settings.entryMinWidthDesktop'),
    'entryMinWidthMobile'  => $Site->getAttribute('quiqqer.portfolio2022.settings.entryMinWidthMobile'),
    'showRandomButton'     => $Site->getAttribute('quiqqer.portfolio2022.settings.showRandomButton'),

    'data-qui-options-nopopups'        => $Site->getAttribute('quiqqer.portfolio2022.settings.portfolioNoPopup'),
    'data-qui-options-popuptype'       => $Site->getAttribute('quiqqer.portfolio2022.settings.portfolioPopup.type'),
    'data-qui-options-start-reference' => $Site->getAttribute('quiqqer.portfolio2022.settings.referenceStartNumber'),
    'data-qui-options-lazyloading'     => true,
    'data-qui-options-useanchor'       => true,
    'Site'                             => $Site
]);

$Engine->assign('Portfolio2022', $Portfolio2022);
