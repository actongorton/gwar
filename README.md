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
The environment variable should be set with `GWAR_API_KEY`, e.g. from the command line, enter `export GWAR_API_KEY=GWAR_IS_METAL`.

(╯°□°）╯ ︵ ┻━┻  ... **ROCK!**

Yes. 

## How do I use it?

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

 

