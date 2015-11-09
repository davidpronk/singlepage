define(
    [
        'jquery'
    ],

    function ( $ ) {

        var defaultConfig = {
            numberOfColumns : 5,
            blockDuringTransform : true,
            contentContainer : document.getElementById( 'content-container' ),
            contentItems : document.querySelectorAll( '.content' )
        };

        /**
         *
         * @param config
         * @constructor
         */

        var Navigation = function ( config ) {

            this.config = $.extend( {}, defaultConfig, config );

            this.contentElements = Array.prototype.slice.apply( this.config.contentItems );

            // TODO: handle the remaining items in the bottom row.
            // Because right now flooring the result neglects the remainder of the division
            // var remainder = contentElements % numberOfColumns;
            this.numberOfRows = Math.floor( this.contentElements.length / this.config.numberOfColumns );


            this.maxX = this.config.numberOfColumns - 1;
            this.maxY = this.numberOfRows - 1;

            // Get the DOM elements we need
            this.navContainer = document.getElementsByClassName( 'navigation' )[ 0 ];
            this.navButtons = Array.prototype.slice.apply( document.querySelectorAll( '.nav-button' ) );

            this.template = document.querySelector( '#content-template' );


            // Set initial values
            this.currIndex = 0;
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

                this.bindButtonHandlers();

                this.bindKeyDownHandlers();

                this.bindTransitionEndHandlers();

                this.toggleNavButtonVisibility();

                this.bindHashChangeHandler();

                this.parseURL();

            },

            bindButtonHandlers : function () {

                this.navButtons.forEach( function ( el ) {

                    el.addEventListener( 'click', function ( e ) {

                        e.stopPropagation();
                        e.preventDefault();

                        if ( this.isTransforming && this.config.blockDuringTransform ) {
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

                    if ( this.isTransforming && this.config.blockDuringTransform ) {
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

                this.config.contentContainer.addEventListener( this.transitionEndEvent, function () {
                    this.isTransforming = false;
                }.bind( this ) );

            },

            getElementByHash : function ( hash ) {

                var numElements = this.contentElements.length;
                var x = 0;

                for ( ; x < numElements; x ++ ) {

                    var el = this.contentElements[ x ];

                    if ( el.getAttribute( 'data-query' ) === hash ) {
                        return el;
                    }

                }

                return false;

            },

            getIndexByHash : function ( hash ) {

                var numElements = this.contentElements.length;
                var x = 0;

                for ( ; x < numElements; x ++ ) {

                    var el = this.contentElements[ x ];

                    if ( el.getAttribute( 'data-query' ) === hash ) {
                        return x;
                    }

                }

                return false;

            },

            getXPos : function ( index ) {
                return index % this.config.numberOfColumns;
            },

            getYPos : function ( index ) {

                var currY = 0;

                if ( index > 0 ) {
                    currY = Math.floor( ( index ) / this.config.numberOfColumns );
                }

                return currY;

            },

            loadContent : function () {

                // get a new clean empty template
                var template = this.template;

                var el = this.contentElements[ this.currIndex ];

                var query = el.getAttribute( 'data-query' );

                if ( query && ! el.classList.contains( 'loaded' ) ) {

                    var dataURL = 'http://www.omdbapi.com/?t=' + query + '&type=movie&plot=full&r=json';

                    $.ajax( {
                        url : dataURL,
                        context : {
                            this : this,
                            el : el
                        }
                    } ).done( function ( data ) {

                        // TODO: this.this is kind of confusing
                        var index = this.this.getIndexByHash( el.getAttribute( 'data-query' ) );
                        var elX = this.this.getXPos( index );
                        var elY = this.this.getYPos( index );

                        template.content.querySelectorAll( '.position-data' )[ 0 ].innerHTML = ( elX + 1 ) + ' / ' + ( elY + 1 );

                        if ( data.Error ) {

                            template.content.querySelectorAll( '.error' )[ 0 ].innerHTML = data.Error;
                            this.el.classList.add( 'load-error' );

                        } else {

                            template.content.querySelectorAll( '.position-data' )[ 0 ].innerHTML = ( elX + 1 ) + ' / ' + ( elY + 1 );
                            template.content.querySelectorAll( '.title-data' )[ 0 ].innerHTML = data.Title;
                            template.content.querySelectorAll( '.releasedate-data' )[ 0 ].innerHTML = data.Released;
                            template.content.querySelectorAll( '.director-data' )[ 0 ].innerHTML = data.Director;
                            template.content.querySelectorAll( '.actors-data' )[ 0 ].innerHTML = data.Actors;
                            template.content.querySelectorAll( '.plot-data' )[ 0 ].innerHTML = data.Plot + ' ' + data.Plot + ' ' + data.Plot;

                        }

                        var node = document.importNode( template.content, true );

                        this.el.classList.add( 'loaded' );

                        el.appendChild( node );

                    } ).fail( function ( e ) {
                        // TODO: handle errors
                    } );

                }

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

                this.currIndex = ( this.currY * this.config.numberOfColumns ) + this.currX;

                var hash = this.contentElements[ this.currIndex ].getAttribute( 'data-query' );

                history.pushState( {}, '', '#' + hash );

                this.transform();

            },

            transform : function () {

                this.isTransforming = true;

                this.loadContent();

                this.toggleNavButtonVisibility();

                this.config.contentContainer.style[ this.transformName ] = 'translate(' + this.currX * - 100 + 'vw ,' + this.currY * - 100 + 'vh )';
            },

            parseURL : function () {

                var hash = location.hash.substring( 1 );

                if ( hash ) {

                    var index = this.getIndexByHash( hash );

                    if( index ) {

                        this.currIndex = index;

                        this.currX = this.getXPos( this.currIndex );
                        this.currY = this.getYPos( this.currIndex );

                        this.transform();

                    } else {
                        // TODO: show "content not found" error
                        // For now return home

                        this.currX = 0;
                        this.currY = 0;
                        this.navigate();
                    }

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