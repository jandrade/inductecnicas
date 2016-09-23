/*global jQuery:true, $:true, Prefixr, idc */

var timerID,
	currentItem,
	navigation;

function resizeImages() {
	if (typeof currentItem === 'undefined') {
		return;
	}

	var i = 0,
		items = currentItem.find('.slider-mask img'),
		li = currentItem.find('.slider-mask li'),
		ratio,
		currentImage,
		newW = 0,
		newH = 0,
		itemHeight = currentItem.height(),
		itemWidth = currentItem.width(),
		imgWidth,
		imgHeight,
		numItems = items.length;
	
	for ( ; i < numItems; i++) {
		currentImage = $(items[i]);

		imgWidth = items[i].naturalWidth;
		imgHeight = items[i].naturalHeight;

		//	landscape
		if (imgWidth > imgHeight) {
			// img smaller than item
			if (imgHeight < itemHeight) {
			//	console.log("landscape... item");
				ratio = itemWidth/imgWidth;
				newW = itemWidth;
				newH = parseInt(imgHeight * ratio, 10);
			// img bigger than item
			} else {
			//	console.log("landscape... IMAGE");
				ratio = itemHeight/imgHeight;
				newW = parseInt(imgWidth * ratio, 10);
				newH = itemHeight;

				if (newW < itemWidth) {
					newW = itemWidth;
				}
			}
		// portrait
		} else {
			// img bigger than item
			if (imgWidth > itemWidth) {
			//	console.log("PORTRAIT... IMAGe");
				ratio = itemWidth/imgWidth;
				newW = itemWidth;
				newH = parseInt(imgHeight * ratio, 10);
			// img smaller than item
			} else {
			//	console.log("PORTRAIT... item");
				ratio = itemWidth/imgWidth;
				newW = itemWidth;
				newH = parseInt(imgHeight * ratio, 10);
			}
		}

		currentImage.css({
			height: newH,
			marginLeft: (currentItem.width() - newW)*0.5,
			marginTop: (currentItem.height() - newH)*0.5,
			width: newW,
			'max-width': 'initial'
		});
	}


}

function resize() {
	navigation.snapToGrid();
	resizeImages();
}

function setHeight(e) {
	var headerHeight = idc.utils.mobileBreak() ? 0 : 84;
	idc.size = $(window).height() - headerHeight;

	$('section').height(idc.size);

	if (typeof e !== 'undefined') {
		clearTimeout(timerID);
		timerID = setTimeout(resize, 300);
	}
}

$(document).ready(function() {

	$('.accordion').accordion({
		opened: function(openItem) {
			currentItem = openItem.find('.body');
			currentItem.find('.slider').slider({
						forceTouch: true,
						infinite: false,
						single: true
					});
			resizeImages();
		}
	});
	
	$('.info-btn').on(idc.Input.CLICK, function(e) {
		e.preventDefault();
		$(e.currentTarget).parent().toggleClass('detail-open');
	});

	$('.about-btn').on(idc.Input.CLICK, function(e) {
		e.preventDefault();
		$('.about').addClass('about-open');
		navigation.toggleMenu();
		$('.menu li').removeClass('active');
		$(e.currentTarget).parent().addClass('active');
	});

	$('.close-btn').on('click', function(e) {
		e.preventDefault();
		$('.about').removeClass('about-open');
		navigation.snapToGrid();
	});

	$('.scroll-btn').on('click', function(e) {
		e.preventDefault();
		navigation.scrollToIndex(1);
	});

	setHeight();
	$(window).on(idc.Input.RESIZE, setHeight);

	navigation = idc.Navigation('.wrapper > header', {
		onSubOpen: function(item, section) {
			$(section + ' .accordion').data('module').open(item);
		},
		changed: function(index, section) {
			// close all accordions
			$('.accordion').each(function(i, item) {
				$(item).data('module').close();
			});
		}
	});
});
