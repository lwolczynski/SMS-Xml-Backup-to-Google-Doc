var textFont = {};
textFont[DocumentApp.Attribute.FONT_SIZE] = 12;
textFont[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';

var dateFont = {};
dateFont[DocumentApp.Attribute.FONT_SIZE] = 8;
textFont[DocumentApp.Attribute.FONT_FAMILY] = 'Helvetica Neue';
dateFont[DocumentApp.Attribute.SPACING_AFTER] = 12;

var intentSize = 100;

function setStyleSent(par) {
  par.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  par.setIndentFirstLine(intentSize);
  par.setIndentStart(intentSize);
  par.setAttributes(textFont);
}

function setStyleReceived(par) {
  par.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  par.setIndentEnd(intentSize);
  par.setAttributes(textFont);
}

function setDateStyleSent(par) {
  par.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  par.setAttributes(dateFont);
}

function setDateStyleReceived(par) {
  par.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  par.setAttributes(dateFont);
}

function setDateStyleReceived(par) {
  par.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
  par.setAttributes(dateFont);
}

function formatImage(img) {
  var orgImgWidth = img.getWidth();
  img.setWidth(250);
  img.setHeight(img.getHeight()*250/orgImgWidth); 
}

function setBodyParams(body) {
  var marginSize = 50;
  body.setPageWidth(450);
  body.setMarginTop(marginSize);
  body.setMarginBottom(marginSize);
  body.setMarginLeft(marginSize);
  body.setMarginRight(marginSize); 
}