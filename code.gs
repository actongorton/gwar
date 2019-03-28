/**
*
* SERIALIZE THE DATA IN THE SPREADSHEETS AND PUSH TO GWAR!
*
**/

/**
*  Commonly used variables
**/
var gwar_url,
  payload_key,
  aws_access_key_id,
  aws_secret_access_key,
  aws_region,
  bucket,
  folder;

/**
*  Create menu
**/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('GWAR!')
    .addItem('Publish', 'doStart')
    .addToUi();
}

/**
*  Push the seralized data to GWAR!
**/
function pushToGWAR(sheet_name, gwar_payload){
  // create a file name using the sheet_name
  var file_name = folder + '/' + sheet_name + '.json';
  // create json payload parameters
  var payload = {
    'api_key': payload_key,
    'aws_access_key_id': aws_access_key_id,
    'aws_secret_access_key': aws_secret_access_key,
    'aws_region': aws_region,
    's3_bucket': bucket,
    'file_name': file_name,
    'json_payload': gwar_payload
  }
  // create request
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  UrlFetchApp.fetch(gwar_url, options);
}

/**
*  Filters based on predefined values
**/
function filterValues(sheet_name, gwar_payload){
  // debugging update
  Logger.log('checking filters');

  // filter based on today's date
  gwar_payload = gwar_payload.filter(function(x){
    if ( Date.parse(x['date']) >= Date.now() ){
      return true
    }
    else {
      return false
    }
  });

  // trim to six records
  gwar_payload = gwar_payload.slice(0, 6);

  // push to GWAR!
  pushToGWAR(sheet_name, gwar_payload);
}

/**
*  Create from data passed in
**/
function serializeData(sheet_name, header_values, data_values){
  // instantiate an empty dictionary:
  var gwar_payload = [];
  // loop through each row:
  data_values.map(function(values_row){
    // create temporary dictionary
    var temp_dict = {}
    // zip the two arrays into dictionaries
    values_row.map(function(e, i){
      temp_dict[header_values[i]] = e
    });
    // push tmp_dict object to sheet_data:
    gwar_payload.push(temp_dict);
  });
  // push to gwar!
  filterValues(sheet_name, gwar_payload);
}

/**
*  Selects the sheet and serializes all of the data into json
**/
function processSheetData(sheet_name){
  // log sheet name:
  Logger.log('parsing ' + sheet_name);
  // get active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  // get the values from the "values" sheet:
  var values_sheet = sheet.getSheetByName(sheet_name);
  // grab just the first row, this will be used for the dictionary keys:
  var header_values = values_sheet.getRange(1, 1, 1, values_sheet.getLastColumn()).getValues()[0];
  // grab the rest of the data:
  var data_values = values_sheet.getRange(2, 1, values_sheet.getLastRow(), values_sheet.getLastColumn()).getValues();
  // create a dictionary object, append to the sheet_data dictionary:
  serializeData(sheet_name, header_values, data_values);
}

/**
*  Collect and organize the sheets to parse
**/
function doStart() {
  // get active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  // get the values from the "values" sheet:
  var values_sheet = sheet.getSheetByName("values");
  // select the values:
  var range_values = values_sheet.getRange(1, 1, values_sheet.getLastRow(), 2);
  // build a dictionary of values:
  var values_dict = {};
  range_values.getValues().map(function (v){
    var key = v[0];
    var value = v[1];
    values_dict[key] = value;
  });
  // assign necessary variables to global scope:
  gwar_url = values_dict['gwar_url'];
  payload_key = values_dict['payload_key'];
  aws_access_key_id = values_dict['aws_access_key_id'];
  aws_secret_access_key = values_dict['aws_secret_access_key'];
  aws_region = values_dict['aws_region'];
  folder = values_dict['folder'];
  bucket = values_dict['bucket'];
  // use the `sheets` key to build a list of the sheets needed for grabbing data:
  var sheets_selection = values_dict['sheets_list'].split(',');
  // loop through sheets_selection and create json from the sheet data:
  sheets_selection.map(function (s){
    // pass the name of the sheet onto the serializer function; trim the name to remove any hidden whitespace values:
    processSheetData(s.trim())
  });
}
