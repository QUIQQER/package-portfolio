<?php

$portfolio = $Site->getChildren(array(
    'where' => array(
        'type' => 'quiqqer/portfolio:types/entry'
    )
));

$categories = $Site->getAttribute(
    'quiqqer.portfolio.settings.categories'
);

$Engine->assign(array(
    'portfolio'  => $portfolio,
    'categories' => json_decode($categories, true)
));
