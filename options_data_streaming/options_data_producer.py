from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import time
import random
import boto3
from botocore.config import Config
import traceback

# AWS and Kafka configuration
aws_region = 'us-east-1'
msk_cluster_arn = 'arn:aws:kafka:us-east-1:656501537184:cluster/deskhead-mvp-cluster-2/8bbee537-96fc-416f-9038-b207d80327e4-10'

def get_msk_config():
    """Retrieve MSK cluster configuration"""
    try:
        client = boto3.client('kafka', region_name=aws_region)
        response = client.get_bootstrap_brokers(ClusterArn=msk_cluster_arn)
        # print(f"AWS MSK Response: {json.dumps(response, default=str, indent=4)}")
        
        if 'BootstrapBrokerString' in response:
            return response['BootstrapBrokerString'].split(','), 'PLAINTEXT'
        elif 'BootstrapBrokerStringTls' in response:
            return response['BootstrapBrokerStringTls'].split(','), 'SSL'
        else:
            raise ValueError("No suitable bootstrap servers found in the response")
    except Exception as e:
        print(f"Error retrieving MSK configuration: {str(e)}")
        raise

try:
    bootstrap_servers, security_protocol = get_msk_config()
    print(f"Bootstrap Servers: {bootstrap_servers}")
    print(f"Security Protocol: {security_protocol}")

    boto3_config = Config(region_name=aws_region)

    kafka_config = {
        'bootstrap_servers': bootstrap_servers,
        'security_protocol': security_protocol,
        'value_serializer': lambda v: json.dumps(v).encode('utf-8'),
        'acks': 'all',
        'retries': 3,
        'api_version': (2, 8, 1),
        'client_id': 'msk-producer'
    }

    # Remove IAM-specific configurations as we're not using IAM authentication
    kafka_config.pop('sasl_mechanism', None)
    kafka_config.pop('sasl_oauth_token_provider', None)

    # print(f"Kafka configuration: {json.dumps(kafka_config, default=str)}")

    producer = KafkaProducer(**kafka_config)
    print("Successfully created Kafka producer")

except Exception as e:
    print(f"Failed to create Kafka producer: {str(e)}")
    exit(1)

def generate_option_data():
    """Generate mock option data"""
    return {
        "symbol": random.choice(["AAPL", "GOOGL", "MSFT", "AMZN"]),
        "strike": round(random.uniform(100, 200), 2),
        "price": round(random.uniform(1, 10), 2),
        "volume": random.randint(100, 10000),
        "timestamp": time.time()
    }

def send_option_data():
    """Send option data to Kafka topic"""
    option_data = generate_option_data()
    print(f"Attempting to send: {option_data}")
    try:
        future = producer.send('options_pricing_data', option_data)
        print("Message sent to producer, waiting for acknowledgement...")
        record_metadata = future.get(timeout=30)
        print(f"Sent: {option_data}")
        print(f"Sent to partition {record_metadata.partition}, offset {record_metadata.offset}")
    except KafkaError as e:
        print(f"KafkaError: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {traceback.format_exc()}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {traceback.format_exc()}")

def main():
    try:
        while True:
            send_option_data()
            time.sleep(1)  # Send data every second
    except KeyboardInterrupt:
        print("Stopping producer...")
    finally:
        producer.close()

if __name__ == "__main__":
    main()