# getter

A node.js static site generator that can also auto-load next pages

Version 0.2.0


# CAVEATS

Dynamically loading content for a page will probably also get any scripts that you try to load via script tags, BUT if those tags call 
code that then tries to do a document.write they will not succeed. So for example embedding github gists does not work :(

# HOWTO
Clone this repo. You get the main code which is in getter.js and an index.html file

Have a look at the index.html file - it is like normal, it includes some things, particularly jquery then getter.js (which requires jquery).

It also at the top in the head has a call inside jquery ready to call getter.js - by default, it works fine.

Then it has a div in it called &lt;getter&gt;&lt;/getter&gt; - that controls the magic.

There is a folder called content, in which you should put your files that contain content. They are page snippets. 
Have a look at the examples. There can be subfolders in there, they will work fine.

The options of getter are the following, and can be set when calling the app with getter();

baseurl - is inferred from the URL that the site will be served at, or can be overridden.

content - is the route to the content folder from the getter directory level. So by default it is content. But if for example you want your content files 
to be in a separate repo that you can then just sync in there, you could clone that repo and say it is called "mycontent" then set the content variable of getter to be "mycontent".

header - is the filename of the header content you want to have included. By default it is header.html. NOTE: the header content can also just be 
written into index.html and so this may not be that useful and may be removed. But for now it is there, either set it differently if necessary or set if false if you don't need any.

footer - is as header but goes at the bottom.

resources - is a list of resources you would like loaded. This is also just a convenience as they can be in the head of index.html anyway, so this feature may be removed.
These resources can be URLs to .js or .css files. They can also be shortcodes, jq (jquery) d3 (d3) fa (font-awesome) bs (bootstrap) md (marked markdown) holder (see the CL holder repo).

scroll - if this is true, which it is by default, then hitting the bottom of the page will automatically try to load the next page. This is defined by having an html tag in the 
content called &lt;next&gt;&lt;/next&gt; - and the content of that tag should be the relative route to the page from INSIDE the content directory.

append - if this is true, which it is by default, then hitting the bottom of the page results in the next page being appended to the current page rather than overwriting it.


TODO: It should also be possible to change the getter variables by including them as html tags within the page content that is loaded, so that a new page can stop scrolling or appending, for example.
This will be done by making the options an object and then checking for each of them as tags in the latest loaded content.

TODO: have wrapper start and end for each appended page content, so they can be easily wrapped by default. These could be loaded from files like header and footer, or could just be read from index.html on the first load.

# ROUTING AND CONTENT

If the content of this repo is served at mysite.com then a request to mysite.com/my/file will serve the content found in the file at content/my/file.

If mysite.com/content/my is requested, then the content of the file at content/my/index will be served.

If the default nignx config - or one similar - is used, then requests for content in a file will also check for that file with the .html extension appended, just in case.

