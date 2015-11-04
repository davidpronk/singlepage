/**
 * Settings
 */

// The number of rows of pages
var numberOfRows = 5;

// The number of columns of pages
var numberOfColumns = 6;

// Allow one navigation transition at the time
// i.e. block navigation when a transform is in progress
var blockDuringTransform = false;

// Words used query the OMDb (Open Movie Database) at http://www.omdbapi.com
// The results are used to fill the content elements (pages)
var randomContent = 'hearts hostility avocado basket greedy dozen really conceptual dizzy under anybody thing anyone bridge ghoulish whisper several heating deathly implant liquid dancing company fellow echo coastal twin clover conservative guest sausage blubber pencil cloud moon water computer school network hammer walking violently mediocre literature chair two window cords musical zebra xylophone penguin home dog final ink teacher fun website banana uncle softly mega ten awesome attatch blue internet bottle tight zone tomato prison hydro cleaning telivision send frog cup book zooming falling evily gamer lid juice moniter captain bonding loudly thudding guitar shaving hair soccer water racket table late media desktop flipper club flying smooth monster purple guardian bold hyperlink presentation world national comment element magic lion sand crust toast jam hunter forest foraging silently pong';

/**
 * End of Settings
 */


// Calculate values for internal use
var numberOfElements = numberOfRows * numberOfColumns;
var maxX = numberOfRows -1;
var maxY = numberOfColumns -1;


// Get the DOM elements we need
var navContainer = document.getElementsByClassName( 'nav' )[0];
var contentContainer = document.getElementById( 'content-container' );
var navButtons = Array.prototype.slice.apply( document.querySelectorAll( '.nav-button' ) );


// Determine vendor prefixed stuff
var transitionEndEvent = getTransitionEndEvent();
var transformName = getTransformName();


// Set initial values
var isTransforming = false;
var currX = 0;
var currY = 0;


// Init

generateContentNodes();

bindButtonHandlers();

bindKeyDownHandlers();

bindTransitionEndHandlers();

toggleNavButtonVisibility();


function addContent () {

    var contentElements = Array.prototype.slice.apply( document.querySelectorAll( '.content' ) );
    var template = document.querySelector( '#content-template' );

    contentElements.forEach( function ( el ) {

        var query = el.getAttribute( 'data-query' );

        if( query ){

            var dataURL = 'http://www.omdbapi.com/?t=' + query + '&type=movie&plot=full&r=json';

            $.ajax( {
                url : dataURL,
                context: el
            } ).done( function ( data ) {

                // "this" is our el through the $.ajax context property
                var posX = this.getAttribute( 'data-pos-x' );
                var posY = this.getAttribute( 'data-pos-y' );

                template.content.querySelectorAll( '.position-data' )[0].innerHTML = 'col: ' + posX + ' / row: ' + posY;
                template.content.querySelectorAll( '.title-data' )[0].innerHTML = data.Title;
                template.content.querySelectorAll( '.releasedate-data' )[0].innerHTML = data.Released;
                template.content.querySelectorAll( '.director-data' )[0].innerHTML = data.Director;
                template.content.querySelectorAll( '.actors-data' )[0].innerHTML = data.Actors;
                template.content.querySelectorAll( '.plot-data' )[0].innerHTML = data.Plot + ' ' + data.Plot + ' ' + data.Plot;

                var node = document.importNode( template.content, true );

                this.appendChild( node );

            } ).fail( function( e ){
                // TODO: handle errors
            });

        }

    } );

}


function bindButtonHandlers() {

    navButtons.forEach( function( el ){

        el.addEventListener( 'click', function( e ){

            e.stopPropagation();
            e.preventDefault();

            if( isTransforming && blockDuringTransform ){
                return;
            }

            switch( e.target.rel ){

                case 'up':
                    navigateUp();
                    break;

                case 'right':
                    navigateRight();
                    break;

                case 'down':
                    navigateDown();
                    break;

                case 'left':
                    navigateLeft();
                    break;
            }

        });
    });

}


function bindKeyDownHandlers(){

    document.addEventListener( 'keydown', function( e ) {

        if( isTransforming && blockDuringTransform ){
            return;
        }

        switch( e.which ) {

            case 38:
                navigateUp();
                break;

            case 39:
                navigateRight();
                break;

            case 40:
                navigateDown();
                break;

            case 37:
                navigateLeft();
                break ;

            default: return;
        }

        e.preventDefault();

    });
}


function bindTransitionEndHandlers(){

    contentContainer.addEventListener( transitionEndEvent, function(){
        isTransforming = false;
    });

}


function generateContentNodes(){

    var posX = 1;
    var posY = 1;
    var queries = randomContent.split( ' ' );

    var x = 0;
    for( ; x < numberOfElements; x++ ){

        var index = x + 1;
        var node = document.createElement( 'div' );

        node.classList.add( 'content' );
        node.setAttribute( 'data-query', queries[x] );
        node.setAttribute( 'data-pos-x', posX );
        node.setAttribute( 'data-pos-y', posY );

        posX ++;

        if( index % ( maxX + 1 ) === 0 ) {
            node.style.float = 'none';
            posX = 1;
            posY ++;
        }

        contentContainer.appendChild( node );

    }

    addContent();

}


function navigateUp(){

    if( currY === 0 ){
        return;
    }

    currY --;
    navigate();
}

function navigateRight(){

    if( currX === maxX ){
        return;
    }

    currX ++;
    navigate();
}

function navigateDown(){

    if( currY === maxY ){
        return;
    }

    currY ++;
    navigate();
}

function navigateLeft(){

    if( currX === 0 ){
        return;
    }

    currX --;
    navigate();
}


function navigate(){

    toggleNavButtonVisibility();

    isTransforming = true;

    contentContainer.style[transformName] = 'translate(' + currX * -100 + 'vw ,' +  currY * -100 + 'vh )';

}


function toggleNavButtonVisibility(){

    if( currX === 0 ){
        navContainer.classList.remove( 'left' );
    } else {
        navContainer.classList.add( 'left' );
    }

    if( currX === maxX ) {
        navContainer.classList.remove( 'right' );
    } else {
        navContainer.classList.add( 'right' );
    }

    if( currY === 0 ){
        navContainer.classList.remove( 'up' );
    } else {
        navContainer.classList.add( 'up' );
    }

    if( currY === maxY ){
        navContainer.classList.remove( 'down' );
    } else {
        navContainer.classList.add( 'down' );
    }

}



// Utils


// Based on http://stackoverflow.com/a/9090128
function getTransitionEndEvent () {

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
}


// Based on http://stackoverflow.com/a/12621264
function getTransformName(){

    var el = document.createElement( 'p' );
    var transformName;

    transforms = {
        'webkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'transform': 'transform'
    };

    document.body.insertBefore( el, null );

    for ( var t in transforms ) {
        if (el.style[t] !== undefined) {
            transformName = t;
        }
    }

    document.body.removeChild( el );

    return transformName;

}