var getContainer = function() {
  var container = document.getElementById("rhs");
  return container;
}

var element = document.createElement('div');

function decodeHTMLEntities(str) {
  if(str && typeof str === 'string') {
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    element.innerHTML = str;
    str = element.textContent;
    element.textContent = '';
  }
  return str;
}

var createTextDiv = function(titleString, textString, subReditText, urlText, imageLink) {
  var title = document.createElement("span");
  title.appendChild(document.createTextNode(titleString));
  title.style.display="block"
  title.style.paddingTop="15px"
  title.style.paddingLeft="15px"
  title.style.paddingRight="15px"
  title.style.color="#222"
  title.style.fontSize="24px"
  title.style.position="relative"

  var titleLink = document.createElement('a');
  titleLink.appendChild(title);
  titleLink.title = titleString;
  titleLink.target="_blank"
  titleLink.href = "https://www.reddit.com" + urlText;

  var image;
  if (imageLink.endsWith("jpg") || imageLink.endsWith("png") || imageLink.endsWith("gif")
  || imageLink.endsWith("jpeg")) {
    image = document.createElement("img");
    image.style.width="100%"
    image.style.paddingTop="15px"
    image.src = imageLink;
  }

  var text = document.createElement("span")
  text.innerHTML = textString;
  text.style.paddingTop="15px"
  text.style.paddingLeft="15px"
  text.style.paddingRight="15px"
  text.style.display="block"

  var subRedit = document.createElement('a');
  subRedit.appendChild(document.createTextNode(subReditText));
  subRedit.title = subReditText;
  subRedit.target="_blank"
  subRedit.style.paddingTop="15px"
  subRedit.style.paddingLeft="15px"
  subRedit.style.paddingRight="15px"
  subRedit.href = "https://www.reddit.com/" + subReditText;

  var innerDiv = document.createElement("div");
  innerDiv.style.lineHeight="1.24";
  innerDiv.style.margin="6px -32px 0 2px";
  innerDiv.style.paddingBottom="7px";
  innerDiv.style.boxShadow="0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08)";
  innerDiv.style.border="none";
  innerDiv.style.borderRadius="2px";
  innerDiv.appendChild(titleLink);
  if (image != undefined)
    innerDiv.appendChild(image);
  innerDiv.appendChild(text);
  innerDiv.appendChild(subRedit);

  return innerDiv;
}

var url = new URL(window.location.href)
var q = url.searchParams.get("q")
if (q != null)  {
  var redditUrl = "https://www.reddit.com/search.json?q=" + q + "&sort=relevance&t=all&limit=25"
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var json = JSON.parse(xmlHttp.responseText)
        if (json.data.children.length == 0) {
          return;
        }
        var number = Math.floor(Math.random() * json.data.children.length);
        var title = json.data.children[number].data.title;
        var text = json.data.children[number].data.selftext_html;
        text = decodeHTMLEntities(text);
        var subRedit = json.data.children[number].data.subreddit_name_prefixed;
        var link = json.data.children[number].data.permalink;
        var image = json.data.children[number].data.url;
        getContainer().appendChild(createTextDiv(title, text, subRedit, link, image));
      }
  }
  xmlHttp.open("GET", redditUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
