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

        var contentContainer = document.getElementById( 'content-container' );
        var randomContent = 'hearts hostility avocado basket greedy dozen really conceptual dizzy under anybody thing anyone bridge ghoulish whisper several heating deathly implant liquid dancing company fellow echo coastal twin clover conservative guest sausage blubber pencil cloud moon water computer school network hammer walking violently mediocre literature chair two window cords musical zebra xylophone penguin home dog final ink teacher fun website banana uncle softly mega ten awesome attatch blue internet bottle tight zone tomato prison hydro cleaning television send frog cup book zooming falling evily gamer lid juice moniter captain bonding loudly thudding guitar shaving hair soccer water racket table late media desktop flipper club flying smooth monster purple guardian bold hyperlink presentation world national comment element magic lion sand crust toast jam hunter forest foraging silently pong'
        var queries = randomContent.split( ' ' );

        var numCols = 5;


        // generate content

        ( function generateContentNodes () {

            var numElements = queries.length;

            var posX = 1;
            var posY = 1;

            var x = 0;
            for ( ; x < numElements; x ++ ) {

                var index = x + 1;
                var node = document.createElement( 'div' );

                node.classList.add( 'content' );
                node.setAttribute( 'data-query', queries[ x ] );

                node.innerHTML = '<div class="loading-text">Loading content for "' + queries[ x ] + '"</div>';

                posX ++;

                if ( index % ( numCols ) === 0 ) {
                    node.classList.add( 'end-of-column' );
                    posX = 1;
                    posY ++;
                }

                contentContainer.appendChild( node );

            }

        }() );



        // Inititalize the navigation

        var contentItems = document.querySelectorAll( '.content' );

        var navigation = new Navigation({
            numberOfColumns : numCols,
            blockDuringTransform : false,
            contentContainer: contentContainer,
            contentItems: contentItems
        });

    }
);