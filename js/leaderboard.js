$(function() {
    var socket = io();

    socket.on('score', function(msg){
        var json = JSON.parse(msg);
        console.log("score message: " + json);
        newScore(json.name, json.score);
    });
});

function newScore(name, score){
    insertNewRow(15, name, score);
    sortTable();
}
function insertNewRow(num, name, score){
    var table = document.getElementById("leaderboard");
    var row = table.insertRow(num);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = num;
        cell2.innerHTML = name;
        cell3.innerHTML = score;
    }

    //TODO implement a better sort algorithm then bubble
    function sortTable() {
      var table = document.getElementById("leaderboard");
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("leaderboard");
      switching = true;
      /*Make a loop that will continue until
      no switching has been done:*/
      while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = rows[i].getElementsByTagName("TD")[2];
          y = rows[i + 1].getElementsByTagName("TD")[2];
          //check if the two rows should switch place:
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
        } else {
            rows[i].getElementsByTagName("TD")[0].innerHTML = i;
            if(i >= 15){
                rows[i].parentNode.removeChild(rows[i]);
            }
        }
    }
    if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
      }
  }

}

window.onload = function() {
    var scores;
    $.ajax({
        url: "https://qn907f9vwe.execute-api.eu-west-1.amazonaws.com/prod/scores",
        type: "GET",
        dataType: 'JSON',
        success: function(data){

            data.scores.sort(function(a,B){
                if(a.score == B.score)
                    return 0;
                if(a.score < B.score)
                    return 1;
                if(a.score > B.score)
                    return -1;
            });

            for (i = 0; i < (15); i++) {
                insertNewRow(i+1, data.scores[i].name, data.scores[i].score);
            }
        }
    });
};