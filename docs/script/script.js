console.clear();

// 드롭다운 메뉴 구현
function DropDownMenu__init() {
	$('.drop-down-menu__btn').click(function() {
		let $this = $(this);
		let has = $(this).hasClass('active');
		let dropDownMenuBox = $this.closest('.drop-down-menu-box');

		if(has) {
			$this.removeClass('active');
			dropDownMenuBox.find(' > .drop-down-menu').removeClass('active');
		} else {
			$this.addClass('active');	
			dropDownMenuBox.find(' > .drop-down-menu').addClass('active');
		}				
	});	
}

DropDownMenu__init();

function SwiperSlide1__init() {
	const swiper = new Swiper('.checkcard-box .swiper', {
		loop: true, // 슬라이드 반복여부
		slidesPerView: 3,	// 한 화면에 슬라이드가 몇 개 나올건지
		centeredSlides: true, // 슬라이드가 가운데 위치하도록
        speed:500,
		navigation: {
			nextEl: '.checkcard-box .swiper-button-next',
			prevEl: '.checkcard-box .swiper-button-prev',
		},
	});
}

SwiperSlide1__init();


/* 발견되면 활성화시키는 라이브러리 시작 */
function ActiveOnVisible__init() {
  $('.active-on-visible').each(function(index, node) {
    let $node = $(node);

    let onFuncName = $node.attr('data-active-on-visible-on-func-name');
    let offFuncName = $node.attr('data-active-on-visible-off-func-name');

    $node.data('data-active-on-visible-on-func-name', onFuncName);
    $node.data('data-active-on-visible-off-func-name', offFuncName);
  });

  $(window).resize(_.debounce(ActiveOnVisible__initOffset, 500));
  ActiveOnVisible__initOffset();

  $(window).scroll(_.debounce(ActiveOnVisible__checkAndActive, 50));
  ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__initOffset() {
  var windowHeight = $(window).height();

  $('.active-on-visible:not(.actived)').each(function(index, node) {
    let $node = $(node);

    let offsetTop = $node.offset().top;

    let matrix = $node.css('transform').replace(/[^0-9\-.,]/g, '').split(',')
    let translateX = matrix[12] || matrix[4];
    let translateY = matrix[13] || matrix[5];

    if ( translateY ) {
      offsetTop -= translateY;
    }

    $node.attr('data-active-on-visible-offsetTop', offsetTop);
    $node.data('data-active-on-visible-offsetTop', offsetTop);

    if ( !$node.attr('data-active-on-visible-diff-y') ) {
      $node.attr('data-active-on-visible-diff-y', '0');
    }

    if ( !$node.attr('data-active-on-visible-delay') ) {
      $node.attr('data-active-on-visible-delay', '0');
    }

    let diffY = $node.attr('data-active-on-visible-diff-y');
    let delay = $node.attr('data-active-on-visible-delay');

    if ( diffY.substr(-2, 2) == 'vh' ) {
      diffY = parseInt(diffY);

      diffY = windowHeight * (diffY / 100);
    }
    else if ( diffY.substr(-1, 1) == '%' ) {
      diffY = parseInt(diffY);

      diffY = $node.height() * (diffY / 100);
    }
    else {
      diffY = parseInt(diffY);
    }

    $node.attr('data-active-on-visible-diff-y-real', diffY);
    $node.data('data-active-on-visible-diff-y', diffY);
    $node.data('data-active-on-visible-delay', delay);
  });

  ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__checkAndActive() { 
  $('.active-on-visible:not(.actived)').each(function(index, node) {
    let $node = $(node);

    let offsetTop = $node.data('data-active-on-visible-offsetTop') * 1;
    let diffY = parseInt($node.data('data-active-on-visible-diff-y'));
    let delay = parseInt($node.data('data-active-on-visible-delay'));

    let onFuncName = $node.data('data-active-on-visible-on-func-name');
    let offFuncName = $node.data('data-active-on-visible-off-func-name');

    let scrollTop = $(window).scrollTop();
    let windowHeight = $(window).height();
    let nodeHeight = $node.height();

    if ( scrollTop + windowHeight + diffY > offsetTop ) {
      setTimeout(function() {
        if ( $node.hasClass('active') == false ) {
          $node.addClass('active');

          if ( $node.hasClass('can-active-once') ) {
            $node.addClass('actived');
          }

          if ( window[onFuncName] ) {
            window[onFuncName]($node);
          }
        }
      }, delay);
    }
    else {
      if ( $node.hasClass('active') ) {
        $node.removeClass('active');

        if ( window[offFuncName] ) {
          window[offFuncName]($node);
        }
      }
    }
  });
}

$(function() {
  ActiveOnVisible__init();
})
/* 발견되면 활성화시키는 라이브러리 끝 */