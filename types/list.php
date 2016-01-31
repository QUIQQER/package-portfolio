<?php

$Portfolio = new \QUI\Portfolio\Controls\Portfolio(array(
    'entry-effect' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEffect'),
    'entry-width' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEntryWidth'),
    'data-qui-options-nopopups' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioNoPopup'),
    'Site' => $Site
));

$Engine->assign('Portfolio', $Portfolio);
