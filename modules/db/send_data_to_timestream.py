import boto3
import time
import random
import json

# Polygon.io Quotes Stream API Definition
# https://polygon.io/docs/stocks/ws_stocks_q

# Amazon Timestream configuration
timestream_client = boto3.client('timestream-write', region_name='us-east-1')
database_name = 'DeskheadMarketDataTest-1'
table_name = 'stock_quotes'

def generate_sample_data():
    return {
        "ev": "Q",
        "sym": random.choice(["MSFT", "AAPL", "GOOGL", "AMZN"]),
        "bx": random.randint(1, 10),
        "bp": round(random.uniform(100, 200), 3),
        "bs": random.randint(1, 1000),
        "ax": random.randint(1, 10),
        "ap": round(random.uniform(100, 200), 3),
        "as": random.randint(1, 1000),
        "c": random.randint(0, 5),
        "i": [random.randint(600, 700)],
        "t": int(time.time() * 1000),
        "q": random.randint(50000000, 60000000),
        "z": random.randint(1, 3)
    }


def prepare_common_attributes(data):
    common_attributes = {
        'Dimensions': [
            {'Name': 'sym', 'Value': data['sym']},
            {'Name': 'ev', 'Value': data['ev']},
            {'Name': 'bx', 'Value': str(data['bx'])},
            {'Name': 'ax', 'Value': str(data['ax'])},
            {'Name': 'c', 'Value': str(data['c'])},
            {'Name': 'z', 'Value': str(data['z'])}
        ],
        'MeasureName': 'stock_quote',
        'MeasureValueType': 'MULTI'
    }
    return common_attributes


def prepare_record(data):
    record = {
        'Time': str(data['t']),
        'MeasureValues': [
            {'Name': 'bs', 'Value': str(data['bs']), 'Type': 'BIGINT'},
            {'Name': 'ap', 'Value': str(data['ap']), 'Type': 'DOUBLE'},
            {'Name': 'bp', 'Value': str(data['bp']), 'Type': 'DOUBLE'},
            {'Name': 'as', 'Value': str(data['as']), 'Type': 'BIGINT'},
            {'Name': 'i', 'Value': json.dumps(data['i']), 'Type': 'VARCHAR'},
            {'Name': 'q', 'Value': str(data['q']), 'Type': 'BIGINT'}
        ]
    }
    return record


def send_to_timestream(data):
    common_attributes = prepare_common_attributes(data)
    record = prepare_record(data)

    try:
        result = timestream_client.write_records(
            DatabaseName=database_name,
            TableName=table_name,
            CommonAttributes=common_attributes,
            Records=[record]
        )
        print(f"Successfully wrote record to Timestream: {result['RecordsIngested']['Total']}")
    except timestream_client.exceptions.RejectedRecordsException as e:
        print("Some records were rejected:")
        for rejected in e.response['RejectedRecords']:
            print(f"Rejected record index: {rejected['RecordIndex']}")
            print(f"Reason: {rejected['Reason']}")
            if 'ExistingVersion' in rejected:
                print(f"Existing Version: {rejected['ExistingVersion']}")

def main():
    while True:
        record = generate_sample_data()
        send_to_timestream(record)
        time.sleep(0.1)  # Adjust this value to control the rate of data generation
        break

if __name__ == "__main__":
    main()