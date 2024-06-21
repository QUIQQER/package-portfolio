<?php

/**
 * @var QUI\Projects\Project $Project
 * @var QUI\Projects\Site $Site
 * @var QUI\Interfaces\Template\EngineInterface $Engine
 * @var QUI\Template $Template
 **/

$Reference = new QUI\Portfolio\Controls\Reference([
    'Site' => $Site,
    'sliderpos' => 'bottom'
]);

$Engine->assign('Reference', $Reference);
