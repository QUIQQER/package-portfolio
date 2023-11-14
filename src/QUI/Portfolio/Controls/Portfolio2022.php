<?php

/**
 * This file contains \QUI\Portfolio\Controls\Portfolio2022
 */

namespace QUI\Portfolio\Controls;

use QUI;
use QUI\Projects\Site\Utils;

/**
 * Class Portfolio
 * @package QUI\Portfolio\Bricks
 */
class Portfolio2022 extends QUI\Control
{
    /**
     * constructor
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        // default options
        $this->setAttributes([
            'showRandomButton'                 => false,
            'limit'                            => false,
            'qui-class'                        => 'package/quiqqer/portfolio/bin/controls/Portfolio2022',
            'data-qui-options-nopopups'        => true,
            'data-qui-options-popuptype'       => 'short',
            'data-qui-options-useanchor'       => false,
            'data-qui-options-lazyloading'     => true,
            'data-qui-options-start-reference' => 3,
            'parentInputList'                  => false, // for example from qui site select
            'order'                            => 'c_date DESC',
            'autoloadAfter'                    => 1, // disabled, 0, 1, 2, 3, 4

            // design
            'template'                         => 'default',
            'openBehavior'                     => 'openInBrowser', // openInBrowser, noOpen
            'aspectRatio'                      => '1/1', // any css valid aspect ratio: 1/1, 1/2: 4:3, 16:9, 9:16
            'imgPosition'                      => 'cover',
            'entriesPerLine'                   => 3,
            'gap'                              => '1rem',
            'mainColor'                        => false,
            'accentColor'                      => false,
            'entryMinWidthDesktop'             => 300,
            'entryMinWidthMobile'              => false
        ]);

        $this->addCSSFile(
            dirname(__FILE__).'/Portfolio2022.css'
        );

        parent::__construct($attributes);
    }

    /**
     * @return string
     * @throws QUI\Exception
     */
    public function getBody()
    {
        $Engine               = QUI::getTemplateManager()->getEngine();
        $Site                 = $this->getSite();
        $limit                = false;
        $displayNum           = 3;
        $entriesPerLine       = 3;
        $gap                  = false;
        $entryMinWidthDesktop = 0;
        $entryMinWidthMobile  = 0;
        $aspectRatio          = '1/1';

        if ($this->getAttribute('entriesPerLine') &&
            (int)$this->getAttribute('entriesPerLine') > 0 &&
            (int)$this->getAttribute('entriesPerLine') < 10) {
            $entriesPerLine = (int)$this->getAttribute('entriesPerLine');
        }

        // open behavior
        $openEntry = false;
        if ($this->getAttribute('openBehavior') === 'openInBrowser') {
            $openEntry = true;
        }

        $this->setJavaScriptControlOption('openentry', $openEntry);
        $this->setJavaScriptControlOption('autoload-after', $this->getAttribute('autoloadAfter'));

        $this->setJavaScriptControlOption('loadmoreentries', $entriesPerLine);

        if ($this->getAttribute('gap')) {
            $gap = $this->getAttribute('gap');
        }

        if ($this->getAttribute('entryMinWidthDesktop')) {
            $entryMinWidthDesktop = $this->getAttribute('entryMinWidthDesktop').'px';
        }

        if ($this->getAttribute('entryMinWidthMobile')) {
            $entryMinWidthMobile = $this->getAttribute('entryMinWidthMobile').'px';
        }

        if ($this->getAttribute('aspectRatio')) {
            $aspectRatio = $this->getAttribute('aspectRatio');
        }

        if ($this->getAttribute('limit')) {
            $limit = (int)$this->getAttribute('limit');
        }

        if ($this->getAttribute('parentInputList')) {
            // for bricks
            $parents   = $this->getAttribute('parentInputList');
            $portfolio = Utils::getSitesByInputList($Site->getProject(), $parents, [
                'where' => [
                    'type' => [
                        'type'  => 'IN',
                        'value' => ['quiqqer/portfolio:types/entry2022', 'quiqqer/portfolio:types/entry']
                    ]
                ],
                'limit' => $limit,
                'order' => $this->getAttribute('order')
            ]);
        } else {
            // for sites
            $portfolio = $Site->getChildren([
                'where' => [
                    'type' => [
                        'type'  => 'IN',
                        'value' => ['quiqqer/portfolio:types/entry2022', 'quiqqer/portfolio:types/entry']
                    ]
                ],
                'limit' => $limit
            ]);
        }

        if (empty($portfolio)) {
            QUI\System\Log::addInfo(
                QUI::getLocale()->get('quiqqer/portfolio', 'admin.portfolio.debug.noTypeFound')
            );

            return '';
        }

        // set "others" value for empty group index in array
        $categoriesArray = json_decode($Site->getAttribute(
            'quiqqer.portfolio.settings.categories'
        ), true);

        foreach ($categoriesArray as &$Category) {
            if (isset($Category['group']) && $Category['group'] === '') {
                $Category['group'] = "others";
            }
        }

        // get array with unique groups
        $uniqueGroups = $this->getUniqueGroups($categoriesArray);

        // sort categories data into groups
        $categoriesGroups = $this->sortCategories($categoriesArray, $uniqueGroups);

        $activeGroup = $this->getActiveGroup($uniqueGroups);

        if (empty($categoriesGroups)) {
            $categories = $categoriesArray;
        } else {
            $categories = $this->getCategories($activeGroup, $categoriesGroups);
        }

        $Engine->assign([
            'uniqueGroups' => $uniqueGroups,
            'activeGroup' => $activeGroup
        ]);

        $categoryGroupsHtml = $Engine->fetch(dirname(__FILE__).'/Portfolio2022.categoryGroups.html');

        foreach ($portfolio as $Child) {
            /* @var $Child QUI\Projects\Site */
            $cats = $Child->getAttribute('quiqqer.portfolio.settings.categories');

            if (is_string($cats)) {
                $cats = json_decode($cats, true);
            }

            if (!$cats || !is_array($cats)) {
                $cats = [];
            }

            $Child->setAttribute('quiqqer.portfolio.settings.categories', $cats);
        }

        switch ($this->getAttribute('imgPosition')) {
            case 'cover':
            case 'fill':
            case 'contain':
            case 'none':
            case 'scale-down':
                $imgPosition      = $this->getAttribute('imgPosition');
                $imgPositionStyle = 'object-fit: '.$this->getAttribute('imgPosition').';';
                break;

            default:
                $imgPosition      = 'cover';
                $imgPositionStyle = 'object-fit: cover; -o-object-fit: cover;';
                break;
        }

        if ($this->getAttribute('data-qui-options-start-reference')) {
            $displayNum = (int)$this->getAttribute('data-qui-options-start-reference');
        }

        if ($this->getAttribute('data-qui-options-lazyloading') === false) {
            $displayNum = false;
        }

        $showArrow = false;

        switch ($this->getAttribute('template')) {
            case 'textOnImageHiddenCenter1':
                $templateClass = 'quiqqer-portfolio-list2022__textOnImage quiqqer-portfolio-list2022__textOnImage-hiddenCenter1';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.textOnImage.html';
                $css           = '/Portfolio2022.textOnImage.css';
                break;

            case 'textOnImageHiddenBottom1':
                $templateClass = 'quiqqer-portfolio-list2022__textOnImage quiqqer-portfolio-list2022__textOnImage-hiddenBottom1';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.textOnImage.html';
                $css           = '/Portfolio2022.textOnImage.css';
                break;

            case 'textOnImageVisibleBottom1':
                $templateClass = 'quiqqer-portfolio-list2022__textOnImage quiqqer-portfolio-list2022__textOnImage-visibleBottom1';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.textOnImage.html';
                $css           = '/Portfolio2022.textOnImage.css';
                break;

            case 'textOnImageVisibleBottomWithArrow1':
                $showArrow     = true;
                $templateClass = 'quiqqer-portfolio-list2022__textOnImage quiqqer-portfolio-list2022__textOnImage-visibleBottomWithArrow1';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.textOnImage.html';
                $css           = '/Portfolio2022.textOnImage.css';
                break;

            case 'defaultNoHoverEffect':
                $templateClass = 'quiqqer-portfolio-list2022__defaultNoHoverEffect';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.defaultNoHoverEffect.html';
                $css           = '/Portfolio2022.defaultNoHoverEffect.css';
                break;

            case 'defaultNoHoverEffectNoText':
                $templateClass = 'quiqqer-portfolio-list2022__defaultNoHoverEffect quiqqer-portfolio-list2022__defaultNoHoverEffectNoText';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.defaultNoHoverEffect.html';
                $css           = '/Portfolio2022.defaultNoHoverEffect.css';
                break;

            case 'defaultNoHoverEffectNoTextNoBg':
                $templateClass = 'quiqqer-portfolio-list2022__defaultNoHoverEffect quiqqer-portfolio-list2022__defaultNoHoverEffectNoTextNoBg';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.defaultNoHoverEffect.html';
                $css           = '/Portfolio2022.defaultNoHoverEffect.css';
                break;

            case 'default':
            default:
                $templateClass = 'quiqqer-portfolio-list2022__default';
                $entryHtml     = dirname(__FILE__).'/Portfolio2022.default.html';
                $css           = '/Portfolio2022.default.css';
                break;
        }

        $this->addCSSFile(
            dirname(__FILE__).$css
        );

        switch ($this->getAttribute('aspectRatio')) {
            case '4/3':
            case '3/2':
            case '5/4':
            case '16/9':
                $imageFormat = 'landscape';
                break;

            case '1/1':
            case '3/4':
            case '2/3':
            case '4/5':
            case '9/16':
            default:
                $imageFormat = 'portrait';
                break;
        }

        $this->setStyles([
            '--quiqqer-portfolio2022-transition-duration'  => '300ms',
            '--quiqqer-portfolio2022-transition'           => 'var(--quiqqer-portfolio2022-transition-duration, 300ms) ease all',
            '--quiqqer-portfolio2022-imgPosition'          => $imgPosition,
            '--quiqqer-portfolio2022-aspectRation'         => $aspectRatio,
            '--quiqqer-portfolio2022-entriesPerLine'       => $entriesPerLine,
            '--quiqqer-portfolio2022-entryMinWidthDesktop' => $entryMinWidthDesktop,
            '--quiqqer-portfolio2022-entryMinWidthMobile'  => $entryMinWidthMobile,
            '--quiqqer-portfolio2022-arrowHeight'          => '80px',
        ]);

        if ($this->getAttribute('mainColor')) {
            $this->setStyle('--quiqqer-portfolio2022-mainColor', $this->getAttribute('mainColor'));
        }

        if ($this->getAttribute('accentColor')) {
            $this->setStyle('--quiqqer-portfolio2022-accentColor', $this->getAttribute('accentColor'));
        }

        $Engine->assign([
            'this' => $this,
            'portfolio' => $portfolio,
            'categories' => $categories,
            'displayNum' => $displayNum,
            'lazyloading' => $this->getAttribute('data-qui-options-lazyloading'),
            'imgPositionStyle' => $imgPositionStyle,
            'gao' => $gap,
            'templateClass' => $templateClass,
            'showArrow' => $showArrow,
            'arrowHtml' => dirname(__FILE__) . '/Portfolio2022.arrow.html',
            'entryHtml' => $entryHtml,
            'categoriesHtml' => dirname(__FILE__) . '/Portfolio2022.categories.html',
            'imageFormat' => $imageFormat,
            'entriesPerLine' => $entriesPerLine,
            'openEntry' => $openEntry,
            'categoryGroupsHtml' => $categoryGroupsHtml
        ]);

        return $Engine->fetch(dirname(__FILE__).'/Portfolio2022.html');
    }

    /**
     * Return current site
     * @return QUI\Projects\Site
     */
    protected function getSite()
    {
        if ($this->getAttribute('Site')) {
            return $this->getAttribute('Site');
        }

        return QUI::getRewrite()->getSite();
    }

    /**
     * Return array with unique groups
     *
     * @param $categoriesArray - data from ajax
     * @return array
     */
    protected function getUniqueGroups($categoriesArray)
    {
        // get array with unique groups
        $uniqueGroups = [];
        $ungrouped = '';

        foreach ($categoriesArray as $Categories) {
            if (!isset($Categories['group'])) {
                continue;
            }

            if ($Categories['group'] === 'ungrouped') {
                $ungrouped = $Categories['group'];
            } elseif (!in_array($Categories['group'], $uniqueGroups)
                && $Categories['group'] !== ''
            ) {
                array_push($uniqueGroups, $Categories['group']);
            }
        }

        if (!empty($uniqueGroups) && $ungrouped !== '') {
            array_push($uniqueGroups, $ungrouped);
        }

        return $uniqueGroups;
    }

    /**
     * Sorting categories based on groups.
     *
     * @param $categoriesArray - data from ajax
     * @param $uniqueGroups - unique groups
     * @return array
     */
    protected function sortCategories($categoriesArray, $uniqueGroups)
    {
        $categoriesGroups = array();

        foreach ($uniqueGroups as $UniqueGroups) {
            $groups = array();

            foreach ($categoriesArray as $Categories) {
                if (strpos($Categories['group'], $UniqueGroups) !== false) {
                    array_push($groups, $Categories);
                }
            }

            $categoriesGroups[$UniqueGroups] = $groups;
        }

        return $categoriesGroups;
    }

    /**
     * Get categories belonging to the active group.
     * The active group is selected based on the URL.
     *
     * @param $categoriesGroups - all categories
     * @return mixed - array with categories from active group
     */
    protected function getCategories($activeGroup, $categoriesGroups)
    {
        if (!$activeGroup || !isset($categoriesGroups[$activeGroup])) {
            $keys = array_keys($categoriesGroups);
            return $categoriesGroups[$keys[0]];
        }

        return $categoriesGroups[$activeGroup];
    }

    /**
     * Getting active group based on URL. If URL is
     * empty, get first item from $uniqueGroups
     *
     * @param $uniqueGroups - Unique groups
     * @return string - Active group name
     */
    protected function getActiveGroup($uniqueGroups)
    {
        if (empty($uniqueGroups)) {
            return '';
        }

        if (!isset($_GET['group'])) {
            return $uniqueGroups[0];
        }

        $urlGroup = $_GET['group'];
        return urldecode($urlGroup);
    }
}
