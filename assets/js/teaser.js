$(document).ready(function(){


	//必要な変数
	var window_w = $(window).width();
	var window_h = $(window).height();
	var movie_play_flag = false;
	
	//ローディング
	init();
	function init(){
		//読み込む画像が増えたらindex.htmlからのパスをmanifestに追加してください。
		var manifest = [
			'img/logo_am.gif',
			'img/intro_bk.jpg',
			'img/detail_dt.png',
			'img/detail_h1.png',
			'img/detail_img.png',
			'img/footer_arc.png',
			'img/footer_neowiz.png',
			'img/header_bgm_h.png',
			'img/header_bgm_icon.png',
			'img/header_logo.png',
			'img/header_ps4.png',
			'img/header_share_fb_bk.png',
			'img/header_share_h.png',
			'img/header_share_icon.png',
			'img/header_share_line_bk.png',
			'img/header_share_tw_bk.png',
			'img/information_h1.png',
			'img/into_logo_name.png',
			'img/intro_copy_1_r2.png',
			'img/intro_copy_2_r2.png',
			'img/intro_copy_3_r2.png',
			'img/intro_copy.png',
			'img/intro_logo_g.png',
			'img/intro_logo.png',
			'img/intro_scroll.png',
			'img/movie_thumbnail.png',
			'img/pv_h1.png',
			'bgm/219.mp3'
		];
		var preload = new createjs.LoadQueue(true);
		preload.setMaxConnections(4);
		preload.addEventListener('progress',function(event){
			var progress = 100 - Math.floor(event.progress*99);
			$('#loading .progress').css('width',progress+'%');
		});
		preload.addEventListener('complete',function(){
			opening();
		});
		preload.loadManifest(manifest);
	}

	//オープニング
	function opening(){
		//位置調整
		var pv_pt = ( (window_h - 93 - 600) / 2 ) + 93;
		if(!Modernizr.touchevents) $('#content #pv .inner').css('paddingTop',pv_pt+'px');
		$(window).on('resize',function(){
			window_h = $(window).height();
			var pv_pt = ( (window_h - 93 - 600) / 2 ) + 93;
			if(!Modernizr.touchevents) $('#content #pv .inner').css('paddingTop',pv_pt+'px');
		})
		//
		$('#loading .progress').velocity({width:0},500);
		if(Modernizr.touchevents){
			$('#pv').css({
				height:'auto',
				minHeight:'0',
				paddingTop:'100px',
				paddingBottom:'70px',
			});
			$('#detail').css({
				height:'auto',
				minHeight:'0',
				paddingTop:'70px',
			});
			$('#detail .inner').css({
				paddingTop:'0px'
			});
		}else{
			$.scrollify({
				section : ".section",
				easing: "easeInOutCubic",
				scrollSpeed: 550,
				overflowScroll: true,
				after:function(){
					if(movie_play_flag){
						movie_play_flag = false;
						$('#bgm')[0].play();
						$('#pv .movie').empty();
					}
				}
			});
		}
		$('#loading .logo').velocity({
			opacity: 0
		},{delay:450,duration:500,
			complete:function(){
				$('#bgm').prop("volume",volume/5);
				$('#bgm')[0].play();
				$('#loading').velocity('fadeOut',{delay:500,duration:1500,
					complete:function(){
					particle();
				}});
				$.Velocity.hook($('#background h1'),'translateY','-50px');
				$('#background h1').velocity({
					opacity: 1,
					translateY: 0
				},{delay:1000,duration:800,easing:'easeOutSine',queue:false});
				textanimation();
				var count = setInterval(textanimation,7500);
			}
		});
	}
	
	$(window).on('scroll',function(){
		var scr_count = $(document).scrollTop();
		if(scr_count >= window_h/2){
			$('#header').addClass('bgc_active');
		}else{
			$('#header').removeClass('bgc_active');
		}
	});
	
	//BGM
	var volume = 2;
	var volume_before_mute = 1;
	$('.volume_btn').on('click',function(){
		volume = volume - 1;
		if(volume < 0) volume = 3;
		$('.volume_btn').attr('data-volume',volume);
		$('#bgm').prop("volume",volume/5);
	});
	
	//PV再生
	if(Modernizr.touchevents){
		$('#pv .movie').prepend('<iframe width="960" height="540" src="https://www.youtube.com/embed/l4gvcoHdKvM?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen ></iframe>');
		$('.bgm').hide();
	}else{
		$('#pv .movie').on('click',function(){
			movie_play_flag = true;
			$(this).prepend('<iframe width="960" height="540" src="https://www.youtube.com/embed/l4gvcoHdKvM?rel=0&amp;autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen ></iframe>');
			$('#bgm')[0].pause();
		});
	}
	
	//アンカーリンク
	$('a[href^=#]').on('click',function(){
		var href = $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.get(0).offsetTop;
		$('html,body').velocity("stop");
		$('html,body').velocity("scroll",{offset:position,duration:600});
		return false;
	});

});

//背景で流れる文字
function textanimation(){
	//in
	$.Velocity.hook($('#background h2 .c1'),'translateX','-200px');
	$.Velocity.hook($('#background h2 .c2'),'translateX','-200px');
	$.Velocity.hook($('#background h2 .c3'),'translateX','-200px');
	$('#background h2 .c1').velocity({
		width: '100%',
		translateX: 0
	},{delay:1875,duration:1200,easing:'easeInOutQuint',queue:false});
	$('#background h2 .c2').velocity({
		width: '100%',
		translateX: 0
	},{delay:1975,duration:1200,easing:'easeInOutQuint',queue:false});
	$('#background h2 .c3').velocity({
		width: '100%',
		translateX: 0
	},{delay:2075,duration:1200,easing:'easeInOutQuint',queue:false,
	complete:function(){
		$('#background h2 .c1,#background h2 .c2,#background h2 .c3').css({
			left:'auto',
			right:'0',
			backgroundPositionX:'100%'
		});
	}});
	//out
	$('#background h2 .c1').velocity({
		width: '0',
		translateX: '200px'
	},{delay:5625,duration:1200,easing:'easeInOutQuint',queue:false});
	$('#background h2 .c2').velocity({
		width: '0',
		translateX: '200px'
	},{delay:5725,duration:1200,easing:'easeInOutQuint',queue:false});
	$('#background h2 .c3').velocity({
		width: '0',
		translateX: '200px'
	},{delay:5825,duration:1200,easing:'easeInOutQuint',queue:false,
	complete:function(){
		$('#background h2 .c1,#background h2 .c2,#background h2 .c3').css({
			left:'0',
			right:'auto',
			backgroundPositionX:'0'
		});
		$('#background h2 .c1,#background h2 .c2,#background h2 .c3').velocity({
			translateX: '-200px'
		},0);
	}});
}

//背景の斜線ループ
function particle(){
	//必要な変数
	var window_w = $(window).width();
	var window_h = $(window).height();
	
	$(window).on('resize',function(){
		window_w = $(window).width();
		window_h = $(window).height();
		//[背景]ステージのサイズをウインドウのサイズに修正する
		lo_stage.canvas.width = window_w;
		if(window_w > 1920) lo_stage.canvas.width = 1920;
		lo_stage.canvas.height = window_h;
		up_stage.canvas.width = window_w;
		if(window_w > 1920) up_stage.canvas.width = 1920;
		up_stage.canvas.height = window_h;
	})
	
	//ステージを作る
	var lo_stage = new createjs.Stage("particle_canvas_lo");
	var up_stage = new createjs.Stage("particle_canvas_up");
	//ステージのサイズをウインドウのサイズに修正する
	lo_stage.canvas.width = window_w;
	if(window_w > 1920) lo_stage.canvas.width = 1920;
	lo_stage.canvas.height = window_h;
	up_stage.canvas.width = window_w;
	if(window_w > 1920) up_stage.canvas.width = 1920;
	up_stage.canvas.height = window_h;
	//必要な変数を作る
	var base_size = window_w / 10; //パーティクルの基準サイズ
	var emit_cnt = 0; //パーティクルを発生させるタイミングを図る為の変数
	var particles = []; //各パーティクルの状態を管理する変数

	createjs.Ticker.addEventListener("tick",particle_tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	function particle_tick(event){
		//パーティクルを1つ増やす
		//20回ごとに1回発生。ただし最初の10回は1回ごとに発生。
		if(emit_cnt > 15) emit_cnt = 10;
		if(emit_cnt <= 10){
			particle_emit_lo();
			particle_emit_up();
		}
		emit_cnt++;
		//パーティクルの数値を更新する
		particle_update();
		//パーティクルの数値に沿って実際に表示させる
		lo_stage.update();
		up_stage.update();
	}

	//パーティクルを発生させます
	function particle_emit_lo() {
		//オブジェクトの作成
		var particle = new createjs.Shape();
		//色 = #ffffff
		particle.color = "#ffffff";
		//発生する場所をランダムで決定
		particle.x = ( lo_stage.canvas.width * 2 ) * ( Math.random() );
		particle.start_x = particle.x; //初期位置の保存用
		particle.y = window_h;
		//画面に表示され続ける時間
		particle.delay = 60 * ( 1 - Math.random());
		//サイズをランダムで決定
		particle.size = base_size * (1.3-Math.random());
		//形を指定
		particle.graphics.f(particle.color)
			.lt(particle.size,0)
			.lt(window_h+particle.size,0-window_h)
			.lt(window_h,0-window_h)
			.lt(0,0);
		lo_stage.addChild(particle);
		//進行度カウント
		particle.life = 0;
		//ここまでで宣言したパーティクルを配列に格納
		particles.push(particle);
	}
	function particle_emit_up() {
		//オブジェクトの作成
		var particle = new createjs.Shape();
		//色 = #ffffff
		particle.color = "#ffffff";
		particle.alpha = 0.5;
		//発生する場所をランダムで決定
		particle.x = ( up_stage.canvas.width * 2 ) * ( Math.random() );
		particle.start_x = particle.x; //初期位置の保存用
		particle.y = window_h;
		//画面に表示され続ける時間
		particle.delay = 60 * ( 1 - Math.random());
		//サイズをランダムで決定
		particle.size = base_size * (1.3-Math.random());
		//形を指定
		particle.graphics.f(particle.color)
			.lt(particle.size,0)
			.lt(window_h+particle.size,0-window_h)
			.lt(window_h,0-window_h)
			.lt(0,0);
		up_stage.addChild(particle);
		//進行度カウント
		particle.life = 0;
		//ここまでで宣言したパーティクルを配列に格納
		particles.push(particle);
	}

	//パーティクルを更新します
	function particle_update() {
		//パーティクルの計算を行う
		for (var i = 0; i < particles.length; i++) {
			// オブジェクトの作成
			var particle = particles[i];
			// 位置を動かす
			// 進行度カウントを1増やす
			particle.life += 1;
			//進行度カウントが100まで = 全体を表示するのにかける時間
			if(particle.life < 70){
				var now_progress = jQuery.easing.easeOutExpo(null, particle.life, 0, 1, 69);
				particle.x = particle.start_x - (window_h * now_progress);
				particle.y = window_h * now_progress;
			}
			if(particle.life >= particle.delay + 70){
				var lastlife = particle.life - particle.delay - 70;
				var now_progress = jQuery.easing.easeOutExpo(null, lastlife, 0, 1, 69);
				particle.x = ( particle.start_x - window_h ) - (window_h * now_progress);
				particle.y = window_h + ( window_h * now_progress);
			}
			// 表示時間+表示までにかかる時間+消えるまでにかかる時間の合計を越えたら寿命
			if (particle.life >= particle.delay + 140) {
				// ステージから削除
				lo_stage.removeChild(particle);
				up_stage.removeChild(particle);
				// 配列からも削除
				particles.splice(i, 1);
			}
		}
	}
}
