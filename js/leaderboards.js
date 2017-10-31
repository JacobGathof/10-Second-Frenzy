(function () {
    $("#most-likes").on("click", mostLikesButtonClicked);
    $("#most-dislikes").on("click", mostDislikesButtonClicked);
    $("#most-shares").on("click", mostSharesButtonClicked);
    $("#ten-minutes").on("click", tenMinutesButtonClicked);
    $("#ten-hours").on("click", tenHoursButtonClicked);
    $("#ten-days").on("click", tenDaysButtonClicked);

    function mostLikesButtonClicked(){
        $("#most-likes").css("background-color", "lightgreen");
        $("#most-dislikes").css("background-color", "#D3DFD3");
        $("#most-shares").css("background-color", "#D3DFD3");
        // $("#posts tr td:first-child").
    }
    
    function mostDislikesButtonClicked(){
        $("#most-likes").css("background-color", "#D3DFD3");
        $("#most-dislikes").css("background-color", "lightgreen");
        $("#most-shares").css("background-color", "#D3DFD3");
    }

    function mostSharesButtonClicked(){
        $("#most-likes").css("background-color", "#D3DFD3");
        $("#most-dislikes").css("background-color", "#D3DFD3");
        $("#most-shares").css("background-color", "lightgreen");
    }

    function tenMinutesButtonClicked(){
        $("#ten-minutes").css("background-color", "lightgreen");
        $("#ten-hours").css("background-color", "#D3DFD3");
        $("#ten-days").css("background-color", "#D3DFD3");
    }

    function tenHoursButtonClicked(){
        $("#ten-minutes").css("background-color", "#D3DFD3");
        $("#ten-hours").css("background-color", "lightgreen");
        $("#ten-days").css("background-color", "#D3DFD3");
    }

    function tenDaysButtonClicked(){
        $("#ten-minutes").css("background-color", "#D3DFD3");
        $("#ten-hours").css("background-color", "#D3DFD3");
        $("#ten-days").css("background-color", "lightgreen");
    }
})();
