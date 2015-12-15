/*

Gets all the things that a page may require for being put together
So that simple sites can easily be put together and then page content can be created just by writing html/markdown files

*/

// first some code to load necessary files
function loadfile(filename) {
  var fileref;
  var filetype = filename.split('?')[0].split('#')[0].split('.').pop();
	if ( filetype == "js" ) {
		fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
	} else if ( filetype == "css" ) {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	if ( typeof fileref != "undefined" ) document.getElementsByTagName("head")[0].appendChild(fileref);
}


// now the actual function that gets things for the page
var getter = function(baseurl,content,header,footer,resources,scroll,append) {

	if (baseurl === undefined) baseurl = window.location.href.replace('://','______').split('/')[0].replace('______','://');
	if (content === undefined) content = 'content';
  
  // get the separate header and the footer, unless false
  if (header === undefined) header = 'header.html';
  if (footer === undefined) footer = 'footer.html';
	if ( header ) $.get(header, function(data) { $('body').prepend(data); });
	if ( footer ) $.get(footer, function(data) { $('body').append(data); });

  // expect a nav.html file too? To list nav options and prev/next order? But if not found, what?
	// and perhaps a wrapper start and end for each page part?

  // load any specified resources - should be a list
  //if (resources === undefined) resources = ['jq','bs','fa','holder'];
  if ( resources ) {
    // refs, headers, contents from phd work? annotator?
    for ( var r in resources ) {
      var res = resources[r];
			if ( res === 'jq' ) loadfile('http://static.cottagelabs.com/jquery-1.10.2.min.js');
      if ( res === 'd3' ) loadfile('http://static.cottagelabs.com/d3/d3.min.js');
      if ( res === 'fa' ) loadfile('https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css');
      if ( res === 'bs' ) { loadfile('http://static.cottagelabs.com/bootstrap-3.0.3/js/bootstrap.min.js'); loadfile('http://static.cottagelabs.com/bootstrap-3.0.3/css/bootstrap.min.css'); }
      if ( res === 'md' ) loadfile('http://static.cottagelabs.com/marked.js');
      if ( res === 'holder' ) loadfile('http://static.cottagelabs.com/holder/jquery.holder.js');
      if ( res.indexOf('http') !== -1 ) loadfile(res);
    }
  }
	
	if (append === undefined) append = true;
	var current = 'index';
 	var next = window.location.pathname;
	if (next.substr(0,1) === '/') next = next.substr(1);
	if (next.length === 0) next = 'index';
	//, title, published, author, tags;
	var getting = false;
	var getpage = function() {
		if (getting) return; // if already getting, do nothing more
		getting = true;
		current = next;
		var url = baseurl + '/' + content + '/' + next;

		if ( append && $('getter').last().html().length !== 0 ) $('getter').last().after('<getter></getter>');
		$('getter').last().load(url, function (r, s, xhr) {
			if (xhr.status === 200 ) {
				$('getter').last().find('markdown').each(function() { $(this).after(marked($(this).html())); });

				// (re)set some vars based on latest pulled page content
				/*title = last.getElementsByTagName('title')[0].innerHTML;
				published = last.getElementsByTagName('published')[0].innerHTML;
				author = last.getElementsByTagName('author')[0].innerHTML;*/
				try {next = $('next').last().html();} catch(err) {}
				//tags = last.getElementsByTagName('tags')[0].innerHTML.split(',');
			} else {
				// a suitable nginx route could configure this to return a custom 404 for if page content file does not exist
				// in which case actually the request would seem to succeed but the content of the 404 file would be shown
				$('getter').last().html('404 - file not found');
			}

			setTimeout(function() { getting = false;}, 1000);
		});
				
		// pushstate if possible
		try {
			if ('pushState' in window.history && next !== 'index') window.history.pushState('', 'New URL: ' + baseurl + '/' + next, baseurl + '/' + next);
		} catch(err) {
			console.log('pushstate not working! Although, note, it seems to fail on local file views these days...' + err);
		}

	}
	getpage(); // on first page load, get the first page content
		
	// if scroll ability is requested, setup a check for hitting page bottom then getpage
	if ( scroll === undefined ) scroll = true;
	if (scroll) {
		$(window).scroll(function() {
			if ( !getting && (next !== current) && (next !== undefined) && $(window).scrollTop() == $(document).height() - $(window).height() ) {
				getpage();
			}
		});
	}


  
  
}



