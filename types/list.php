<?php

$Portfolio = new \QUI\Portfolio\Controls\Portfolio(array(
    'entry-effect' => $Site->getAttribute('quiqqer.portfolio.settings.portfolioEffect'),
    'Site'         => $Site
));

$Engine->assign('Portfolio', $Portfolio);