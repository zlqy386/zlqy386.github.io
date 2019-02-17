/*globals Modernizr:false,YT:false*/
$(document).ready(function(){

	//汎用カウンター
	var cnt = 0;
	
	//スマホの場合に必要ないものは消す
	if(Modernizr.touchevents){
		$('.bgm').hide();
		$('.parallax').hide();
		$('#background_movie').hide();
	}
	
	//BGMの音量切替
	var volume = 2;
	var volume_before_mute = 1;
	//Cookieの値に音量調整
	if(!$.cookie("djmax_volume")){
		$.cookie("djmax_volume",volume,{expires:30});
	}else{
		volume = $.cookie("djmax_volume");
		$('.volume_btn').attr('data-volume',volume);
	}
	//音量変更
	$('.volume_btn').on('click',function(){
		volume = volume - 1;
		if(volume < 0) volume = 3;
		$('.volume_btn').attr('data-volume',volume);
		$('#bgm').prop("volume",volume/5);
		$.cookie("djmax_volume",volume,{expires:30});
	});
	
	//ローディング
	init();
	function init(){
		var manifest = [
			'img/sm_bk.jpg',
			'img/footer_icon_01.png',
			'img/footer_icon_02.png',
			'img/footer_text_01.png',
			'img/header_bgm_h.png',
			'img/header_bgm_icon.png',
			'img/header_menu.png',
			'img/header_new.png',
			'img/header_ps4.png',
			'img/header_share_fb_bk.png',
			'img/header_share_h.png',
			'img/header_share_icon.png',
			'img/header_share_line_bk.png',
			'img/header_share_tw_bk.png',
			'img/parallax_01.png',
			'img/parallax_02.png',
			'img/parallax_03.png',
			'img/parallax_04.png',
			'img/parallax_05.png',
			'img/home/spec_h1.png',
			'img/home/spec_h1_bk.png',
			'img/home/spec_dt_bk.png',
			'img/home/spec_dt_07.png',
			'img/home/spec_dt_06.png',
			'img/home/spec_dt_05.png',
			'img/home/spec_dt_04.png',
			'img/home/spec_dt_03.png',
			'img/home/spec_dt_02.png',
			'img/home/spec_dt_01.png',
			'img/home/scroll.png',
			'img/home/sale_title_02.png',
			'img/home/sale_title_01.png',
			'img/home/sale_text_02.png',
			'img/home/sale_text_01.png',
			'img/home/sale_img_02.png',
			'img/home/sale_img_01.png',
			'img/home/celebration_banner.jpg',
			'img/home/celebration_img.jpg',
			'img/home/comic_banner.jpg',
			'img/home/enquete_banner.jpg',
			'img/home/manual_banner.jpg',
			'img/home/request_banner.jpg',
			'img/home/twitter_banner.jpg',
			'img/home/intro_mode_G_img_03.png',
			'img/home/intro_mode_G_img_02.png',
			'img/home/intro_mode_G_img_01.png',
			'img/home/intro_mode_G_h1.png',
			'img/home/intro_mode_G_h1_bk.png',
			'img/home/intro_mode_F_img_03.png',
			'img/home/intro_mode_F_img_02.png',
			'img/home/intro_mode_F_img_01.png',
			'img/home/intro_mode_F_h1.png',
			'img/home/intro_mode_F_h1_bk.png',
			'img/home/intro_mode_E_img_02.png',
			'img/home/intro_mode_E_img_01.png',
			'img/home/intro_mode_E_h1.png',
			'img/home/intro_mode_E_h1_bk.png',
			'img/home/intro_mode_D_img_03.png',
			'img/home/intro_mode_D_img_02.png',
			'img/home/intro_mode_D_img_01.png',
			'img/home/intro_mode_D_h1.png',
			'img/home/intro_mode_D_h1_bk.png',
			'img/home/intro_mode_C_img_03.png',
			'img/home/intro_mode_C_img_02.png',
			'img/home/intro_mode_C_img_01.png',
			'img/home/intro_mode_C_h1.png',
			'img/home/intro_mode_C_h1_bk.png',
			'img/home/intro_mode_B_img_03.png',
			'img/home/intro_mode_B_img_02.png',
			'img/home/intro_mode_B_img_01.png',
			'img/home/intro_mode_B_h1.png',
			'img/home/intro_mode_B_h1_bk.png',
			'img/home/intro_mode_A_img_03.png',
			'img/home/intro_mode_A_img_02.png',
			'img/home/intro_mode_A_img_01.png',
			'img/home/intro_mode_A_h1.png',
			'img/home/intro_mode_A_h1_bk.png',
			'img/home/intro_logo.png',
			'img/home/intro_h1.png',
			'img/home/intro_h1_bk.png',
			'img/home/intro_game_shadow_01.png',
			'img/home/intro_game_num_07.png',
			'img/home/intro_game_num_06.png',
			'img/home/intro_game_num_05.png',
			'img/home/intro_game_num_04.png',
			'img/home/intro_game_num_03.png',
			'img/home/intro_game_num_02.png',
			'img/home/intro_game_num_01.png',
			'img/home/intro_game_nav_bk.png',
			'img/home/intro_game_nav_bk_dis.png',
			'img/home/intro_game_nav_active.png',
			'img/home/intro_game_nav_03.png',
			'img/home/intro_game_nav_02.png',
			'img/home/intro_game_nav_01.png',
			'img/home/intro_game_img_01.png',
			'img/home/intro_game_h2_07.png',
			'img/home/intro_game_h2_06.png',
			'img/home/intro_game_h2_05.png',
			'img/home/intro_game_h2_04.png',
			'img/home/intro_game_h2_03.png',
			'img/home/intro_game_h2_02.png',
			'img/home/intro_game_h2_01.png',
			'img/home/intro_game_h1_01.png',
			'img/home/intro_game_button_text_04.png',
			'img/home/intro_game_button_text_03.png',
			'img/home/intro_game_button_text_02.png',
			'img/home/intro_game_button_text_01.png',
			'img/home/intro_game_button_shadow_04.png',
			'img/home/intro_game_button_shadow_03.png',
			'img/home/intro_game_button_shadow_02.png',
			'img/home/intro_game_button_shadow_01.png',
			'img/home/intro_game_button_img_04.png',
			'img/home/intro_game_button_img_03.png',
			'img/home/intro_game_button_img_02.png',
			'img/home/intro_game_button_img_01.png',
			'img/home/intro_game_button_h2_04.png',
			'img/home/intro_game_button_h2_03.png',
			'img/home/intro_game_button_h2_02.png',
			'img/home/intro_game_button_h2_01.png',
			'img/home/intro_game_button_h1_bk.png',
			'img/home/intro_game_button_h1_02.png',
			'img/home/intro_game_button_h1_01.png',
			'img/home/info_h1.png',
			'img/home/customize_img_07.png',
			'img/home/customize_img_06.png',
			'img/home/customize_img_05.png',
			'img/home/customize_img_04.png',
			'img/home/customize_img_03.png',
			'img/home/customize_img_02.png',
			'img/home/customize_img_01.png',
			'img/home/customize_h1_bk_02.png',
			'img/home/customize_h1_bk_01.png',
			'img/home/customize_h1_02.png',
			'img/home/customize_h1_01.png',
			'img/home/customize_caption_text_02.png',
			'img/home/customize_caption_text_01.png',
			'img/home/customize_caption_bk.png',
			'bgm/222.mp3'
		];
		var manifest_sp = [
			'img/sm_bk.jpg',
			'img/footer_icon_01.png',
			'img/footer_icon_02.png',
			'img/footer_text_01.png',
			'img/header_bgm_h.png',
			'img/header_bgm_icon.png',
			'img/header_menu.png',
			'img/header_new.png',
			'img/header_ps4.png',
			'img/header_share_fb_bk.png',
			'img/header_share_h.png',
			'img/header_share_icon.png',
			'img/header_share_line_bk.png',
			'img/header_share_tw_bk.png',
			'img/parallax_01.png',
			'img/parallax_02.png',
			'img/parallax_03.png',
			'img/parallax_04.png',
			'img/parallax_05.png',
			'img/home/spec_h1.png',
			'img/home/spec_h1_bk.png',
			'img/home/spec_dt_bk.png',
			'img/home/spec_dt_07.png',
			'img/home/spec_dt_06.png',
			'img/home/spec_dt_05.png',
			'img/home/spec_dt_04.png',
			'img/home/spec_dt_03.png',
			'img/home/spec_dt_02.png',
			'img/home/spec_dt_01.png',
			'img/home/scroll.png',
			'img/home/sale_title_02.png',
			'img/home/sale_title_01.png',
			'img/home/sale_text_02.png',
			'img/home/sale_text_01.png',
			'img/home/sale_img_02.png',
			'img/home/sale_img_01.png',
			'img/home/celebration_banner.jpg',
			'img/home/celebration_img.jpg',
			'img/home/comic_banner.jpg',
			'img/home/enquete_banner.jpg',
			'img/home/manual_banner.jpg',
			'img/home/request_banner.jpg',
			'img/home/twitter_banner.jpg',
			'img/home/intro_mode_G_img_03.png',
			'img/home/intro_mode_G_img_02.png',
			'img/home/intro_mode_G_img_01.png',
			'img/home/intro_mode_G_h1.png',
			'img/home/intro_mode_G_h1_bk.png',
			'img/home/intro_mode_F_img_03.png',
			'img/home/intro_mode_F_img_02.png',
			'img/home/intro_mode_F_img_01.png',
			'img/home/intro_mode_F_h1.png',
			'img/home/intro_mode_F_h1_bk.png',
			'img/home/intro_mode_E_img_02.png',
			'img/home/intro_mode_E_img_01.png',
			'img/home/intro_mode_E_h1.png',
			'img/home/intro_mode_E_h1_bk.png',
			'img/home/intro_mode_D_img_03.png',
			'img/home/intro_mode_D_img_02.png',
			'img/home/intro_mode_D_img_01.png',
			'img/home/intro_mode_D_h1.png',
			'img/home/intro_mode_D_h1_bk.png',
			'img/home/intro_mode_C_img_03.png',
			'img/home/intro_mode_C_img_02.png',
			'img/home/intro_mode_C_img_01.png',
			'img/home/intro_mode_C_h1.png',
			'img/home/intro_mode_C_h1_bk.png',
			'img/home/intro_mode_B_img_03.png',
			'img/home/intro_mode_B_img_02.png',
			'img/home/intro_mode_B_img_01.png',
			'img/home/intro_mode_B_h1.png',
			'img/home/intro_mode_B_h1_bk.png',
			'img/home/intro_mode_A_img_03.png',
			'img/home/intro_mode_A_img_02.png',
			'img/home/intro_mode_A_img_01.png',
			'img/home/intro_mode_A_h1.png',
			'img/home/intro_mode_A_h1_bk.png',
			'img/home/intro_logo.png',
			'img/home/intro_h1.png',
			'img/home/intro_h1_bk.png',
			'img/home/intro_game_shadow_01.png',
			'img/home/intro_game_num_07.png',
			'img/home/intro_game_num_06.png',
			'img/home/intro_game_num_05.png',
			'img/home/intro_game_num_04.png',
			'img/home/intro_game_num_03.png',
			'img/home/intro_game_num_02.png',
			'img/home/intro_game_num_01.png',
			'img/home/intro_game_nav_bk.png',
			'img/home/intro_game_nav_bk_dis.png',
			'img/home/intro_game_nav_active.png',
			'img/home/intro_game_nav_03.png',
			'img/home/intro_game_nav_02.png',
			'img/home/intro_game_nav_01.png',
			'img/home/intro_game_img_01.png',
			'img/home/intro_game_h2_07.png',
			'img/home/intro_game_h2_06.png',
			'img/home/intro_game_h2_05.png',
			'img/home/intro_game_h2_04.png',
			'img/home/intro_game_h2_03.png',
			'img/home/intro_game_h2_02.png',
			'img/home/intro_game_h2_01.png',
			'img/home/intro_game_h1_01.png',
			'img/home/intro_game_button_text_04.png',
			'img/home/intro_game_button_text_03.png',
			'img/home/intro_game_button_text_02.png',
			'img/home/intro_game_button_text_01.png',
			'img/home/intro_game_button_shadow_04.png',
			'img/home/intro_game_button_shadow_03.png',
			'img/home/intro_game_button_shadow_02.png',
			'img/home/intro_game_button_shadow_01.png',
			'img/home/intro_game_button_img_04.png',
			'img/home/intro_game_button_img_03.png',
			'img/home/intro_game_button_img_02.png',
			'img/home/intro_game_button_img_01.png',
			'img/home/intro_game_button_h2_04.png',
			'img/home/intro_game_button_h2_03.png',
			'img/home/intro_game_button_h2_02.png',
			'img/home/intro_game_button_h2_01.png',
			'img/home/intro_game_button_h1_bk.png',
			'img/home/intro_game_button_h1_02.png',
			'img/home/intro_game_button_h1_01.png',
			'img/home/info_h1.png',
			'img/home/customize_img_07.png',
			'img/home/customize_img_06.png',
			'img/home/customize_img_05.png',
			'img/home/customize_img_04.png',
			'img/home/customize_img_03.png',
			'img/home/customize_img_02.png',
			'img/home/customize_img_01.png',
			'img/home/customize_h1_bk_02.png',
			'img/home/customize_h1_bk_01.png',
			'img/home/customize_h1_02.png',
			'img/home/customize_h1_01.png',
			'img/home/customize_caption_text_02.png',
			'img/home/customize_caption_text_01.png',
			'img/home/customize_caption_bk.png'
		];
		var preload = new createjs.LoadQueue(true);
		preload.setMaxConnections(4);
		preload.addEventListener('progress',function(event){
			var progress = event.progress*90;
			$('#loading .inner .progress').css('width',progress+'%');
		});
		preload.addEventListener('complete',function(){
			opening();
		});
		if(Modernizr.touchevents){
			preload.loadManifest(manifest_sp);
		}else{
			preload.loadManifest(manifest);
		}
	}

	//オープニング
	function opening(){
		$('#loading .inner .progress').velocity({
			width: '100%'
		},{delay:0,duration:1000,easing:"easeInSine",complete:function(){
			$('#bgm').prop("volume",0);
			if(!Modernizr.touchevents){
				$('#bgm')[0].play();
				var now_volume = 0;
				var fadein_cnt = 0;
				var fadein_speed = volume / 500;
				var bgm_fadeIn = setInterval(function(){
					fadein_cnt++;
					now_volume = now_volume + fadein_speed;
					$('#bgm').prop("volume",now_volume);
					//
					if(fadein_cnt >= 100){
						clearInterval(bgm_fadeIn);
					}
				},15);
			}
		}});
		$('#loading p').velocity({opacity: 0},{delay:900,duration:300});
		$('#loading .inner').velocity({width: 0},
		{delay:1000,duration:400,complete:function(){
			$('#loading').hide();
		}});
		//
		$('#effect').velocity({borderRightWidth: 0},{delay:1450,duration:800,queue:false});
		$('#effect').velocity({borderTopWidth: 0},{delay:1450,duration:1300,queue:false,complete:function(){
			inview();
		}});
		//
		$('#jumbotron #sale .bk').velocity({borderLeftWidth: '580px'},{delay:2000,duration:500,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #sale .bk').velocity({borderBottomWidth: '500px'},{delay:2000,duration:700,easing:'easeInOutCubic',queue:false});
		$.Velocity.hook($('#jumbotron #sale > h1'),'translateX','-30px');
		$.Velocity.hook($('#jumbotron #sale > h2'),'translateX','-30px');
		$.Velocity.hook($('#jumbotron #sale .item'),'translateX','-30px');
		$('#jumbotron #sale .item_01').velocity({opacity:1,translateX: 0},{delay:2400,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #sale .item_02').velocity({opacity:1,translateX: 0},{delay:2500,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #sale > h1').velocity({opacity:1,translateX: 0},{delay:2600,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #sale > h2').velocity({opacity:1,translateX: 0},{delay:2600,duration:700,easing:'easeInOutCubic',queue:false});
		//
		$.Velocity.hook($('#jumbotron #info > h1'),'translateX','30px');
		$.Velocity.hook($('#jumbotron #info .item'),'translateX','30px');
		$.Velocity.hook($('#jumbotron #info .more'),'translateX','30px');
		$('#jumbotron #info > h1').velocity({opacity:1,translateX: 0},{delay:2500,duration:700,easing:'easeInOutCubic',queue:false});
		cnt = 0;
		$('#jumbotron #info .item,#jumbotron #info .more').each(function(){
			$(this).velocity({opacity:1,translateX: 0},{delay:2700+(cnt*100),duration:700,easing:'easeInOutCubic',queue:false});
			cnt++;
		});
		//
		$.Velocity.hook($('#jumbotron #banner div'),'translateX','-30px');
		$.Velocity.hook($('#jumbotron #banner_footer div'),'translateX','-30px');
		$('#jumbotron #banner div').eq(0).velocity({opacity:1,translateX: 0},{delay:2600,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #banner div').eq(1).velocity({opacity:1,translateX: 0},{delay:2800,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #banner div').eq(2).velocity({opacity:1,translateX: 0},{delay:3000,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #banner div').eq(3).velocity({opacity:1,translateX: 0},{delay:3200,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #banner div').eq(4).velocity({opacity:1,translateX: 0},{delay:3400,duration:700,easing:'easeInOutCubic',queue:false});
		$('#jumbotron #banner_footer div').velocity({opacity:1,translateX: 0},{delay:3600,duration:700,easing:'easeInOutCubic',queue:false});
	}
	
	var effect_flag = false;
	$('a.effect').click(function(e){
		if(effect_flag) return false;
		effect_flag = true;
		var href = $(this).attr('href');
		//
		$('#effect').velocity({borderRightWidth: '200vw'},{duration:700,queue:false});
		$('#effect').velocity({borderTopWidth: '200vh'},{duration:150,queue:false});
		//
		var now_volume = volume / 5;
		var fadeout_speed = now_volume / 100;
		var fadeout_cnt = 0;
		var bgm_fadeout = setInterval(function(){
			fadeout_cnt++;
			now_volume = now_volume - fadeout_speed;
			if(now_volume < 0) now_volume = 0;
			$('#bgm').prop("volume",now_volume);
			//
			if(fadeout_cnt > 110){
				location.href = href;
				clearInterval(bgm_fadeout);
			}
		},15);
		return false;
	});
	
	//インビュー関連
	function inview(){
		//トップページ
		$('.section_box .header').on('inview',function(){
			$.Velocity.hook($(this).find('h1'),'translateX','-30px');
			$.Velocity.hook($(this).find('.bk'),'translateX','-100%');
			$(this).find('h1').velocity({opacity: 1,translateX: 0},{delay:400,duration:700,easing:'easeOutSine',queue:false});
			$(this).find('.bk').velocity({translateX: 0},{delay:0,duration:800,easing:'easeInOutQuint',queue:false});
			$(this).off();
		});
		//トップページ・ゲーム概要・ルール
		$('#introduction .nav').on('inview',function(){
			cnt = 0;
			$.Velocity.hook($('#introduction .nav li'),'translateX','-30px');
			$('#introduction .nav li').each(function(){
				$(this).velocity({opacity:1,translateX: 0},{delay:100+(cnt*100),duration:700,easing:'easeInOutCubic',queue:false,complete:function(){
					$(this).addClass('end');
				}});
				cnt++;
			});
			$(this).off();
		});
		$('#intro_game .rule').on('inview',function(){
			$.Velocity.hook($('#introduction .rule > h1'),'translateX','-30px');
			$.Velocity.hook($('#introduction .rule .thumbnail'),'translateX','-30px');
			$.Velocity.hook($('#introduction .rule > p'),'translateX','-30px');
			$.Velocity.hook($('#introduction .rule .item'),'translateX','-30px');
			//
			$('#introduction .rule .thumbnail').velocity({opacity: 1,translateX: 0},{delay:200,duration:700,easing:'easeOutSine',queue:false,complete:function(){
				$('#introduction .rule .shadow').addClass('active');
			}});
			$('#introduction .rule > h1').velocity({opacity: 1,translateX: 0},{delay:300,duration:700,easing:'easeOutSine',queue:false});
			$('#introduction .rule > p').velocity({opacity: 1,translateX: 0},{delay:400,duration:700,easing:'easeOutSine',queue:false});
			//
			cnt = 0;
			$('#introduction .rule .item').each(function(){
				$(this).velocity({opacity:1,translateX: 0},{delay:500+(cnt*80),duration:700,easing:'easeInOutCubic',queue:false});
				cnt++;
			});
			$(this).off();
		});
		$('#intro_game .button_mode').on('inview',function(){
			$.Velocity.hook($('#introduction .button_mode > h2'),'translateX','-30px');
			$.Velocity.hook($('#introduction .button_mode > h2 .en'),'translateX','-30px');
			$.Velocity.hook($('#introduction .button_mode > h2 .jp'),'translateX','-30px');
			$.Velocity.hook($('#introduction .button_mode .item'),'translateX','-30px');
			//
			$('#introduction .button_mode > h2').velocity({opacity: 1,translateX: 0},{delay:300,duration:700,easing:'easeOutSine',queue:false});
			$('#introduction .button_mode > h2 .bk').velocity({width: '290px'},{delay:900,duration:400,easing:'easeOutSine',queue:false});
			$('#introduction .button_mode > h2 .en').velocity({opacity: 1,translateX: 0},{delay:1100,duration:400,easing:'easeOutSine',queue:false});
			$('#introduction .button_mode > h2 .jp').velocity({opacity: 1,translateX: 0},{delay:1200,duration:400,easing:'easeOutSine',queue:false});
			//
			cnt = 0;
			$('#introduction .button_mode .item').each(function(){
				$(this).velocity({opacity:1,translateX: 0},{delay:500+(cnt*80),duration:700,easing:'easeInOutCubic',queue:false});
				cnt++;
			});
			$(this).off();
		});
		//モード一覧
		$.Velocity.hook($('#intro_mode .item h1'),'translateX','-30px');
		$.Velocity.hook($('#intro_mode .item .en'),'translateX','-30px');
		$.Velocity.hook($('#intro_mode .item .jp'),'translateX','-30px');
		$.Velocity.hook($('#intro_mode .item li'),'translateX','-30px');
		$.Velocity.hook($('#intro_mode .item p'),'translateX','-30px');
		$('#intro_mode .item').on('inview',function(){
			$(this).find('h1').velocity({opacity: 1,translateX: 0},{delay:0,duration:700,easing:'easeOutSine',queue:false});
			var this_width = $(this).find('.bk').attr('data-width');
			$(this).find('.bk').velocity({width: this_width},{delay:600,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.en').velocity({opacity: 1,translateX: 0},{delay:800,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.jp').velocity({opacity: 1,translateX: 0},{delay:900,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(0).velocity({opacity: 1,translateX: 0},{delay:1000,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(1).velocity({opacity: 1,translateX: 0},{delay:1080,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(2).velocity({opacity: 1,translateX: 0},{delay:1160,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('p').velocity({opacity: 1,translateX: 0},{delay:1200,duration:400,easing:'easeOutSine',queue:false});
			$(this).off();
		});
		//ゲームカスタマイズ
		$.Velocity.hook($('#intro_customize .item h1'),'translateX','-30px');
		$.Velocity.hook($('#intro_customize .item .en'),'translateX','-30px');
		$.Velocity.hook($('#intro_customize .item .jp'),'translateX','-30px');
		$.Velocity.hook($('#intro_customize .item li'),'translateX','-30px');
		$.Velocity.hook($('#intro_customize .item h2'),'translateX','-30px');
		$.Velocity.hook($('#intro_customize .item p.text'),'translateX','-30px');
		$('#intro_customize .item_01').on('inview',function(){
			$(this).find('h1').velocity({opacity: 1,translateX: 0},{delay:0,duration:700,easing:'easeOutSine',queue:false});
			var this_width = $(this).find('.bk').attr('data-width');
			$(this).find('.bk').velocity({width: this_width},{delay:600,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.en').velocity({opacity: 1,translateX: 0},{delay:800,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.jp').velocity({opacity: 1,translateX: 0},{delay:900,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(0).velocity({opacity: 1,translateX: 0},{delay:1000,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(1).velocity({opacity: 1,translateX: 0},{delay:1080,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(2).velocity({opacity: 1,translateX: 0},{delay:1160,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(3).velocity({opacity: 1,translateX: 0},{delay:1240,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('h2').velocity({opacity: 1,translateX: 0},{delay:1280,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('p.text').velocity({opacity: 1,translateX: 0},{delay:1480,duration:400,easing:'easeOutSine',queue:false});
			$(this).off();
		});
		$('#intro_customize .item_02').on('inview',function(){
			$(this).find('h1').velocity({opacity: 1,translateX: 0},{delay:0,duration:700,easing:'easeOutSine',queue:false});
			var this_width = $(this).find('.bk').attr('data-width');
			$(this).find('.bk').velocity({width: this_width},{delay:600,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.en').velocity({opacity: 1,translateX: 0},{delay:800,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('.jp').velocity({opacity: 1,translateX: 0},{delay:900,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(0).velocity({opacity: 1,translateX: 0},{delay:1000,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(1).velocity({opacity: 1,translateX: 0},{delay:1080,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('li').eq(2).velocity({opacity: 1,translateX: 0},{delay:1160,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('h2').velocity({opacity: 1,translateX: 0},{delay:1200,duration:400,easing:'easeOutSine',queue:false});
			$(this).find('p.text').velocity({opacity: 1,translateX: 0},{delay:1400,duration:400,easing:'easeOutSine',queue:false});
			$(this).off();
		});
		//スペック
		$('#spec').on('inview',function(){
			$.Velocity.hook($('#spec .item'),'translateX','-30px');
			$.Velocity.hook($('#spec .item h1'),'translateX','-30px');
			$.Velocity.hook($('#spec .item p'),'translateX','-30px');
			//
			cnt = 0;
			$('#spec .item').each(function(){
				$(this).velocity({opacity:1,translateX: 0},{delay:100+(cnt*80),duration:700,easing:'easeInOutCubic',queue:false});
				$(this).find('.bk').velocity({width: '160px'},{delay:200+(cnt*80),duration:400,easing:'easeInOutCubic',queue:false});
				$(this).find('h1').velocity({opacity:1,translateX: 0},{delay:300+(cnt*80),duration:400,easing:'easeInOutCubic',queue:false});
				$(this).find('p').velocity({opacity:1,translateX: 0},{delay:400+(cnt*80),duration:400,easing:'easeInOutCubic',queue:false});
				cnt++;
			});
			$(this).off();
		});
	}
	
	//過去のお知らせモーダル
	$('#info .more').on('click',function(){
		$('#modal_info .inner').velocity({opacity: 0,translateY: '-80px'},{delay:0,duration:0,easing:'easeOutSine',queue:false});
		$('#modal_info').velocity('fadeIn',400);
		$('#modal_info .inner').velocity({opacity: 1,translateY: '0'},{delay:300,duration:700,easing:'easeOutSine',queue:false});
	});
	$('#modal_info').on('click',function(){
		$('#modal_info').velocity('fadeOut',300);
	});
	$('#modal_info .inner').on('click',function(e){
		e.stopPropagation();
	});
	
	//祝典イラストモーダル
	$('.celebration').on('click',function(){
		$('#modal_illust .inner').velocity({opacity: 0,translateY: '-80px'},{delay:0,duration:0,easing:'easeOutSine',queue:false});
		$('#modal_illust').velocity('fadeIn',400);
		$('#modal_illust .inner').velocity({opacity: 1,translateY: '0'},{delay:300,duration:700,easing:'easeOutSine',queue:false});
	});
	$('#modal_illust').on('click',function(){
		$('#modal_illust').velocity('fadeOut',300);
	});
	
	//ゲーム紹介タブ切り替え
	var gameintroduction = 0;
	$('#introduction .nav li.intro_toggle').on('click',function(){
		gameintroduction = $('#introduction .nav li').index($(this));
		$('#introduction .nav li').removeClass('active');
		$(this).addClass('active');
		if(gameintroduction === 0){
			$('#introduction > .inner').css('height','1950px');
			$('#intro_mode,#intro_customize').velocity('fadeOut',{duration:500,queue:false});
			$('#intro_game').velocity('fadeIn',{delay:500,duration:500,queue:false});
		}
		if(gameintroduction === 1){
			$('#introduction > .inner').css('height','3030px');
			$('#intro_game,#intro_customize').velocity('fadeOut',{duration:500,queue:false});
			$('#intro_mode').velocity('fadeIn',{delay:500,duration:500,queue:false});
		}
		if(gameintroduction === 2){
			$('#introduction > .inner').css('height','1979px');
			$('#intro_game,#intro_mode').velocity('fadeOut',{duration:500,queue:false});
			$('#intro_customize').velocity('fadeIn',{delay:500,duration:500,queue:false});
		}
	});
	
	//Youtube背景スタート
	background_risize();
	background_play();
	function background_play(){
		var youtubeID = 'M--NPU3g1Vw';
		var player;
		var opad;
		var scriptTag = document.createElement('script');
		scriptTag.src = "https://www.youtube.com/player_api";
		var fsTag = document.getElementsByTagName('script')[0];
		fsTag.parentNode.insertBefore(scriptTag,fsTag);
		window.onYouTubePlayerAPIReady = function(){
			player = new YT.Player('background_movie',{
				height: '400',
				width: '640',
				videoId: youtubeID,
				playerVars: {
					rel: 0,
					controls: 0,//control表示しない
					disablekb: 0,
					modestbranding: 1,
					//loop: 1,
					showinfo: 0,
					//playlist: youtubeID,
					iv_load_policy: 3 //アノテーション無効
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
		};
		function onPlayerReady(e){
			e.target.playVideo();
			e.target.mute();
		}
		function onPlayerStateChange(e){
			var status = e.target.getPlayerState();
			if(status === 0) e.target.seekTo(0);
		}
	}
	function background_risize(){
		var window_w = $(window).width();
		var window_h = $(window).height() + 20;
		var movie_w = window_h / 0.5625;
		var movie_h = window_h;
		if(movie_w < window_w){
			movie_w = window_w;
			movie_h = window_w * 0.5625;
		}
		var movie_ml = (movie_w - window_w) / -2;
		$('#background').css({
			height: movie_h+'px',
			width: movie_w+'px'
		});
		$('#background_movie').css({marginLeft: movie_ml+'px'});
	}
	$(window).resize(function(){
		background_risize();
	});
	
	//スクロール量でのイベント
	var visual_blur = false;
	var visual_fade = false;
	scroll_event();
	$(window).on('scroll',function(){scroll_event();});
	function scroll_event(){
		var scr_count = $(document).scrollTop();
		if(scr_count < 300){
			if(visual_blur){
				visual_blur = false;
				$('#background_movie,#background .wrapper').removeClass('blur');
				//$('#background .wrapper').removeClass('blur');
			}
		}else{
			if(!visual_blur){
				visual_blur = true;
				$('#background_movie,#background .wrapper').addClass('blur');
				//$('#background .wrapper').addClass('blur');
			}
		}
		if(scr_count < 1){
			if(visual_fade){
				visual_fade = false;
				$('#please_scroll,#info,#sale,#banner,#banner_footer').velocity('fadeIn',300);
			}
		}else{
			if(!visual_fade){
				visual_fade = true;
				$('#please_scroll,#info,#sale,#banner,#banner_footer').velocity('fadeOut',300);
			}
		}
		if(true){
			var winh = $(window).height();
			var content_scroll = scr_count - (winh / 2) -75;
			var this_translateY = 0;
			//parallax_1
			this_translateY = ((0 - content_scroll) * 1.5) + (winh/2);
			$.Velocity.hook($('.parallax_01'),'translateY',this_translateY+'px');
			//parallax_2
			this_translateY = ((600 - content_scroll) * 0.6) + (winh/2);
			$.Velocity.hook($('.parallax_02'),'translateY',this_translateY+'px');
			//parallax_3
			this_translateY = ((1500 - content_scroll) * 1.5) + (winh/2);
			$.Velocity.hook($('.parallax_03'),'translateY',this_translateY+'px');
			//parallax_4
			if(gameintroduction === 0) this_translateY = ((2180 - content_scroll) * 1.5) + (winh/2);
			if(gameintroduction === 1) this_translateY = ((3260 - content_scroll) * 1.5) + (winh/2);
			if(gameintroduction === 2) this_translateY = ((2209 - content_scroll) * 1.5) + (winh/2);
			$.Velocity.hook($('.parallax_04'),'translateY',this_translateY+'px');
			//parallax_5
			this_translateY = ((2200 - content_scroll) * 0.6) + (winh/2);
			$.Velocity.hook($('.parallax_05'),'translateY',this_translateY+'px');
		}
	}

	//アンカーリンク
	$('a[href^=#]').on('click',function(){
		var href = $(this).attr("href");
		var target = $(href == "#" || href === "" ? 'html' : href);
		var position = target.get(0).offsetTop;
		if(href == '#game_introduction'){
			position = $(window).height() - 50;
		}
		$('html,body').velocity("stop");
		$('html,body').velocity("scroll",{offset:position,duration:600});
		return false;
	});

});