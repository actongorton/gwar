# GWAR!
_*GateWay Application Relay*_

(ಠ_ಠ)┌∩┐


## What's GWAR!?
GWAR is an American heavy metal band formed in Richmond, Virginia in 1984. 

(ಠ_ಠ) ... **Wut?** 

GWAR! is a microservice gateway to verify third-party apps are allowed 
to write json data to an s3 bucket before sending it forward.

It's made in Flask for convienence, and it's intended to be used as an AWS Lambda.

It relies on an environment variable set to act as an api key for access. 
The environment variable should be set with `GWAR_API_KEY`, e.g. from the command line, 
enter `export GWAR_API_KEY=GWAR_IS_METAL`.

(╯°□°）╯ ︵ ┻━┻  ... **ROCK!**

Yes. 

## How do I use it?

Install by creating first creating a Python virtual environment, activating it, and then installing 
the Python support libraries with `pip install -r requirements.txt`.

POST a JSON payload with the following elements:

- `api_key`: this is a random string of characters that needs to match 
the environment variable on the server.
- `aws_access_key_id`: this is you aws account access key; it should be made up of
20 random characters. It's likely located in your AWS configuration file located at 
`~/.aws/credentials`. If you can't find it, then you'll need to log into your AWS 
account and goto  "My Security Credentials", located at 
https://aws.amazon.com/blogs/security/how-to-find-update-access-keys-password-mfa-aws-management-console/.
- `aws_secret_access_key`: same as item above. It should be 40 characters long.
- `aws_region`: the AWS region that your bucket is located within, e.g. `us-west-2`.
- `s3_bucket`: the name of the bucket you want to upload the file into: e.g. `gwar-bucket`.
Make sure that you've correct set the permissions before trying to upload files. 
You can check them by going to the S3 bucket after logging in, check the box next to 
the name of the bucket, and clicking on `Edit public access settings`.
- `file_name`: the name of the file, complete with any pathways within the bucket.
- `json_payload`: a well-formed json payload that you want written into the file.

Here is a complete example of what the entire POST payload would look like:
```json
{
    "api_key": "foo",
    "aws_access_key_id": "XXXXXXXXXXXXXXXXXXXX",
    "aws_secret_access_key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "aws_region": "us-west-2",
    "s3_bucket": "gwar-bucket",
    "file_name": "test.json",
    "json_payload": {"foo":"bar", "baz": "qux"}
}
```


**┏(-_-)┛┗(-_-﻿ )┓┗(-_-)┛┏(-_-)┓  ... YES, YES, YES!**

Calm down. 

 ## Deploying with Zappa
 
 Deploying as a Lambda function using Zappa is a snap. You'll first need to setup your AWS 
 credentials using the aws command line tool. Ensure that your AWS account has permissions to
 create Lambda functions. If there is a problem when trying to deploy with Zappa, then it'll 
 quickly let you know what it is, so if you haven't added the correct roles, one way to fix it
 is to wait for a Zappa error and then address it.
 
 Create a `zappa_settings.json` file with something like the following in it:
```json
 {
  "dev": {
    "project_name": "gwar",
    "s3_bucket": "apps.gwar",
    "app_function": "app.app",
    "debug": true,
    "log_level": "DEBUG",
    "aws_region": "us-east-1",
    "http_methods": [
      "POST"
    ],
    "parameter_depth": 1,
    "timeout_seconds": 300,
    "memory_size": 128,
    "use_precompiled_packages": true
  },
  "prod": {
    "project_name": "gwar",
    "s3_bucket": "apps.gwar",
    "app_function": "app.app",
    "debug": false,
    "log_level": "ERROR",
    "aws_region": "us-east-1",
    "http_methods": [
      "POST"
    ],
    "parameter_depth": 1,
    "timeout_seconds": 300,
    "memory_size": 128,
    "use_precompiled_packages": true
  }
}
```

## Using with Google Sheets

The particular use case that lead to the development of this tool was the need to write 
`.json` files to an AWS S3 bucket. This allows Google Sheets to be used for handling simple
structured data. 

The included `code.gs` file is meant to be used with Google Sheets. You can add it from within
the Google Sheet by selecting `Tools` from the menu, and then `Script editor`. Copy and paste
the code from `code.gs` into the script, overwriting everything that is already in there by default. 
Be sure to save the changes.

You may need to refresh the page. There might be a warning about granting permissions to the script 
in order for it to run, if so: click `Advanced` and `Proceed`. 

Now when the Sheets load, there will be a menu item at the top called `GWAR!`. Choosing `Publish` 
from the drop-down menu will run the script. 

Before you can actually run the script, you'll need to provide some details for where to publish 
the `.json` data files. 

1) Create a sheet tab at the bottom and name it `values`.
2) Create a column "header" at the top of the sheet, and in the first field `A1` put `key`, 
and in the second field `B1` put `value`. _* this was originally intended to be used with `tarbell.io` 
and this is how it creates Google Sheets._
3) Add the following keys:
- `gwar_url`: _The lambda endpoint that gwar is located at_
- `payload_key`: _This key must match the environment variable set in the gwar lambda_
- `aws_access_key_id`: _Someone's AWS access key_
- `aws_secret_access_key`: _Someone's AWS secret access key_
- `aws_region`: _The aws region that the s3 bucket exists in_
- `bucket`: _The name of the bucket to write the files to_
- `folder`: _The directory of the bucket to write the file to_
- `sheets_list`: _Names of the sheets to pull data from; json will be named after sheet name (comma seperated)_
4) Place the respective key values into the `values` column. 

Now when `GWAR!` is run from Google Sheets, it will serialize the data within each of the 
sheets listed in `sheets_list` and send a `POST` request to the GWAR! Lambda function, which 
will in turn write the payload to the S3 bucket.

### Filters

One thing to watch out for when running the scripts is adjusting any "filters" you might need for the data 
you're serializing. The included `code.gs` contains a function called `filterValues()` that makes changes to 
one of the field values on another sheet. You can either remove the code within the filter entirely, change it, 
or add your own filters. 

### Google Sheets Cron Jobs

A nice little touch to the Google Sheets allows for routine tasks to be fired at specified intervals according to 
a predetermined time and date. The Google Sheet that this is intended for fires the job during the first hour of 
each new morning, every day.

If you want to setup a "cron job", go to the `Script Editor` and click on the `Edit` menu item from the top. Then 
choose `Current project's triggers`. At the bottom/right of the web page will be a button labeled `Add Trigger`. 
Clicking on that button will bring up an overlay with some drop-down choices.

You'll want to do something like the following:
1) Choose which function to run: `doStart`
2) Choose which deployment should run: `Head`
3) Select event source: `Time-driven`
4) Select type of time based trigger: `Day timer`
5) Select time of day: `Midnight to 1am`

Feel free to adjust any of this as needed for your specific tasks.





