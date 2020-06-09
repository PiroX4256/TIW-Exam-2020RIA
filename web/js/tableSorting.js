document.getElementById("albumListBody").addEventListener("mousedown", (e) => {
    var tr = $(e.target).closest("TR"), si = tr.index(), sy = e.pageY, b = $(document.body), drag;
    b.addClass("grabCursor").css("userSelect", "none");
    tr.addClass("grabbed");
    function move (e) {
        if (!drag && Math.abs(e.pageY - sy) < 10) return;
        drag = true;
        tr.siblings().each(function() {
            var s = $(this), i = s.index(), y = s.offset().top;
            if (i >= 0 && e.pageY >= y && e.pageY < y + s.outerHeight()) {
                if (i < tr.index())
                    tr.insertAfter(s);
                else
                    tr.insertBefore(s);
                return false;
            }
        });
    }

    function up (e) {
        if (drag && si != tr.index()) {
            drag = false;
            document.getElementById("saveOrder").style.visibility = "visible";
        }
        $(document).unbind("mousemove", move).unbind("mouseup", up);
        b.removeClass("grabCursor").css("userSelect", "none");
        tr.removeClass("grabbed");
    }
    $(document).mousemove(move).mouseup(up);
});

document.getElementById("saveOrder").addEventListener("click", (e) => {
    var table = document.getElementById("albumList");
    var jsonReq = {
        "albumsOrder" : []
    };
    for(var i=1; i<table.rows.length - 1; i++) {
        let row = table.rows[i];
        jsonReq.albumsOrder.push(row.cells[0].textContent);
    }
    var request = JSON.stringify(jsonReq);

    function success() {
        alert("Albums order has been successfully changed!");
    }

    $.ajax({
        type: "POST",
        dataType: "application/json",
        url: "ChangeAlbumsOrder",
        data: request,
        success: success(),
    })
    document.getElementById("saveOrder").style.visibility = "hidden";
})

