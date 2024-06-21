<?php

/**
 * @var QUI\Projects\Project $Project
 * @var QUI\Projects\Site $Site
 * @var QUI\Interfaces\Template\EngineInterface $Engine
 * @var QUI\Template $Template
 **/

$Reference = new QUI\Portfolio\Controls\Reference2022([
    'Site' => $Site
]);

$Engine->assign('Reference', $Reference);
