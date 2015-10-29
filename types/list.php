<?php

$Portfolio = new \QUI\Portfolio\Controls\Portfolio(array(
    'entry-effect' => 'style3',
    'Site'         => $Site
));

$Engine->assign('Portfolio', $Portfolio);