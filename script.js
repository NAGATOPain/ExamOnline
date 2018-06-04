var Name = "", Subject = "", Num = 0, Answer = "", Nameoftest = "", Time = 0;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        Subject = myObj.subject;
        Num = myObj.number;
        Answer = myObj.answer;
        Nameoftest = myObj.name;
        Time = myObj.time;
        document.getElementById("labelServer").createTextNode("Đề thi hiện tại có trên server: " + Nameoftest);
        document.getElementById("labelSubject").createTextNode("Môn: " + Subject);
        document.getElementById("labelTime").createTextNode("Thời gian: " + Time.toString()+" phút");
    }
};
xmlhttp.open("GET", "data.txt", true);
xmlhttp.send();

function indexButton(){
    var name = document.getElementById("input-name").value.trim();
    Name = name;
    document.title = "Phiếu đáp án";
    document.getElementById("title").innerHTML = "<h1><b>PHIẾU ĐÁP ÁN</b></h1>";
    document.getElementById("panel").innerHTML = '';
    generateQuiz();
}

function generateQuiz(){
    var panel = document.getElementById("panel");
    var i;
    for (i = 0; i < Num; i++){
        var quizAtI = document.createElement("div");
        quizAtI.name = "as" + (i+1).toString();
        var lblNum = document.createElement("b");
        lblNum.id = "label";
        var str;
        if (i < 9) str = "Câu 0"+(i+1).toString()+": ";
        else str = "Câu "+(i+1).toString()+": ";

        var s = document.createTextNode(str);
        lblNum.appendChild(s);
        quizAtI.appendChild(lblNum);

        var quiz = document.createElement("span");
        quiz.id = "quiz";
        //Quiz setup:
        var j;
        var buffer = "ABCD";
        for (j = 0; j < 4; j++){
            quiz.appendChild(document.createTextNode(buffer.charAt(j)+"."));
            var radio = document.createElement("input");
            radio.type = "radio"; radio.name = "as" + (i+1).toString();
            radio.id = "radio";
            quiz.appendChild(radio);
        }
        quizAtI.appendChild(quiz);
        panel.appendChild(quizAtI);
    }
    //Add button
    var button = document.createElement("button");
    button.id = "button"; 
    button.type = "button"; 
    button.appendChild(document.createTextNode("Chấm điểm >>"));
    button.onclick = scoring;
    panel.appendChild(button);
}

function scoring(){
    var result = [];
    var answer = [];
    var i;
    for (i = 0; i < Num; i++){
        result.push(Answer.charAt(i));
        result[i] += "";
        result[i] = result[i].toLowerCase();
        //result[i] += "";
        var checkbox = document.getElementsByName("as"+(i+1).toString());
        var checkone,j;
        for (j = 0; j < checkbox.length; j++){
            if (checkbox[j].checked){
                checkone = j+1; break;
            }
            if (j == checkbox.length - 1 && !checkbox[checkbox.length - 1].checked){
                alert("Bạn bỏ sót đáp án. Hãy chọn cho đủ !");
                return;
            }
        }
        switch (checkone){
            case 1:
                answer.push("a");
                break;
            case 2:
                answer.push("b");
                break;
            case 3:
                answer.push("c");
                break;
            case 4:
                answer.push("d");
                break;
            default:
                break;
        }
    } 
    var score = 0.0;
    var wrong_ans = [];

    for (i = 0; i < Num; i++){
        if (answer[i] == result[i]) score += (10.0/Num);
        else wrong_ans.push(i+1);
    }
    var score_str = score.toFixed(2).toString();
    str = "";
    if (wrong_ans.length == 0){
        str = "Bạn không sai câu nào !"
    }
    else{
        for (i = 0; i < wrong_ans.length - 1; i++)
        str += wrong_ans[i].toString() + " - "+result[wrong_ans[i]-1].toUpperCase()+", ";
        str += wrong_ans[wrong_ans.length - 1].toString() + " - "+result[wrong_ans[wrong_ans.length - 1]-1].toUpperCase()+".";
    }
    switchToResultPage(score_str, str);
}

function switchToResultPage(score, str){
    document.title = "Kết quả";
    document.getElementById("title").innerHTML = "<h1><b>KẾT QUẢ</b></h1>";
    document.getElementById("panel").innerHTML = '';
    var panel = document.getElementById("panel");

    var name_lbl = document.createElement("b");
    name_lbl.appendChild(document.createTextNode("Họ và tên: "));
    var name_panel = document.createElement("div");
    name_panel.appendChild(name_lbl);
    name_panel.appendChild(document.createTextNode(Name));

    var test_lbl = document.createElement("b");
    test_lbl.appendChild(document.createTextNode("Đề thi: "));
    var test_panel = document.createElement("div");
    test_panel.appendChild(test_lbl);
    test_panel.appendChild(document.createTextNode(Nameoftest));

    var sub_lbl = document.createElement("b");
    sub_lbl.appendChild(document.createTextNode("Môn thi: "));
    var sub_panel = document.createElement("div");
    sub_panel.appendChild(sub_lbl);
    sub_panel.appendChild(document.createTextNode(Subject));

    var lbl_panel = document.createElement("b");
    lbl_panel.appendChild(document.createTextNode("Điểm của bạn: "));
    var score_panel = document.createElement("div");
    score_panel.appendChild(lbl_panel);
    score_panel.appendChild(document.createTextNode(score));

    var lbl_panel1 = document.createElement("b");
    lbl_panel1.appendChild(document.createTextNode("Những câu sai (và đáp án bên cạnh): "));
    var wrong_panel = document.createElement("div");
    wrong_panel.appendChild(lbl_panel1);
    wrong_panel.appendChild(document.createTextNode(str));

    panel.appendChild(name_panel);
    panel.appendChild(document.createElement("br"));
    panel.appendChild(test_panel);
    panel.appendChild(document.createElement("br"));
    panel.appendChild(sub_panel);
    panel.appendChild(document.createElement("br"));
    panel.appendChild(score_panel);
    panel.appendChild(document.createElement("br"));
    panel.appendChild(wrong_panel);
    panel.appendChild(document.createElement("br"));
    
    //Add button
    var button = document.createElement("button");
    button.id = "button";
    button.type = "button"; 
    button.appendChild(document.createTextNode("Trở lại trang chủ >>"));
    button.onclick = () => {location.reload();};
    panel.appendChild(button);
}
