require.config( {
        baseUrl : "",
        paths : {
            "jquery" : "node_modules/jquery/dist/jquery.min"
        },
        waitSeconds : 15
    }
);

requirejs(

    [
        'js/Navigation'
    ],

    function( Navigation ) {

        var navigation = new Navigation({

            numberOfRows : 5,
            numberOfColumns : 6,
            blockDuringTransform : false,
            randomContent : 'hearts hostility avocado basket greedy dozen really conceptual dizzy under anybody thing anyone bridge ghoulish whisper several heating deathly implant liquid dancing company fellow echo coastal twin clover conservative guest sausage blubber pencil cloud moon water computer school network hammer walking violently mediocre literature chair two window cords musical zebra xylophone penguin home dog final ink teacher fun website banana uncle softly mega ten awesome attatch blue internet bottle tight zone tomato prison hydro cleaning telivision send frog cup book zooming falling evily gamer lid juice moniter captain bonding loudly thudding guitar shaving hair soccer water racket table late media desktop flipper club flying smooth monster purple guardian bold hyperlink presentation world national comment element magic lion sand crust toast jam hunter forest foraging silently pong'

        });

    }
);