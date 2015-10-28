<?php

$portfolio = $Site->getChildren(array(
    'where' => array(
        'type' => 'quiqqer/portfolio:types/entry'
    )
));

$categories = $Site->getAttribute(
    'quiqqer.portfolio.settings.categories'
);

foreach ($portfolio as $Child) {
    /* @var $Child QUI\Projects\Site */
    $cats = $Child->getAttribute('quiqqer.portfolio.settings.categories');
    $cats = json_decode($cats, true);

    if (!$cats) {
        $cats = array();
    }

    $Child->setAttribute('quiqqer.portfolio.settings.categories', $cats);
}

$Engine->assign(array(
    'portfolio'  => $portfolio,
    'categories' => json_decode($categories, true)
));
