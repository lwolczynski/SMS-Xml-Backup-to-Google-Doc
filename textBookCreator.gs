<script src="/styles.gs"></script>

var resultJson = 'result.json'; // result filename here; file must be present on Google Drive

function main() {
  var body = DocumentApp.getActiveDocument().getBody();
  body.clear();
  setBodyParams(body);
  var id = searchFiles(resultJson);
  var lines = parseJson(id);
  writeToFile(lines);
}

function parseJson(id) {
  var file = DriveApp.getFileById(id);
  var data = file.getBlob().getDataAsString();
  var json = JSON.parse(data);
  return json;
}

function searchFiles(str) {
  var searchText = 'title contains "'+str+'" and trashed=false';
  var files = DriveApp.searchFiles(searchText);
  while (files.hasNext()) {
    var file = files.next();
    return file.getId();
  }
}

function writeToFile(jsonFile) {
  for (i in jsonFile) {
    // save document after every 2000 entries
    if (i%2000 == 0) {
      DocumentApp.getActiveDocument().saveAndClose();
      body = DocumentApp.getActiveDocument().getBody();
    }  
    if (jsonFile[i].type === 'sms') {
      applyParagraphStyle(body.appendParagraph(jsonFile[i].text.toString()), jsonFile[i].dir);
      applyDateStyle(body.appendParagraph(jsonFile[i].date), jsonFile[i].dir);
    } else if (jsonFile[i].type === 'mms') {
      var table = jsonFile[i].content;
      for (var j in table) {  
        for (var key in table[j]) {
          if (key === "text/plain") {
            applyParagraphStyle(body.appendParagraph(table[j][key].toString()), jsonFile[i].dir);
          } else if (key.indexOf('image') !== -1) {
            var imgId = searchFiles(table[j][key])
            var img = DriveApp.getFileById(imgId).getBlob();
            var imgPar = body.appendImage(img);
            formatImage(imgPar);
            applyParagraphStyle(imgPar.getParent(), jsonFile[i].dir)
          } else {
            applyParagraphStyle(body.appendParagraph('<<'+table[j][key]+'>>'), jsonFile[i].dir);
          }
        }
      }
      applyDateStyle(body.appendParagraph(jsonFile[i].date), jsonFile[i].dir);
    }
  }
}

function applyParagraphStyle(par, dir) {
  if (dir === 'sent') { 
    setStyleSent(par);
  } else if (dir === 'received') {
    setStyleReceived(par);   
  }
}

function applyDateStyle(par, dir) {
  if (dir === 'sent') { 
    setDateStyleSent(par);
  } else if (dir === 'received') {
    setDateStyleReceived(par);   
  }
}