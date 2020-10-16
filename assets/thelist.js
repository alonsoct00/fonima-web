"use strict";
jQuery(function($) {

    var $Body = $('body'),
        $OverBody = $('#OverBG'),
        $Window = $(window),
        $Page = $('#Page'),
        $TheList = $('#TheList'),
        $TheListList = $('#TheList__List'),
        $Logo = $('#HomeUi__Header'),
        $Border = $('#Border'),
        $UI = $('#HomeUi'),
        $UIRight = $('#HomeUi__Right'),
        $Burger = $('#HomeUi__Burger'),
        $Subpage = $('#Subpage'),
        $SubpageContent = $('#Subpage__Content'),
        $SubpageClose = $('#Subpage__Close'),
        $Images;

    $Body.css('background', $TheList.find('[data-color]').eq(0).attr('data-color'));
    $Window.on('load', function() {
        setTimeout(function() { $Border.removeClass('Faded'); }, 2000);
        setTimeout(function() { $Logo.removeClass('Dark'); }, 2500);
        setTimeout(_DeepLink, 3000);

    });

    _AppendTitleShadow();
    _PrependNavImages();
    _LogoAnim();
    _MenuEvents();
    _Burger();
    _toggleElements();


    function _Burger() {
        $Burger.on('click', function() { $UIRight.toggleClass('Active'); });
    }

    function _toggleElements() {
        if ($('.sub-page-content').length) {
            $(".footer-fonca").fadeOut();
        } else {
            $(".footer-fonca").fadeIn();
        }
    }

    function _AppendTitleShadow() {
        $('.TheList__Title').each(function() {
            $(this).append('<i>' + $(this).html() + '</i>');
        });
    }

    function _PrependNavImages() {
        $Page.prepend('<div id="NavImages" class="NavImages"></div>');
        $Images = $('#NavImages');

        $TheListList.find('[data-image]').each(function() {
            $Images.append('<div style="background-image:url(\'' + $(this).attr('data-image') + '\');" data-url="' + $(this).attr('href') + '"></div>');
        });

    }

    function _HeaderAnim() {

        $Subpage.find('h2 > span').removeClass('Active');

        var Interval = setInterval(function() {
            $Subpage.find('h2 > div > span:not(.Active)').eq(Math.floor(Math.random() * $Subpage.find('h2 > div > span:not(.Active)').size())).addClass('Active');
            if (!$Subpage.find('h2 > div > span:not(.Active)').size()) { window.clearInterval(Interval); }
        }, 200);
        $('h2 > span').each(function() {
            var $elem = $(this);
            $elem.html($elem.text().replace(/\s+/, ''));
        });
    }

    function _bgSubPage() {
        var $Subpageid = $Subpage.find('.sub-page-content').prop('id');
        $Subpage.addClass($Subpageid);

        _HeaderAnim();
    }

    function _DeepLink() {
        var Href = window.location.hash;

        if (Href.substr(0, 2) == '#/') {
            if ($Subpage.hasClass('Loaded')) {
                $(".footer-fonca").fadeOut();
                $Subpage.animate({ opacity: 0 }, 500, function() {
                    $Subpage[0].scrollTop = 0;
                    $.get('subpages/' + Href.replace('#/', '') + '.html', function(Reply) {
                        $SubpageContent.html(Reply);
                        $SubpageContent.find('h2 > div').each(function() {
                            var Chars = $.trim($(this).html()).split("");
                            $(this).html('<span>' + Chars.join('</span><span>') + '</span>');
                            $Subpage.animate({ opacity: 1 }, 500);
                        });
                        var $Subpageid = $Subpage.find('.sub-page-content').prop('id') || ('.sub-page-content').attr('id');
                        $Subpage.addClass($Subpageid);
                    });
                });
            } else {
                $.get('subpages/' + Href.replace('#/', '') + '.html', function(Reply) {
                    $SubpageContent.html(Reply);
                    $SubpageContent.find('h2 > div').each(function() {
                        var Chars = $.trim($(this).html()).split("");
                        $(this).html('<span>' + Chars.join('</span><span>') + '</span>');
                    });
                    var $Subpageid = $Subpage.find('.sub-page-content').prop('id') || ('.sub-page-content').attr('id');
                    $Subpage.addClass($Subpageid);
                });
                $Border.addClass('Faded');
                $UI.addClass('Dark');
                $Logo.addClass('Active');
                $UI.addClass('Subsection');
                $Subpage.css('display', 'block');
                $Subpage[0].scrollTop = 0;
                setTimeout(function() {
                    $Body.css('overflow', 'hidden');
                    $Subpage.animate({ opacity: 1 }, 500, function() {
                        $Subpage.addClass('Loaded');
                    });
                    _HeaderAnim();
                    _bgSubPage();
                }, 900);
            }
            return false;
        }
    }

    function _MenuEvents() {
        $TheList.on('mouseover click touchstart', '[data-color]', _ChangeColor);
        $Body.on('click', 'a', _MenuClicked);
        $Window.on('resize rotate scroll', _TheEvents);

        _TheEvents();
        window.requestAnimationFrame(_AnimFrame);
        setInterval(_setScroll, 10);
        var CurrentScroll = -document.scrollingElement.scrollTop,
            TargetScroll = -document.scrollingElement.scrollTop,
            Delta = 0;


        function _TheEvents() {
            var ListHeight = $TheList.outerHeight(),
                PageHeight = $Page.height();

            if (PageHeight != ListHeight) { $Page.height($TheList.height()); }

            TargetScroll = -document.scrollingElement.scrollTop;

        }

        function _MenuClicked() {
            var Href = $(this).attr('href');

            if (Href.substr(0, 2) == '#/') {
                window.location.hash = Href;
                if ($Subpage.hasClass('Loaded')) {
                    $(".footer-fonca").fadeOut();
                    $Subpage.animate({ opacity: 0 }, 500, function() {
                        $Subpage[0].scrollTop = 0;
                        $.get('subpages/' + Href.replace('#/', '') + '.html', function(Reply) {
                            $SubpageContent.html(Reply);
                            $SubpageContent.find('h2 > div').each(function() {
                                var Chars = $.trim($(this).html()).split("");
                                $(this).html('<span>' + Chars.join('</span><span>') + '</span>');
                                $Subpage.animate({ opacity: 1 }, 500, function() {
                                    _HeaderAnim();
                                });
                            });
                            var $Subpageid = $Subpage.find('.sub-page-content').prop('id') || ('.sub-page-content').attr('id');
                            $Subpage.addClass($Subpageid);
                            _bgSubPage();
                        });
                    });
                } else {
                    $.get('subpages/' + Href.replace('#/', '') + '.html', function(Reply) {
                        $SubpageContent.html(Reply);
                        $SubpageContent.find('h2 > div').each(function() {
                            var Chars = $.trim($(this).html()).split("");
                            $(this).html('<span>' + Chars.join('</span><span>') + '</span>');
                        });
                        var $Subpageid = $Subpage.find('.sub-page-content').prop('id') || ('.sub-page-content').attr('id');
                        $Subpage.addClass($Subpageid);
                    });
                    $Border.addClass('Faded');
                    $UI.addClass('Dark');
                    $Logo.addClass('Active');
                    $UI.addClass('Subsection');
                    $Subpage.css('display', 'block');
                    $(".footer-fonca").fadeOut();
                    $Subpage[0].scrollTop = 0;
                    setTimeout(function() {
                        $Body.css('overflow', 'hidden');
                        $Subpage.animate({ opacity: 1 }, 500, function() {
                            $Subpage.addClass('Loaded');
                        });
                        _HeaderAnim();
                        _bgSubPage();
                    }, 900);
                }
                return false;
            }
        }

        $SubpageClose.on('click', function() {
            window.location.hash = '';
            $Subpage.removeClass('Loaded');
            var $Subpageid = $('.sub-page-content').prop('id');
            $Subpage.removeClass($Subpageid);
            $Subpage.animate({ opacity: 0 }, 500, function() {
                $Subpage[0].scrollTop = 0;
                $SubpageContent.html('');
                $Border.removeClass('Faded');
                $UI.removeClass('Dark');
                $Logo.removeClass('Active');
                $UI.removeClass('Subsection');
                $Body.css('overflow', 'auto');
                $Subpage.css('display', 'none');
                $(".footer-fonca").fadeIn();
            });
            return false;

        });

        $('.HomeUi___Menu li a').on('click', function() {
            var $Subpageid = $('.sub-page-content').prop('id');
            $Subpage.removeClass($Subpageid);
        });


        function _setScroll() {
            if ($Body.width() < 768) {
                CurrentScroll = TargetScroll;
            } else {
                CurrentScroll = CurrentScroll - (CurrentScroll - TargetScroll) / 30;
            }
            Delta = -(CurrentScroll - TargetScroll) / 10;
            if (Delta > -1 && Delta < 1) { Delta = 0; }

        }

        function _ChangeColor() {
            $Body.css('background', $(this).attr('data-color'));
            $Images.children('div').removeClass('Active');
            $Images.children('[data-url=\'' + $(this).attr('href') + '\']').eq(0).addClass('Active');
        }

        function _AnimFrame() {
            $TheListList.css('transform', 'translate3d(0,' + CurrentScroll + 'px,0)');
            $TheListList.find('.TheList__Title > i').css('transform', 'translate3d(0,' + Delta + 'px,0)');
            if (Delta > 2 || Delta < -2) {
                $TheList.addClass('IsScrolling');
            } else {
                $TheList.removeClass('IsScrolling');
            }
            window.requestAnimationFrame(_AnimFrame);
        }
    }

    function _LogoAnim() {
        var Mode = true;

        setInterval(function() {
            if (Mode) {
                $Logo.find('span:not(.Active)').eq(Math.floor(Math.random() * $Logo.find('span:not(.Active)').size())).addClass('Active');
                if (!$Logo.find('span:not(.Active)').size()) { Mode = false; }
            } else {
                $Logo.find('span.Active').eq(Math.floor(Math.random() * $Logo.find('span.Active').size())).removeClass('Active');
                if (!$Logo.find('span.Active').size()) { Mode = true; }
            }

        }, 200);
    }

    function _GetScrollerEndPoint() {
        var scrollHeight = $("#Subpage").prop('scrollHeight');
        var divHeight = $("#Subpage").height();
        var scrollerEndPoint = scrollHeight - divHeight;
        var divScrollerTop = $("#Subpage").scrollTop();
        if (divScrollerTop === scrollerEndPoint) {
            $('#subpage-menu-content').slideDown();
        } else {
            $('#subpage-menu-content').slideUp();
        }
    }

    var width = $(window).width();
    if (width <= 767) {
        $('#Subpage').scroll(function() {
            _GetScrollerEndPoint();
        });
    } else {}

});



AOS.init();