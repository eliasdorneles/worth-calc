function compileTemplate(path) {
    return Handlebars.compile($(path).html());
}
$(document).on('ready', function() {
    var $ulFavThings = $('.favorite-things');
    var templateForItemSetting = compileTemplate('#thing-setting');
    var templateForAssessment = compileTemplate('#thing-assessment');

    var DEFAULT_FAVORITE_THINGS = [
        {description: "starbucks coffee",  price: 4.0},
        {description: "movie-going",       price: 18.0},
        {description: "an ice-cream pot",  price: 8.0},
        {description: "a bottle of beer",  price: 6.0},
        {description: "a new book",        price: 20.0},
        {description: "a trip to Rio",     price: 3000.0},
    ];

    function getFavoriteThings() {
        // TODO: sync with localStorage
        return $ulFavThings.data('things');
    }
    function setFavoriteThings(things) {
        // TODO: sync with localStorage
        $ulFavThings.data('things', things);
    }
    function updateSettingsPage() {
        $ulFavThings.empty();
        $.each(getFavoriteThings(), function(index, it) {
            $ulFavThings.append(templateForItemSetting({
                thing: it,
                index: index,
            }));
        });
        $ulFavThings.listview();
        $ulFavThings.listview('refresh');
    }
    function calculateWorth() {
        var price = $('.price').val();
        if (!parseFloat(price)) {
            // TODO: handle this in the UI
            return false;
        }
        var $container = $('ul.assess-container');
        $('.worth-title').html('$' + price + ' can buy you:');
        $container.empty();
        $container.listview();
        $.each(getFavoriteThings(), function(index, it) {
            var ratio = price / it.price;
            if (ratio > 1) {
                $container.append(templateForAssessment({
                    thing: it,
                    price: price,
                    ratio: ratio.toFixed(2)
                }));
            }
        });
        $container.listview('refresh');
    }
    function getFormData($form) {
        var params = {};
        $.each($form.serializeArray(), function(_, kv) {
              params[kv.name] = kv.value;
        });
        return params;
    }
    function updateThings(index, thing) {
        var things = getFavoriteThings();
        if (parseInt(index) && parseInt(index) >= 0) {
            things[index] = thing;
        } else {
            things.push(thing);
        }
        setFavoriteThings(things);
    }
    function saveThing() {
        var data = getFormData($('.form-edit-thing'));
        // TODO: add basic validation
        var index = data.index;
        updateThings(index, {description: data.description, price: data.price});
        updateSettingsPage();
        $('#edit-thing').popup('close');
        clearPopupData();
        return false;
    }
    function loadPopupData(item, index) {
        var popup = $('#edit-thing');
        popup.find('#thing-description').val(item.description);
        popup.find('#thing-price').val(item.price);
        popup.find('#thing-index').val(index);
    }
    function clearPopupData() {
        loadPopupData({description: undefined, price: undefined}, -1);
    }
    function loadPopupEdit() {
        var index = $(this).data('index');
        var item = getFavoriteThings()[index];
        var popup = $('#edit-thing');
        loadPopupData(item, index);
        popup.popup('open');
    }

    // initializing app
    if (getFavoriteThings() === undefined) {
        setFavoriteThings(DEFAULT_FAVORITE_THINGS);
    }
    updateSettingsPage();
    $('.assess-it-btn').click(calculateWorth);
    $('body').on('click', 'ul.favorite-things li', loadPopupEdit);
    $('body').on('click', '.save-thing', saveThing);
});

