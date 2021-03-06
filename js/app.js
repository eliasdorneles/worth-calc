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
    function updateSettingsListView() {
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
    function isValidIndex(index) {
        return parseInt(index) && parseInt(index) >= 0;
    }
    function insertThingAt(index, thing) {
        var things = getFavoriteThings();
        if (isValidIndex(index)) {
            things[index] = thing;
        } else {
            things.unshift(thing);
        }
        setFavoriteThings(things);
    }
    function removeThingAt(index) {
        var things = getFavoriteThings();
        things.splice(index, 1);
        setFavoriteThings(things);
    }
    function deleteThing() {
        var index = getFormData($('.form-edit-thing')).index;
        if (isValidIndex(index)) {
            removeThingAt(index);
        }
        updateSettingsListView();
        $('#edit-thing').popup('close');
        clearPopupData();
        return false;
    }
    function saveThing() {
        var data = getFormData($('.form-edit-thing'));
        // TODO: add basic validation
        var index = data.index;
        insertThingAt(index, {description: data.description, price: data.price});
        updateSettingsListView();
        $('#edit-thing').popup('close');
        clearPopupData();
        return false;
    }
    function populatePopupEditForm(item, index) {
        var popup = $('#edit-thing');
        popup.find('#thing-description').val(item.description);
        popup.find('#thing-price').val(item.price);
        popup.find('#thing-index').val(index);
        popup.find('.delete-thing-btn').toggle(isValidIndex(index));
    }
    function clearPopupData() {
        populatePopupEditForm({description: undefined, price: undefined}, -1);
    }
    function loadPopupEdit() {
        var index = $(this).data('index');
        var item = getFavoriteThings()[index];
        var popup = $('#edit-thing');
        populatePopupEditForm(item, index);
        popup.popup('open');
    }

    // initializing app
    if (getFavoriteThings() === undefined) {
        setFavoriteThings(DEFAULT_FAVORITE_THINGS);
    }
    updateSettingsListView();
    $('body').on('click', '.assess-it-btn', calculateWorth);
    $('body').on('click', '.add-thing-btn', clearPopupData);
    $('body').on('click', '.save-thing-btn', saveThing);
    $('body').on('click', '.delete-thing-btn', deleteThing);
    $('body').on('click', 'ul.favorite-things li', loadPopupEdit);
    $('body').on('taphold', 'ul.favorite-things li', loadPopupEdit);
});

