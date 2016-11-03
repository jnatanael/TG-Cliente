    $('table > tbody > tr:odd').addClass('odd');

    $('table > tbody > tr').hover(function () {
        $(this).toggleClass('hover');
    });
    $('form').submit(function (e) {
        e.preventDefault();
    });

    $('#pesquisar').keydown(function () {
        var encontrou = false;
        var termo = $(this).val().toLowerCase();
        $('table > tbody > tr').each(function () {
            $(this).find('td').each(function () {
                if ($(this).text().toLowerCase().indexOf(termo) > -1)
                    encontrou = true;
            });
            if (!encontrou)
                $(this).hide();
            else
                $(this).show();
            encontrou = false;
        });
    });

   