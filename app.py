from flask import Flask, abort, request
import io
import json
import os
import boto3

app = Flask(__name__)


@app.route('/', methods=['POST'])
def gateway():

    # post should contain json
    if not request.json:
        abort(400)

    # json should include all necessary data
    request_payload = request.json

    # define the payload elements we need
    elements = [
        'api_key',
        'aws_access_key_id',
        'aws_secret_access_key',
        'aws_region',
        's3_bucket',
        'file_name',
        'json_payload'
    ]

    # abort if the payload is missing any required elements
    abort(400) if len([e for e in elements if e not in request_payload]) > 0 else False

    try:

        # make things easier to reference
        gateway_key = os.environ.get('GWAR_API_KEY')  # the api key used to secure this gateway
        payload_key = request_payload['api_key']  # the api key sent within the payload
        aws_access_key_id = request_payload['aws_access_key_id']  # aws access key id
        aws_secret_access_key = request_payload['aws_secret_access_key']  # aws secret access key
        aws_region = request_payload['aws_region']  # the region used for the s3 bucket
        bucket = request_payload['s3_bucket']  # the final destination to write the payload
        file_name = request_payload['file_name']   # the name of the file
        json_payload = request_payload['json_payload']  # the json payload to write to the s3 bucket

        # abort if the api keys don't match
        abort(400) if gateway_key != payload_key else False

        # create a file object with the data
        file_object = io.StringIO(json.dumps(json_payload))

        # create the s3 bucket connection using boto
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client
        s3_client = boto3.client(
            service_name='s3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=aws_region
        )

        # upload the file
        s3_client.put_object(Bucket=bucket, Key=file_name, Body=file_object.read())

    except ConnectionError:
        abort(400)

    except SystemExit:
        abort(500)

    # No failures, everything okay
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == '__main__':
    app.run()
