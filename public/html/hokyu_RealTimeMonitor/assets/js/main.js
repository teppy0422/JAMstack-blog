(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// Sidebar.
		var $sidebar = $('#sidebar'),
			$sidebar_inner = $sidebar.children('.inner');

		// Inactive by default on <= large.
			breakpoints.on('<=large', function() {
				$sidebar.addClass('inactive');
			});

			breakpoints.on('>large', function() {
				$sidebar.removeClass('inactive');
			});

		// Hack: Workaround for Chrome/Android scrollbar position bug.
			if (browser.os == 'android'
			&&	browser.name == 'chrome')
				$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
					.appendTo($head);

		// Toggle.
			$('<a href="#sidebar" class="toggle">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Toggle.
						$sidebar.toggleClass('inactive');

				});

		// Events.

			// Link clicks.
				$sidebar.on('click', 'a', function(event) {
					// >large? Bail.
						if (breakpoints.active('>large'))
							return;
					// Vars.
						var $a = $(this),
							href = $a.attr('href'),
							target = $a.attr('target');
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();
					// Check URL.
						if (!href || href == '#' || href == '')
							return;
					// Hide sidebar.
						$sidebar.addClass('inactive');
					// Redirect to href.
						setTimeout(function() {
							if (target == '_blank')
								window.open(href);
							else
								window.location.href = href;
						}, 500);
				});
			// Prevent certain events inside the panel from bubbling.
				$sidebar.on('click touchend touchstart touchmove', function(event) {
					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Prevent propagation.
						event.stopPropagation();
				});

			// Hide panel on body click/tap.
				$body.on('click touchend', function(event) {
					// >large? Bail.
						if (breakpoints.active('>large'))
							return;
					// Deactivate.
						$sidebar.addClass('inactive');
				});
		// Scroll lock.
		// Note: If you do anything to change the height of the sidebar's content, be sure to
		// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.
			$window.on('load.sidebar-lock', function() {
				var sh, wh, st;
				// Reset scroll position to 0 if it's 1.
					if ($window.scrollTop() == 1)
						$window.scrollTop(0);
				$window
					.on('scroll.sidebar-lock', function() {
						var x, y;
						// <=large? Bail.
							if (breakpoints.active('<=large')) {
								$sidebar_inner
									.data('locked', 0)
									.css('position', '')
									.css('top', '');
								return;
							}
						// Calculate positions.
							x = Math.max(sh - wh, 0);
							y = Math.max(0, $window.scrollTop() - x);
						// Lock/unlock.
							if ($sidebar_inner.data('locked') == 1) {
								if (y <= 0)
									$sidebar_inner
										.data('locked', 0)
										.css('position', '')
										.css('top', '');
								else
									$sidebar_inner
										.css('top', -1 * x);
							}
							else {
								if (y > 0)
									$sidebar_inner
										.data('locked', 1)
										.css('position', 'fixed')
										.css('top', -1 * x);
							}
					})
					.on('resize.sidebar-lock', function() {
						// Calculate heights.
							wh = $window.height();
							sh = $sidebar_inner.outerHeight() + 30;
						// Trigger scroll.
							$window.trigger('scroll.sidebar-lock');
					})
					.trigger('resize.sidebar-lock');
				});
	// Menu.
	var $menu = $('#menu'),
		$menu_openers = $menu.children('ul').find('.opener');
	// Openers.
	$menu_openers.each(function() {
		var $this = $(this);
		$this.on('click', function(event) {
			// Prevent default.
			event.preventDefault();
			// Toggle.
			$menu_openers.not($this).removeClass('active');
			$this.toggleClass('active');
			// Trigger resize (sidebar lock).
			$window.triggerHandler('resize.sidebar-lock');
		});
	});
})(jQuery);

function load(){
	var queryString = window.location.search;
	var page = null; // pageを初期化
	var navi = null; // menuのlistをクリック
	var navi2 = null; // menuのlistの中をクリック
	var menu = null; //menuを非表示ならtrue

	// クエリ文字列が存在する場合、それを解析
	if(queryString){
		queryString = queryString.substring(1); // '?' を除去
		var parameters = queryString.split('&');

		// connector.htmlの形式を期待するための修正
		if (parameters.length == 1 && parameters[0].indexOf('=') == -1) {
			page = parameters[0]; // '='がない場合、ページ全体をパラメータとして使用
		} else {
			// 通常のクエリパラメータ解析
			for (var i = 0; i < parameters.length; i++) {
				var element = parameters[i].split('=');
				var paramName = decodeURIComponent(element[0]);
				var paramValue = decodeURIComponent(element[1]);
				if (paramName === 'page') {
					page = paramValue;
					// break; // 'page'パラメータを見つけたらループを抜ける
				}else if(paramName === 'navi'){
					navi = paramValue;
				}else if(paramName === 'navi2'){
					navi2 = paramValue;
				}else if(paramName === 'menu'){
					menu = paramValue;
				}
			}
		}
		// pageが定義されている場合、対応するHTMLを読み込む
		if (page) {HTML_Load(page + '?page=' + page, 'main');}
		if (navi){clickElementById(navi);}
		if (navi2){document.getElementById(navi2).classList.add('active');}
	} else {
		// クエリ文字列がない場合のデフォルトページ
		HTML_Load('specification.html?page=specification.html', 'main');
	}
	// JSファイルを動的に読み込む
	var script = document.createElement('script');
	script.src = 'assets/js/main.js'; // JSファイルのURLを指定
	document.body.appendChild(script);
}			
function clickElementById(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.click();
    } else {
        console.log('Element with id ' + elementId + ' does not exist.');
    }
}
function addClassToElementById(elementId, className) {
    var element = document.getElementById(elementId);
    if (element) { // 要素が存在する場合のみ実行
        element.classList.add(className);
    }
}
var state = "";
var audio_finish = new Audio('assets/audio/finish.mp3');
var audioPlaying = false;  // オーディオが再生中かどうかを追跡するフラグ
// 自動音声再生を有効する為にユーザーにクリックしてもらう
function readyAudioPlay() {
    const audio_00 = document.getElementById('notificationSound');
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function() {
        if (!audioPlaying) {
            audio_00.play();
            audioPlaying = true;  // オーディオが再生中状態に設定
            console.log("true");
            startButton.setAttribute('title', "音声を無効");
        } else {
            audio_00.pause();
            audio_00.currentTime = 0;
            audioPlaying = false;  // オーディオが停止状態に設定
            console.log("false");
            startButton.setAttribute('title', "音声を有効");
        }
    });
}
function readClickEvent(){
	document.getElementById('startButton').addEventListener('click', function() {
		this.classList.toggle('startButtonColor'); 
	});
}
// ajaxを使って要素の置換え
function HTML_Load(_html, id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", _html, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = xmlhttp.responseText;
            var elem = document.getElementById(id);
            elem.innerHTML = data;
            window.scrollTo(0, 0);
            var pos = _html.indexOf('?');
            state = _html.substring(pos);
            history.replaceState('', '', state);
            // Ajaxで読み込んだ後に実行する処理
            afterContentLoad(state);
        }
    }
    xmlhttp.send(null);
}
// 'label'タグ全体に対してクリックイベントリスナーを設定
var ejectButton = document.querySelector('.eject');
if (ejectButton) {
    ejectButton.addEventListener('click', function(event) {
        // イベントの伝播を停止
        event.stopPropagation();
        // 'rotate-icon' IDを持つ要素を特定して、'rotated'クラスをトグル
        var icon = document.getElementById('rotate-icon');
        if (icon) {
            icon.classList.toggle('rotated');
        }
    });
}
// ページを読み込んだ後に実行
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('dblclick', function(event) {
        // .InspectionReadyクラスを持つ要素がクリックされたかを確認
		if (event.target.classList.contains('InspectionReady')) {
            event.target.classList.toggle('clicked'); // .clickedクラスの切り替え
			// innerTextがPreparedの場合はAwaitingに、そうでない場合はPreparedに切り替える
			event.target.innerText = (event.target.innerText === "Prepared") ? "Awaiting" : "Prepared";
		}
		if (event.target.classList.contains('InspectionCompleted')) {
            event.target.classList.toggle('clicked'); // .clickedクラスの切り替え
			// innerTextがPreparedの場合はAwaitingに、そうでない場合はPreparedに切り替える
			event.target.innerText = (event.target.innerText === "Completed") ? "Awaiting" : "Completed";
		}
		saveInspectionStatus();
    });
});
//ajax読み込み後に実行したい場合
function afterContentLoad(state_) {
	stopAllIntervals();
	var extracted = state_.split('=')[1].split('.')[0];
	switch(extracted) {
		case 'inspection':
			getData(state_);
			displayCurrentTime();
			startProgressCount();
			setupDataInterval();
			readClickEvent();
		break;
	}
	getTheme();
	readyAudioPlay();
}
var dataInterval; // グローバルスコープにインターバルを保持
function setupDataInterval() {
    if (!dataInterval) {
        dataInterval = setInterval(getData, 60000);
		intervalIds.push(dataInterval);
    }
}
function getData() {
    let filePath = 'php/productStatus.txt';
    if (!filePath) {
        console.error(filePath + 'が取得できません');
        return;
    }
    fetch(filePath + '?t=' + new Date().getTime())
        .then(response => response.text())
        .then(data => {
            data = data.replace(/\r/g, ''); // 改行コードの正規化
            const rows = data.trim().split('\n').slice(1); // 1行目を除外して分割
            // フィールド名を表す配列を定義する
            const fieldNames = ["id", "product", "model", "circuitCount", "quantity", "person", "time", "inspectionReady", "inspectionCompleted"];
            // データを時間でソートする
            rows.sort((a, b) => {
                const timeA = new Date(a.split(',')[fieldNames.indexOf("time")]);
                const timeB = new Date(b.split(',')[fieldNames.indexOf("time")]);
                return timeA - timeB;
            });
            const tableBody = document.querySelector('.inspectionList tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            rows.forEach(row => {
                const cells = row.split(','); // Split data into cells
                const newRow = tableBody.insertRow(); // Create a new row
                cells.forEach((cell, i) => {
                    const newCell = newRow.insertCell(); // Add new cell to the row
					if (fieldNames[i] === "id"){
                        // newCell.style = "display:none";
                        newCell.textContent = cell;
						newCell.classList.add('targetID');
					} else if (fieldNames[i] === "time") {
                        let timeValue = formatCountdown(cells[i]);
                        if (timeValue == "00:00:00"){
                            newCell.textContent = "Finished";
                            newCell.classList.add('finish');
                        } else {
                            newCell.textContent = timeValue;
                            newCell.classList.add('countdown');
                        }
                    } else if (fieldNames[i] === "inspectionReady"){
                        if (cells[i] === '1'){
                            newCell.textContent = "Prepared";
                            newCell.classList.add('clicked');
                        } else {
                            newCell.textContent = "Awaiting";  
                        }
                        newCell.classList.add('InspectionReady');
                    } else if (fieldNames[i] === "inspectionCompleted"){
                        if (cells[i] === '1') {
                            newCell.textContent = "Completed";
                            newCell.classList.add('clicked');
                        } else {
                            newCell.textContent = "Awaiting";
                        }
                        newCell.classList.add('InspectionCompleted');
                    } else {
                        newCell.textContent = cell;
                    }
                });
            });
            updateCountdown();
            updateProgressBars();
            resetProgressCount();    
        })
        .catch(error => console.error('Failed to load the file:', error));
}
function updateProgressBars() {
    const maxTime = 2 * 60 * 60; // 最大秒数（2時間）
    document.querySelectorAll('.countdown').forEach(cell => {
        const timeParts = cell.textContent.split(':');
        const seconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
        const percentage = (seconds / maxTime) * 100; // 残り時間に基づいてパーセンテージを計算
        cell.style.background = `linear-gradient(to right, rgba(255, 0, 0, 0.5) ${percentage}%, transparent ${percentage}%)`;
        cell.style.backgroundClip = 'padding-box';  // 背景をパディングボックス内に制限
    });
}
function updateCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(cell => {
		let dateString = cell.textContent;
		if (dateString !== "Complete"){
			let parts = cell.textContent.split(':');
			let totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);	
			const intervalId = setInterval(() => {
				totalSeconds--;  // 総秒数を1減らす
				let hours = Math.floor(totalSeconds / 3600);
				let minutes = Math.floor((totalSeconds % 3600) / 60);
				let seconds = totalSeconds % 60;	
				if (totalSeconds <= 0) {
					clearInterval(intervalId);
					cell.textContent = "Complete";
					cell.classList.add('finished');
					if (audioPlaying === true){audio_finish.play();}
				} else {
					cell.textContent = [hours, minutes, seconds].map(v => String(v).padStart(2, '0')).join(':');
				}
			}, 1000);
			intervalIds.push(intervalId);
		}
    });
}

function formatCountdown(timeStr) {
    const endTime = new Date(timeStr); // ISO形式の日時文字列をDateオブジェクトに変換
    const now = new Date();
    let diff = endTime - now;
    if (diff <= 0) {
        return "00:00:00";
    }
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 時間を二桁表示にフォーマット
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}
// 60秒のカウントダウン
var progressInterval; 
var reloadCountValue = 60;
function startProgressCount() {
    clearInterval(progressInterval); // 既存のインターバルをクリア
    // 初期カウントダウンの設定
    // カウントダウンのタイマーをセットアップ
    var timer = setInterval(function() {
        // カウントダウンを1減らす
        reloadCountValue--;
        // カウントダウンテキストを更新
		document.querySelector('.CountDowntxt span').textContent = reloadCountValue;
        // カウントダウンが0になったらリセット
        if (reloadCountValue <= 0) {
            reloadCountValue = 60;
        }
    }, 1000);
	intervalIds.push(timer);
}
function resetProgressCount(){
	reloadCountValue = 60;
}
// ダークモード
function toggleTheme() {
	var element = document.getElementById('theme-toggle');
	document.body.classList.toggle('dark-theme');
	if (document.body.classList.contains('dark-theme')) {
		element.classList.remove('fa-moon');
		element.classList.add('fa-sun');
		element.setAttribute('title', 'ライトモードに切り替える'); // titleの内容を変更
		localStorage.setItem('theme', 'dark');
	} else {
		element.classList.remove('fa-sun');
		element.classList.add('fa-moon');
		element.setAttribute('title', 'ダークモードに切り替える'); // titleの内容を変更
		localStorage.setItem('theme', 'light');
	}
}
  // ページ読み込み時にテーマ状態を適用
function getTheme(){
	var currentTheme = localStorage.getItem('theme');
	var element = document.getElementById('theme-toggle');
	if (currentTheme === 'dark') {
		document.body.classList.add('dark-theme');
		element.classList.add('fa-sun');
		element.classList.remove('fa-moon');
		element.setAttribute('title', 'ライトモードに切り替える');
	} else {
		document.body.classList.remove('dark-theme');
		element.classList.add('fa-moon');
		element.classList.remove('fa-sun');
		element.setAttribute('title', 'ダークモードに切り替える');
	}
};
// 指定したURLからデータを取得する関数
function fetchData(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			callback(xhr.responseText);
		}
	};
	xhr.open('GET', url, true);
	xhr.send();
}
// 現在時刻を表示し、1分ごとに更新する関数
function displayCurrentTime() {
	fetchData('assets/php/get_time.php', function(response) {
		document.getElementById('currentTime').textContent = response;
	});
	// 1分ごとに現在時刻を更新
	setTimeout(displayCurrentTime, 60000); // 1分 = 60000ミリ秒
}
// データAを読み込む関数
function loadDataA() {
    return fetch('php/productStatus.txt')
		.then(response => response.text())
		.then(dataA => {
			return convertDataAToArray(dataA);
			// データAの処理を行う関数を呼び出す
			// return processA(dataA);
		});
}
function convertDataAToArray(dataA) {
    // データAを改行で分割し、各行を配列の要素として取得する
    const rows = dataA.split('\n');
    // 配列にデータを格納するための配列を初期化
    const dataArray = [];
    // 各行を処理し、データを配列に格納する
    rows.forEach(row => {
        // 各行をカンマで分割し、各要素を取得
        const rowData = row.split(',');        
        // データをオブジェクトとして格納する
        const dataObject = {
            id: rowData[0],
            product: rowData[1],
            model: rowData[2],
            circuitCount: rowData[3],
            quantity: rowData[4],
            person: rowData[5],
            time: rowData[6],
            inspectionReady: rowData[7],
            inspectionCompleted: rowData[8]
        };        
        // データオブジェクトを配列に追加する
        dataArray.push(dataObject);
    });
    // 配列として処理できるデータができました
    return dataArray;
}
// データBを取得する関数
function getDataB() {
    const rowsC = document.querySelectorAll('#saveTarget tr');
    const dataB = [];
    rowsC.forEach(row => {
        const id = row.querySelector('.targetID').textContent;
        const product = row.cells[1].textContent;
        const model = row.cells[2].textContent;
        const circuitCount = row.cells[3].textContent;
        const quantity = row.cells[4].textContent;
        const person = row.cells[5].textContent;
        const time = row.cells[6].textContent;
        let inspectionReady = row.querySelector('.InspectionReady').textContent;
        let inspectionCompleted = row.querySelector('.InspectionCompleted').textContent;
        // inspectionReadyが"Prepared"なら1に変換
        inspectionReady = inspectionReady === "Prepared" ? "1" : "0";
        // inspectionCompletedが"Completed"なら1に変換
        inspectionCompleted = inspectionCompleted === "Completed" ? "1" : "0";
        dataB.push({
            id,
            product,
            model,
            circuitCount,
            quantity,
            person,
            time,
            inspectionReady,
            inspectionCompleted
        });
    });
    return dataB;
}
function generateNewDataA(dataA, dataB) {
    if (!Array.isArray(dataA)) {
        console.error('データAが配列ではありません。');
        return;
    }
    if (!Array.isArray(dataB)) {
        console.error('データBが配列ではありません。');
        return;
    }
    // 新しいデータAの初期化
    let newDataA = [];
    // データAの各エントリーに対して処理を行う
    dataA.forEach(entryA => {
        // データBの中から対応するIDのエントリーを探す
        const correspondingEntryB = dataB.find(entryB => entryB.id === entryA.id);
        // データBに対応するエントリーが見つかった場合
        if (correspondingEntryB) {
            // 新しいデータAエントリーを作成し、inspectionReadyとinspectionCompletedをデータBの値で上書きする
            const newDataEntryA = {
                ...entryA,
                inspectionReady: correspondingEntryB.inspectionReady,
                inspectionCompleted: correspondingEntryB.inspectionCompleted
            };
            // 新しいデータAに追加
            newDataA.push(newDataEntryA);
        } else {
            // データBに対応するエントリーが見つからない場合はそのまま追加する
            newDataA.push(entryA);
        }
    });
    // 新しいデータAを返す
    return newDataA.length > 0 ? newDataA : true;
}
// データAを新しいファイルに保存する関数
function saveNewDataA(newDataA) {
	fetch('php/productStatusOverWrite.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ newDataA }),
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('データの保存中にエラーが発生しました。');
		}
		return response.text();
	})
	.then(message => {
		console.log(message);
	})
	.catch(error => {
		console.error('エラー:', error);
	});
}
// 準備完了/検査完了をサーバーに保存する
function saveInspectionStatus() {
    loadDataA()
        .then(dataA => {
            const dataB = getDataB();
            const newDataA = generateNewDataA(dataA, dataB);
			// newDataA をCSV形式の文字列に変換
            const csvData = convertToCSV(newDataA);
            // saveNewDataA にCSV文字列として渡す
            saveNewDataA(csvData);
			console.log("dataA",dataA);
			console.log("dataB",dataB);
			console.log("newDataA",newDataA);
        })
        .catch(error => console.error('処理中にエラーが発生しました:', error));
}
// 配列をCSV形式の文字列に変換する関数
function convertToCSV(data) {
    const csvRows = data.map(entry => Object.values(entry).join(','));
    return csvRows.join('\n');
}
//インターバル管理
var intervalIds = [];// すべてのインターバルIDを格納する配列
// すべてのインターバルを停止する関数
function stopAllIntervals() {
    intervalIds.forEach(function(intervalId) {
        clearInterval(intervalId); // インターバルを停止
    });
}