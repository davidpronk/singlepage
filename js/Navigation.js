define(

    [
        'jquery'
    ],

    function( $ ) {

        var defaultConfig = {
            numberOfRows : 8,
            numberOfColumns : 8,
            blockDuringTransform : true,
            randomContent : 'hearts hostility avocado basket greedy dozen really conceptual dizzy under anybody thing anyone bridge ghoulish whisper several heating deathly implant liquid dancing company fellow echo coastal twin clover conservative guest sausage blubber pencil cloud moon water computer school network hammer walking violently mediocre literature chair two window cords musical zebra xylophone penguin home dog final ink teacher fun website banana uncle softly mega ten awesome attatch blue internet bottle tight zone tomato prison hydro cleaning telivision send frog cup book zooming falling evily gamer lid juice moniter captain bonding loudly thudding guitar shaving hair soccer water racket table late media desktop flipper club flying smooth monster purple guardian bold hyperlink presentation world national comment element magic lion sand crust toast jam hunter forest foraging silently pong'
        };

        var Navigation = function ( config ) {

            this.config = $.extend( {}, defaultConfig, config );

            this.numberOfElements = this.config.numberOfRows * this.config.numberOfColumns;
            this.maxX = this.config.numberOfRows - 1;
            this.maxY = this.config.numberOfColumns - 1;

            // Get the DOM elements we need
            this.navContainer = document.getElementsByClassName( 'navigation' )[ 0 ];
            this.contentContainer = document.getElementById( 'content-container' );
            this.navButtons = Array.prototype.slice.apply( document.querySelectorAll( '.nav-button' ) );

            // Set initial values
            this.isTransforming = false;
            this.currX = 0;
            this.currY = 0;

            // Determine vendor prefixed stuff
            this.transitionEndEvent = this.getTransitionEndEvent();
            this.transformName = this.getTransformName();

            this.init();
        };

        Navigation.prototype = {

            init : function () {

                this.generateContentNodes();

                this.bindButtonHandlers();

                this.bindKeyDownHandlers();

                this.bindTransitionEndHandlers();

                this.toggleNavButtonVisibility();

                this.bindHashChangeHandler();

                this.parseURL();

            },

            addContent : function () {

                var contentElements = Array.prototype.slice.apply( document.querySelectorAll( '.content' ) );
                var template = document.querySelector( '#content-template' );

                contentElements.forEach( function ( el ) {

                    var query = el.getAttribute( 'data-query' );

                    if ( query ) {

                        var dataURL = 'http://www.omdbapi.com/?t=' + query + '&type=movie&plot=full&r=json';

                        $.ajax( {
                            url : dataURL,
                            context : el
                        } ).done( function ( data ) {

                            // "this" is our el through the $.ajax context property
                            var posX = this.getAttribute( 'data-pos-x' );
                            var posY = this.getAttribute( 'data-pos-y' );

                            template.content.querySelectorAll( '.position-data' )[ 0 ].innerHTML = posX + ' / ' + posY;
                            template.content.querySelectorAll( '.title-data' )[ 0 ].innerHTML = data.Title;
                            template.content.querySelectorAll( '.releasedate-data' )[ 0 ].innerHTML = data.Released;
                            template.content.querySelectorAll( '.director-data' )[ 0 ].innerHTML = data.Director;
                            template.content.querySelectorAll( '.actors-data' )[ 0 ].innerHTML = data.Actors;
                            template.content.querySelectorAll( '.plot-data' )[ 0 ].innerHTML = data.Plot + ' ' + data.Plot + ' ' + data.Plot;

                            var node = document.importNode( template.content, true );

                            this.appendChild( node );

                        } ).fail( function ( e ) {
                            // TODO: handle errors
                        } );

                    }

                } );

            },

            bindButtonHandlers : function () {

                this.navButtons.forEach( function ( el ) {

                    el.addEventListener( 'click', function ( e ) {

                        e.stopPropagation();
                        e.preventDefault();

                        if ( this.isTransforming && this.blockDuringTransform ) {
                            return;
                        }

                        switch ( e.target.getAttribute( 'rel' ) ) {

                            case 'up':
                                this.navigateUp();
                                break;

                            case 'right':
                                this.navigateRight();
                                break;

                            case 'down':
                                this.navigateDown();
                                break;

                            case 'left':
                                this.navigateLeft();
                                break;
                        }

                    }.bind( this ) );
                }.bind( this ) );

            },

            bindHashChangeHandler : function () {

                window.addEventListener( 'hashchange', function () {
                    this.parseURL();
                }.bind( this ), false );

            },

            bindKeyDownHandlers : function () {

                document.addEventListener( 'keydown', function ( e ) {

                    if ( this.isTransforming && this.blockDuringTransform ) {
                        return;
                    }

                    switch ( e.which ) {

                        case 38:
                            this.navigateUp();
                            break;

                        case 39:
                            this.navigateRight();
                            break;

                        case 40:
                            this.navigateDown();
                            break;

                        case 37:
                            this.navigateLeft();
                            break;

                        default:
                            return;
                    }

                    e.preventDefault();

                }.bind( this ) );
            },

            bindTransitionEndHandlers : function () {

                this.contentContainer.addEventListener( this.transitionEndEvent, function () {
                    this.isTransforming = false;
                }.bind( this ) );

            },

            generateContentNodes : function () {

                var posX = 1;
                var posY = 1;
                var queries = this.config.randomContent.split( ' ' );

                var x = 0;
                for ( ; x < this.numberOfElements; x ++ ) {

                    var index = x + 1;
                    var node = document.createElement( 'div' );

                    node.classList.add( 'content' );
                    node.setAttribute( 'data-query', queries[ x ] );
                    node.setAttribute( 'data-pos-x', posX );
                    node.setAttribute( 'data-pos-y', posY );

                    posX ++;

                    if ( index % ( this.maxX + 1 ) === 0 ) {
                        node.style.float = 'none';
                        posX = 1;
                        posY ++;
                    }

                    this.contentContainer.appendChild( node );

                }

                this.addContent();

            },

            navigateUp : function () {

                if ( this.currY === 0 ) {
                    return;
                }

                this.currY --;
                this.navigate();
            },

            navigateRight : function () {

                if ( this.currX === this.maxX ) {
                    return;
                }

                this.currX ++;
                this.navigate();
            },

            navigateDown : function () {

                if ( this.currY === this.maxY ) {
                    return;
                }

                this.currY ++;
                this.navigate();
            },

            navigateLeft : function () {

                if ( this.currX === 0 ) {
                    return;
                }

                this.currX --;
                this.navigate();
            },


            navigate : function () {

                this.toggleNavButtonVisibility();

                this.isTransforming = true;

                history.pushState( {}, '', '#' + ( this.currX + 1 ) + ',' + ( this.currY + 1 ) + '' );

                this.transform();

            },

            transform : function () {
                this.contentContainer.style[ this.transformName ] = 'translate(' + this.currX * - 100 + 'vw ,' + this.currY * - 100 + 'vh )';
            },

            parseURL : function () {

                var hash = location.hash.substring( 1 );

                if ( hash ) {

                    var requestedX = hash.split( ',' )[ 0 ];
                    var requestedY = hash.split( ',' )[ 1 ];

                    if ( requestedX > 0 && requestedX <= this.maxX ) {
                        this.currX = requestedX - 1;
                    }

                    if ( requestedY > 0 && requestedY <= this.maxY ) {
                        this.currY = requestedY - 1;
                    }

                    this.transform();

                } else {
                    this.navigate()
                }

            },

            toggleNavButtonVisibility : function () {

                if ( this.currX === 0 ) {
                    this.navContainer.classList.remove( 'left' );
                } else {
                    this.navContainer.classList.add( 'left' );
                }

                if ( this.currX === this.maxX ) {
                    this.navContainer.classList.remove( 'right' );
                } else {
                    this.navContainer.classList.add( 'right' );
                }

                if ( this.currY === 0 ) {
                    this.navContainer.classList.remove( 'up' );
                } else {
                    this.navContainer.classList.add( 'up' );
                }

                if ( this.currY === this.maxY ) {
                    this.navContainer.classList.remove( 'down' );
                } else {
                    this.navContainer.classList.add( 'down' );
                }

            },


            // Based on http://stackoverflow.com/a/9090128
            getTransitionEndEvent : function () {

                var i;
                var el = document.createElement( 'p' );
                var transitions = {
                    'transition' : 'transitionend',
                    'OTransition' : 'otransitionend',
                    'MozTransition' : 'transitionend',
                    'WebkitTransition' : 'webkitTransitionEnd'
                };

                for ( i in transitions ) {
                    if ( transitions.hasOwnProperty( i ) && el.style[ i ] !== undefined ) {
                        return transitions[ i ];
                    }
                }
            },


            // Based on http://stackoverflow.com/a/12621264
            getTransformName : function () {

                var el = document.createElement( 'p' );
                var transformName;

                transforms = {
                    'webkitTransform' : '-webkit-transform',
                    'OTransform' : '-o-transform',
                    'msTransform' : '-ms-transform',
                    'MozTransform' : '-moz-transform',
                    'transform' : 'transform'
                };

                document.body.insertBefore( el, null );

                for ( var t in transforms ) {
                    if ( el.style[ t ] !== undefined ) {
                        transformName = t;
                    }
                }

                document.body.removeChild( el );

                return transformName;

            }

        };

        return Navigation;

    }
);