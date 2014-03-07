function compileTemplate(path) {
    return Handlebars.compile($(path).html());
}
$(function() {
    var $ulFavThings = $('.favorite-things');
    var templateForItemSetting = compileTemplate('#thing-setting');
    var templateForAssessment = compileTemplate('#thing-assessment');

    var DEFAULT_FAVORITE_THINGS = [
        {description: "starbucks coffee",  price: 4.0},
        {description: "movie-going",       price: 18.0},
        {description: "an ice-cream pot",     price: 8.0},
        {description: "a bottle of beer",    price: 6.0},
        {description: "a new book",          price: 20.0},
        {description: "a trip to Rio",       price: 3000.0},
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
            $ulFavThings.append(templateForItemSetting({thing: it}));
        });
    }
    function assessIt() {
        var price = $('.price').val();
        var $container = $('ul.assess-container');
        // TODO: validate price
        $('.worth-title').html('$' + price + ' can buy you:');
        $container.empty();
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

    // initializing app
    if (getFavoriteThings() === undefined) {
        setFavoriteThings(DEFAULT_FAVORITE_THINGS);
    }
    updateSettingsPage();
    $('.assess-it-btn').click(assessIt);
});

