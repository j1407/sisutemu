var math;
var count;
var answer;
var game;
var reset;
var click_id = "";
var people_position = [[0,0],[9,9],[0,9],[9,0]];
var now = 0; //さいころを振る人
var coma_flag = 0; //振ってから動かすまで
var random_f;
var input;
var fig_haiti;
var point = [0,0,0,0];
var audio = ["./audio/idou.mp3","./audio/money.mp3","./audio/fire.mp3",
"./audio/teki.mp3","./audio/hornet.mp3","./audio/next.mp3"];
var audio0 = new Audio(audio[0]);
var audio1 = new Audio(audio[1]);
var audio2 = new Audio(audio[2]);
var audio3 = new Audio(audio[3]);
var audio4 = new Audio(audio[4]);
var audio5 = new Audio(audio[5]);
var audio_background = new Audio("./audio/wa_001.mp3");
function init(){
    math = 10;
    count = 0;
    game = 1;
    reset = false;
    people_position = [[0,0],[9,9],[0,9],[9,0]];
    now = 0;coma_flag = 0;
    point = [0,0,0,0];
    $('#numberpeople').css('background-color', 'transparent');
    for(var i = 1;i < 4;i++){
        $('#coin' + (i + 1) + '').css('background-color', 'transparent'); 
        $('#cointd' + i + '').text(point[i-1]);
        $('#point' + i + '').text("-");
    }
    $('#cointd4').text(point[3]);
    $('#point4').text("-");
    $('#ran').text((now+1) + 'の番です');
    $('#hint-block p').text('ゲーム番号');
    $('#open-block p').text('正解に近い');
    $('#answer-block p').text('正解のかず');
}
function make_table(height, width){
    var td;
    for(var i = 0;i < height;i++){
        $('#table').append('<tr>');
        for(var j = 0;j < width;j++){
            td = (i*width + j + 1);
            $('#table tr:last').append('<td id="td' + td + '"></td>');
            td -= 1;
            $('#table td').eq(td).css({background: "white"});
        }
        $('#table').append('</tr>');
    }
}
function make_roulette(height, width){
    var td, ans, num;
    var r_select = [];
    var r;
    if(game == 1){
        r = random_create(0,999,height*width).map(Number);
        r_select.push(r);
    }
    else if(game == 2){ // 配列は参照渡しと値渡しがある
        r = random_create(0,999,height*width).map(Number);
        r_select.push(r1 = r.sort(function(a,b){return (a < b ? -1 :  1);}).concat()); //昇順
        r_select.push(r2 = r.sort(function(a,b){return (a < b ?  1 : -1);}).concat()); //降順
        r_select.push(arraylineup(r1));
        r_select.push(arraylineup(r2));
    }
    else if(game == 3){
        var rs = [];
        var s, t, a = [];
        for(var i = 0;i < math*math;i++){
            rs.push(i % math);
        }
        var rt = rs.concat();
        rs = shuffle(rs); //1の位
        rt = shuffle(rt); //10の位
        // 下2桁がいい感じになるように値を生成
        for(var i = 0;i < math*math;i++){
            t = Math.floor(Math.random() * (math-1)); // 0～9 //100の位
            a.push(t * 100 + rt[i] * 10 + rs[i]); //0～999なので1を足す
            // rs[i]の値で色を決める。rt[i]がの大きさで色を決める
        }
        r_select.push(a);
    }
    num = Math.floor( Math.random() * r_select.length);
    if(game==1){
        ans = nonDuplicate(math*math)[0]; // 答えの数
        answer = r[ans];
        fig_haiti = r_select[0];
    }
    else if(game==2 || game == 3){
        ans = nonDuplicate(math*math)[0]; // 答えの数
        answer = r_select[num][ans];
        fig_haiti = r_select[num];
    }
    for(var i = 0;i < height;i++){
        for(var j = 0;j < width;j++){
            td = (i*width + j + 1);
            $('#table tr').eq(i).children('td').eq(j).text(r_select[num][i*width + j]);
        }
    }
}
// 配列の値をシャッフル
function shuffle(array){
    for(var i = array.length - 1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}
// 引数の配列を横だけでなく、縦に並びかえる
function arraylineup(r){
    t = [];
    for(var i = 0;i < math;i++){
        for(var j = 0;j < math;j++){
            t.push(r[j*10+i]);
        }
    }
    return t;
}
function restart(height, width){
    var td, td_p;
    var t = $('#table td');
    for(var i = 0;i < height;i++){
        for(var j = 0;j < width;j++){
            td = (i*width + j + 1);
            $('#table tr').eq(i).children('td').eq(j).text("");
            td_p = i * math + j;
            t.eq(td_p).css({color: "black"});
            t.eq(td_p).css({background: "white"});
        }
    }
}

/*---- 重複のない乱数生成   ---*/
function random_create(min, max, fig){
    var randoms = [];
    var tmp;
    for(i = 0; i < fig; i++){
        while(true){
            tmp = intRandom(min, max);
            if(!randoms.includes(tmp)){
                randoms.push(tmp);
                break;
            }
        }
    }
    return randoms;
}
/** min以上max以下の整数値の乱数を返す */
function intRandom(min, max){
    return Math.floor( Math.random() * (max - min + 1)) + min;
}
// -----------------------------------------------------------------------------------------------
// 重複なしの0～a-1までの数をシャッフルして配列で返す
function nonDuplicate(n){
    var s = [];
    var b = [];
    var j, t;
    var fig = n;
    for(var i = 0;i < n; i++){
        s.push(i);
    }
    while (fig) {
        j = Math.floor( Math.random() * fig );
        b.push(s[j]);
        s.splice(j, 1);
        fig--;
    }
    return b;
}

function make_color(){
    var td = $('#table td'), td_p, s;
    var p = [];
    var num = nonDuplicate(math*math);
    if(game == 1 || game == 2){
        for(var i = 0;i < math;i++){
            for(var j = 0;j < math;j++){
                p.push([i, j]); 
            }
        }
        for(var i = 0;i < math;i++){
            for(var j = 0;j < math;j++){
                td_p = i * math + j;
                td.eq(td_p).css({background: color[p[num[td_p]][0]][p[num[td_p]][1]]});
                td.eq(td_p).css({color: color[p[num[td_p]][0]][p[num[td_p]][1]]});
            }
        }
    }
    else if(game == 3){
        var p1 = [[0,1,2,3,4,5,6,7,8,9],[9,8,7,6,5,4,3,2,1,0]]; // 10の位の数の明るさ
        var p2 = random_create(0, math - 1, math); //  1の位の数の色
        var s1 = [], s2 = [];
        var k = Math.floor( Math.random() * 2);
        for(var i = 0;i < math*math;i++){
            var a = parseInt($('#td'+(i+1)).text());
            s2.push(a % 10); //1の位
            s1.push((a % 100 - a % 10) / 10); //10の位
        }
        for(var i = 0;i < math*math;i++){
            td.eq(i).css({background: color[p2[s2[i]]][p1[k][s1[i]]]});
            td.eq(i).css({color: color[p2[s2[i]]][p1[k][s1[i]]]});
        }
    }
}
function game_start(){
    make_roulette(math, math); // 数字の配置
    people_position = [[0,0],[9,9],[0,9],[9,0]];
    if(game == 1 || game == 2 || game == 3){ // game==3は別のところで生成する
        make_color();              // ランダムに色を生成して配置
    }
    item_haiti();
    $('#numberpeople').css('background-color', '#666');
    $('#hint-block p').text("ゲーム"+game);
    $('#open-block p').text("近くない");
    if(game > 1){
        $('#open-block p').text('-----');
    }
    $('#answer-block p').text(answer);
    for(var i = 1;i < 5;i++){
        $('#point' + i + '').text("-");
    }
    
}

function people_haiti(){
    input = document.getElementById("numberpeople").innerHTML;
    for(var i = 0;i < input;i++){
        $('#td' + (people_position[i][0]*10 + people_position[i][1] + 1) + '').html('<img src="./image/peo' + (i + 1) +'.png">');
    }
    $('#td' + (people_position[now][0]*10 + people_position[now][1] + 1) + '').html('<img src="./image/peo' + (now + 1) +'.png">'); // 重なったときに今動かしてるのが上にくる
    for(var i = 0;i < math*math;i++){
        $('#td' + (i+1) + '').find('img').css('width','40px');
        $('#td' + (i+1) + '').find('img').css('height','40px');
        //$('#td' + (i+1) + '').find('img').css('opacity','0.5');
    }
}

function item_haiti(){ // アイテムの配置を決める
    var coin = 25; // 1
    var bomb = 5; // 2
    var teki = 2; // 3
    var hae  = 5; // 4
    var next = 3; // 5
    aitem = [
        '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','','','','',''
    ];
    item = random_create(0, math*math, 44); // 初期位置と被ったときの対策
    for(var i = 0;i < item.length;i++){
        if(item[i] != 0 && item[i] != 9 && item[i] != 90 && item[i] != 99){
            if(coin > 0){ // 1
                aitem[item[i]] = 1;
                coin-=1;
            }
            else if(bomb > 0){
                aitem[item[i]] = 2;
                bomb-=1;
            }
            else if(teki > 0){
                aitem[item[i]] = 3;
                teki-=1;
            }
            else if(hae > 0){
                aitem[item[i]] = 4;
                hae-=1;
            }
            else if(next > 0){
                aitem[item[i]] = 5;
                next-=1;
            }
        }
    }
    item_re();
}
// アイテムの配置
function item_re(){
    for(var i = 0;i < item.length;i++){
        if(aitem[item[i]] == 1){
            $('#td' + (item[i] + 1) + '').html('<img src="./image/coin.png">');
        }
        if(aitem[item[i]] == 2){
            $('#td' + (item[i] + 1) + '').html('<img src="./image/bomb.png">');
        }
        if(aitem[item[i]] == 3){
            $('#td' + (item[i] + 1) + '').html('<img src="./image/gazer.png">');
        }
        if(aitem[item[i]] == 4){
            $('#td' + (item[i] + 1) + '').html('<img src="./image/hornet.png">');
        }
        if(aitem[item[i]] == 5){
            $('#td' + (item[i] + 1) + '').html('<img src="./image/next.png">');
        }
        $('#td' + (i+1) + '').find('img').css('width','45px');
        $('#td' + (i+1) + '').find('img').css('height','45px');
    }
}
// この辺はまた表示なども含めて考える
function aitem_kouka(i){
    var coin_pm = 0;
    var str;
    var t;
    if(aitem[i] == 1){
        point[now] += (coin_pm = Math.floor( Math.random() * 20 + 10));
        audio1.play();
    }
    if(aitem[i] == 2){
        point[now] -= (coin_pm = Math.floor( Math.random() * 20 + 10));
        audio2.play();
    }
    if(aitem[i] == 3){
        coin_pm = Math.floor( Math.random() * 60 - 30);
        if(coin_pm > -10 && coin_pm < 10){
            coin_pm = 0;
        }
        point[now] += coin_pm;
        audio3.play();
    }
    if(aitem[i] == 4){
        coin_pm = Math.floor( Math.random() * 20 + 10);
        if(input == 1){ // 変更なし
            coin_pm = 0;
        }
        else if(input > 1){
            t = random_create(0, input - 1, 2); // 0以上input-1以下を2つ
            if(t[0] == now){
                t[0] = t[1];
            }
        }
        point[now] += coin_pm;
        point[t[0]] -= coin_pm;
        audio4.play();
    }
    if(aitem[i] == 5){
        now -= 1;
        if(now < 0){
            now = input;
        }
        audio5.play();
    }
    if(aitem[i] == 1){
        str = coin_pm + '枚増えた' + '<br>';
    }
    else if(aitem[i] == 2){
        str = coin_pm + '枚減った' + '<br>';
    }
    else if(aitem[i] == 3){
        if(coin_pm <= -10){
            str = '敵と戦った結果、負けたのでコインが' + -coin_pm + '枚へった' + '<br>';
        }
        else if(coin_pm >= 10){
            str = '敵と戦った結果、勝ったのでコインが' + coin_pm + '枚ふえた' + '<br>';
        }
        else{
            str = '敵と戦ったが、引き分けたのでコインは変わらなかった' + '<br>';
        }
    }
    else if(aitem[i] == 4){
        if(coin_pm == 0){
            str = '他の人がいないので変更なし';
        }
        else{
            str = (t[0] + 1) + 'から' + coin_pm + '枚奪った' + '<br>';
        }
    }
    else if(aitem[i] == 5){
        str = 'もう1回さいころを振ってください' + '<br>';
    }
    else{
        str = '';
    }
    for(var i = 0;i <= 4;i++){
        $('#cointd' + i + '').text(point[i-1]);
    }
    return str;
}

function tenmetsu(){
    var flagnow = [0,0,0,0]; // 四方向にあたり
    $('#open-block p').text('近くない');
    if(game == 1){
        for(var i = 0;i < input;i++){
            if(people_position[i][0] != 0){
                if(fig_haiti[(people_position[i][0]-1)*10+people_position[i][1]] == answer){
                    flagnow[i] = 1;
                }
            }
            if(people_position[i][0] != 9){
                if(fig_haiti[(people_position[i][0]+1)*10+people_position[i][1]] == answer){
                    flagnow[i] = 1;
                }
            }
            if(people_position[i][1] != 0){
                if(fig_haiti[people_position[i][0]*10+(people_position[i][1]-1)] == answer){
                    flagnow[i] = 1;
                }
            }
            if(people_position[i][1] != 9){
                if(fig_haiti[people_position[i][0]*10+(people_position[i][1]+1)] == answer){
                    flagnow[i] = 1;
                }
            }
        }
        for(var i = 0;i < input;i++){
            if(flagnow[i] == 1){
                $('#open-block p').text('近い');
            }
        }
    }
    else{
        $('#open-block p').text('-----');
    }
}
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
window.onload = function(){
    init();
    audio_background.play();
    make_table(math, math);
}
function getID(element){
    click_id = element.id;
}
function getIDout(element){
    click_id = "";
}
$(function(){
    $(document.body).keydown(function (e) {
        if(click_id == "numberpeople" && (!reset)){
            if(e.keyCode >= 48 && e.keyCode <= 52){
                document.getElementById("numberpeople").innerHTML = e.keyCode - 48;
            }
        }
        if(e.keyCode >= 37 && e.keyCode <= 40 && coma_flag == 1){
            audio0.play();
            var y = people_position[now][0];
            var x = people_position[now][1];
            var str;
            random_f -= 1;
            if(e.keyCode == 37){ //←
                x-= 1;
                if((x+1) % 10 == 0){x+=1;random_f+=1;}
            }
            if(e.keyCode == 38){ //↑
                y-= 1;
                if(y < 0){y+=1;random_f+=1;}
            }
            if(e.keyCode == 39){ //→
                x+= 1;if(x % 10 == 0){x-=1;random_f+=1;}
            }
            if(e.keyCode == 40){ //↓
                y+= 1;
                if(y > 9){y-=1;random_f+=1;}
            }
            if(people_position[now][0] != y || people_position[now][1] != x){
                $('#td' + (people_position[now][0]*10 + people_position[now][1] + 1) + '').html('');
                $('#td' + (people_position[now][0]*10 + people_position[now][1] + 1) + '').html(fig_haiti[people_position[now][0]*10 + people_position[now][1]]);
            }
            people_position[now][0] = y;
            people_position[now][1] = x;
            item_re();
            people_haiti();
            document.getElementById('ran').innerHTML = '' + (now+1) + 'の人が' + random_f + 'マス進める';
            if(random_f <= 0){    
                coma_flag = 0;
                $('#point' + (now+1) + '').text(fig_haiti[y*10 + x]);
                tenmetsu(); // ゲーム1で四方向にあたりがあったら
                // ここがアイテムますなら
                str = aitem_kouka(y*10+x);
                aitem[y*10+x]='';
                now += 1;
                if(now >= input){now = 0;}
                document.getElementById('ran').innerHTML = str + '' + (now+1) + 'の番です';
                // ゴールマスなら
                if(reset){
                    tag_td = 'td' + (y*10+x+1) + '';
                    $('#'+tag_td).css('color','black');
                    if(fig_haiti[y*10 + x] == answer){
                        people_haiti();
                        alert("当たり");
                        if(now == 0){point[input-1] += 100;}
                        else{point[now-1] += 100;}
                        aitem_kouka(y*10+x);
                        game += 1;
                        if(game == 4){
                            alert("ゲームクリア");
                            $('#start-button').text("ゲームをはじめる");
                            init();
                            restart(math, math);
                        }
                        else{
                            game_start();
                            people_haiti();
                        }
                    }
                }
            }
        }
    });
    $("#start-button").click(function(e){
        audio_background.play();
        if(!reset){
            reset = true;
            $('#start-button').text("ゲームをやめる");
            game_start(); // 色とか配置して、ここでゲームの人数を確認
            for(var i = 4;i > document.getElementById("numberpeople").innerHTML-1;i--){
                $('#coin' + (i + 1) + '').css('background-color', '#666');
            }
            people_haiti(); // キャラクターや人を配置する
        }
        else{
            $('#start-button').text("ゲームをはじめる");
            init();
            restart(math, math);
        }
    });
    $("#ran-button").click(function(e){
        if(reset && coma_flag == 0){
            random_f = Math.floor( Math.random() * 6 + 1); // 1から6の乱数
            // nowの数字の人が進める
            document.getElementById('ran').innerHTML = '' + (now+1) + 'の人が' + random_f + 'マス進める';
            coma_flag = 1;
        }
    });
    audio_background.addEventListener("ended", function(e) {
        audio_background.play();
    });
});