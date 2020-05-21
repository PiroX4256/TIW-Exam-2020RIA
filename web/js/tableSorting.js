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
            //alert("moved!");
        }
        $(document).unbind("mousemove", move).unbind("mouseup", up);
        b.removeClass("grabCursor").css("userSelect", "none");
        tr.removeClass("grabbed");
    }
    $(document).mousemove(move).mouseup(up);
});