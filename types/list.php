<?php

$Portfolio = new \QUI\Portfolio\Controls\Portfolio(array(
    'entry-effect' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEffect'),
    'entry-width'  => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEntryWidth'),
    'Site'         => $Site
));

$Engine->assign('Portfolio', $Portfolio);